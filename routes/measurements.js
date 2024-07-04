const Router = require('koa-router');
const { fetchMeasurements } = require('../controllers/measurementsController');

const router = new Router();

router.get('/measurements', fetchMeasurements);

module.exports = router;