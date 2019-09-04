// 导入WebSocket模块:
const WebSocket = require('ws');
function setValueIfUndefined(obj, key, value) {
  if(obj[key] === undefined) {
    obj[key] = value
    return true
  } else {
    return false
  }
}
// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    port: 8090
});
wss.bordecast = function (message, ws) {
  wss.clients.filter(connect => connect.roomId === ws.roomId && connect.roomId !== undefined && connect !== ws).forEach(connect => {
    connect.send(message)
  })
}
wss.on('connection', function (ws) {
  console.log(`[SERVER] connection(), ${ws}, ${wss}`);
  ws.send('Please enter RoomId')
  ws.on('message', function (message) {
    if(setValueIfUndefined(ws, 'roomId', message)) {
      ws.send(`you enter room ${message}`)
      return
    }
    console.log(`[SERVER] Received: ${message}`);
    wss.bordecast(message, ws)
    // ws.send(`ECHO: ${message} ${ws}, ${wss}`, (err) => {
    //     if (err) {
    //         console.log(`[SERVER] error: ${err}`);
    //     }
    // });
  })
});