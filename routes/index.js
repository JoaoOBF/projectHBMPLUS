const Router = require('koa-router');
const measurementsRouter = require('./measurements');
const irregularitiesRouter = require('./irregularities');
const path = require('path');
const fs = require('fs');

const router = new Router();

router.get('/', async (ctx) => {
    const indexPath = path.join(__dirname, 'views', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf-8');
    const port = process.env.PORT || 3000;
    const domain = process.env.DOMAIN || `http://localhost:${port}`;
    html = html.replace('{{DOMAIN}}', domain);
    ctx.type = 'html';
    ctx.body = html;
});

router.use(measurementsRouter.routes());
router.use(irregularitiesRouter.routes());

module.exports = router;
