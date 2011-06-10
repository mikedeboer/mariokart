var Connect = require("connect");
var SocketIO = require("socket.io");

var server = Connect.createServer(
    Connect.static(__dirname + "/public_html"),
    Connect.static(__dirname + "/Socket.IO/lib")
);
server.listen(process.env.C9_PORT, "0.0.0.0");

var Server = require("./server/index");
var playerServer = new Server();

var socket = SocketIO.listen(server);
socket.on("connection", function(client){
    // new client is here!
    playerServer.addClient(client);
});
