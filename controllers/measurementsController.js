const db = require('../db/measurementsDB');

const getMeasurements = () => db.getMeasurements()

const fetchMeasurements = async (ctx) => {
  try {
    const measurements = await getMeasurements();
    ctx.status = 200;
    ctx.body = measurements;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
};

module.exports = {
  fetchMeasurements,
};
