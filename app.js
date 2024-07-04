const Koa = require('koa');
const initializeDatabase = require('./db/initializeDatabase');
const { start } = require('./services/webSocketService')
const koaBody = require('koa-body');
const app = new Koa();
const router = require('./routes');
const port = 3000;
const path = require('path');


initializeDatabase()
app.use(koaBody.koaBody());
app.use(require('koa-static')(path.join(__dirname, 'views')));
app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(port, () => {
  console.log(`Koa server is running on http://localhost:${port}`);
});

start(server)
module.exports = server;
