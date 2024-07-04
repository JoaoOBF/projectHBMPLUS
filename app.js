const Koa = require('koa');
const path = require('path');
const mount = require('koa-mount');
const koaBody = require('koa-body');
const initializeDatabase = require('./db/initializeDatabase');
const { start } = require('./services/webSocketService');
const router = require('./routes');

const app = new Koa();
const port = process.env.PORT || 3000;

initializeDatabase();

app.use(koaBody.koaBody());

app.use(require('koa-static')(path.join(__dirname, 'views')));

app.use(mount(`/api/v1`, router.routes())).use(router.allowedMethods());

const server = app.listen(port, () => {
  console.log(`Koa server is running on http://localhost:${port}`);
});

start(server);

module.exports = server;
