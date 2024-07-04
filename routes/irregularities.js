const Router = require('koa-router');
const { fetchIrregularities } = require('../controllers/irregularitiesController');

const router = new Router();

router.get('/irregularities', fetchIrregularities);

module.exports = router;
