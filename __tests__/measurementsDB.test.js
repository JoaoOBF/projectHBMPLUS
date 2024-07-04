const dayjs = require('dayjs');
const db = require('../db/connectionDB');
const { recordMeasurement, getMeasurements } = require('../db/measurementsDB');

jest.mock('../db/connectionDB', () => {
  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database(':memory:');
  return db;
});

describe('MeasurementDB Test', () => {
    beforeAll((done) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS measurements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                heartRate INTEGER,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`, done);
        });
    });

    beforeEach((done) => {
        db.serialize(() => {
            db.run(`DELETE FROM measurements`, done);
        });
    });

    afterAll((done) => {
        db.serialize(() => {
            db.run(`DROP TABLE IF EXISTS measurements`, done);
        });
    });

    test('recordMeasurement inserts a new measurement', async () => {
        const value = 75;
        const id = await recordMeasurement(value);

        const measurement = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM measurements WHERE id = ?`, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        expect(measurement).toBeDefined();
        expect(measurement.heartRate).toBe(value);
    });

    test('getMeasurements retrieves measurements from the last 30 days by default', async () => {
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const oldDate = dayjs().subtract(31, 'day').format('YYYY-MM-DD HH:mm:ss');

        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO measurements (heartRate, timestamp) VALUES (?, ?)`, [80, oldDate], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await recordMeasurement(85);

        const measurements = await getMeasurements();

        expect(measurements).toHaveLength(1);
        expect(measurements[0].heartRate).toBe(85);
    });

    test('getMeasurements retrieves measurements from the specified number of days', async () => {
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const oldDate = dayjs().subtract(15, 'day').format('YYYY-MM-DD HH:mm:ss');
        const olderDate = dayjs().subtract(31, 'day').format('YYYY-MM-DD HH:mm:ss');

        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO measurements (heartRate, timestamp) VALUES (?, ?)`, [75, oldDate], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO measurements (heartRate, timestamp) VALUES (?, ?)`, [70, olderDate], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await recordMeasurement(85);

        const measurements = await getMeasurements(15);

        expect(measurements).toHaveLength(2);
        expect(measurements[0].heartRate).toBe(75);
        expect(measurements[1].heartRate).toBe(85);
    });
});
