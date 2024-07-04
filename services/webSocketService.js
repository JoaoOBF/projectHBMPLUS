const { normal, abnormal, reset } = require('./simulatorService')
const WebSocket = require('ws');

const start = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const params = new URLSearchParams(req.url.split('?')[1]);
        const type = params.get('type');
        if (type === 'normal') {
            normal(ws)
        }
        if (type === 'abnormal') {
            abnormal(ws)
        }
        ws.on('close', () => {
            console.log('Client disconnected');
            reset()
        });
    });
}

module.exports = {
    start,
}