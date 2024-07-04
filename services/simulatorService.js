const { calculateBaseline, checkAnomalies } = require('./analysisHeartBeatService')
const measurementsDB = require('../db/measurementsDB')
const irregularitiesDB = require('../db/irregularitiesDB')

let measurements = [];
let alertTriggered = false;
const measurementsPerCheck = 60;
let interval

const normal = (socketConnection) => {
    interval = setInterval(async () => {
        const x = 100 - getRandomNumber();
        const heartRateData = calculateBaseline(x);
        await measurementsDB.recordMeasurement(heartRateData)
        socketConnection.send(JSON.stringify({ heartRate: heartRateData }));
    }, 1000);
}

const abnormal = (socketConnection) => {
    let measurementCount = 0;
    let startTime = Date.now();
    let x = 0;
    let id;
    interval = setInterval(async () => {
        const currentTime = Date.now();
        x = alertTriggered ? 100 - getRandomNumber() : currentTime - startTime;
        const heartRateData = calculateBaseline(x);
        await measurementsDB.recordMeasurement(heartRateData)
        socketConnection.send(JSON.stringify({ heartRate: heartRateData }));
        measurements.push(heartRateData);
        measurementCount++;
        if (measurementCount === measurementsPerCheck) {
            measurementCount = 0;
            const result = checkAnomalies(measurements);
            if (result) {
                if (!alertTriggered) {
                    alertTriggered = true;
                    socketConnection.send(JSON.stringify({ alert: 'bip' }));
                    id = await irregularitiesDB.recordIrregularities()
                }
            } else {
                if (alertTriggered) {
                    alertTriggered = false;
                    socketConnection.send(JSON.stringify({ alert: 'bip-bip' }));
                    await irregularitiesDB.recordIrregularitieEnd(id)
                }
            }
            measurements = [];
        }
    }, 100);

}

const reset = () => {
    clearInterval(interval);
    measurements = [];
    alertTriggered = false;
}

const getRandomNumber = () => {
    return Math.floor(Math.random() * 14) + 1;
}

module.exports = {
    normal,
    abnormal,
    reset
}