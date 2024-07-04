const db = require('./connectionDB');

const getAllIrregularities = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM irregularities`, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const recordIrregularities = () => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO irregularities DEFAULT VALUES`, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};

const recordIrregularitieEnd = (id) => new Promise((resolve, reject) => {
  db.get(`UPDATE irregularities SET end = CURRENT_TIMESTAMP WHERE id = ?`, [id], (err, row) => {
    if (err) {
      reject(err);
    } else {
      resolve(row);
    }
  });
});

module.exports = {
  getAllIrregularities,
  recordIrregularities,
  recordIrregularitieEnd
}