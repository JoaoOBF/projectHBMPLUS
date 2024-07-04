const Router = require('koa-router');
const measurementsRouter = require('./measurements');
const irregularitiesRouter = require('./irregularities');
const path = require('path');
const fs = require('fs');

const router = new Router();

router.get('/', async (ctx) => {
    const indexPath = path.join(__dirname, 'views', 'index.html');
    ctx.type = 'html';
    ctx.body = fs.createReadStream(indexPath);
});

router.use(measurementsRouter.routes());
router.use(irregularitiesRouter.routes());

module.exports = router;
