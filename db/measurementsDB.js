const dayjs = require('dayjs');
const db = require('./connectionDB');

const recordMeasurement = (value) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO measurements (heartRate) VALUES (?)`, [value], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

const getMeasurements = (days = 30) => {
    const fromDate = dayjs().subtract(days, 'day').format('YYYY-MM-DD HH:mm:ss');
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM measurements WHERE timestamp >= ?`, [fromDate], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = {
    recordMeasurement,
    getMeasurements
}