const net = require('net')
const sv = require('./lib/service')
const LOCAL_PORT  = 6512
const server = net.createServer(socket => {
    socket.on('data', sv.handle.bind(socket))
});
 
server.listen(LOCAL_PORT)
console.log("TCP server accepting connection on port: " + LOCAL_PORT)
