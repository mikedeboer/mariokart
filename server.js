require("./paths");

var Connect = require("connect");
var SocketIO = require("socket.io");

var server = Connect.createServer(
    Connect.staticProvider(__dirname + "/public_html"),
    Connect.staticProvider(__dirname + "/support/socket.io")
);
server.listen(process.env.C9_PORT, "0.0.0.0");

var Server = require("server/index");
var playerServer = new Server();

var socket = SocketIO.listen(server);
socket.on("connection", function(client){
    // new client is here!
    playerServer.addClient(client);
});
