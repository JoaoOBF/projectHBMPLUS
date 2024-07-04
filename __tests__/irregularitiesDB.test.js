const db = require('../db/connectionDB');
const {
  getAllIrregularities,
  recordIrregularities,
  recordIrregularitieEnd
} = require('../db/irregularitiesDB');

jest.mock('../db/connectionDB', () => {
  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database(':memory:');
  return db;
});

beforeAll((done) => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS irregularities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end TIMESTAMP
      )
    `, done);
  });
});

beforeEach((done) => {
  db.serialize(() => {
    db.run(`DELETE FROM irregularities`, done);
  });
});

test('getAllIrregularities retrieves all records from the irregularities table', async () => {
  db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO irregularities (start, end) VALUES (?, ?)`);
    stmt.run('2023-01-01 00:00:00', '2023-01-01 01:00:00');
    stmt.finalize();
  });

  const result = await getAllIrregularities();
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    id: expect.any(Number),
    start: '2023-01-01 00:00:00',
    end: '2023-01-01 01:00:00'
  });
});

test('recordIrregularities inserts a new record into the irregularities table', async () => {
  const id = await recordIrregularities();
  const result = await getAllIrregularities();
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    id: id,
    start: expect.any(String),
    end: null
  });
});

test('recordIrregularitieEnd updates the end timestamp of an irregularity', async () => {
  const id = await recordIrregularities();
  await recordIrregularitieEnd(id);
  const result = await getAllIrregularities();
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject({
    id: id,
    start: expect.any(String),
    end: expect.any(String)
  });
});
