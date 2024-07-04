const db = require('../db/irregularitiesDB');

const getIrregularities = () => db.getAllIrregularities()

const fetchIrregularities = async (ctx) => {
  try {
    const irregularities = await getIrregularities();
    ctx.status = 200;
    ctx.body = irregularities;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
};

module.exports = {
  fetchIrregularities,
};
