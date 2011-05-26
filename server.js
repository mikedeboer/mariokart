require("./paths");

var Connect = require("connect");
var SocketIO = require("socket.io");
var Server = require("server/index");

var server = Connect.createServer(
    Connect.staticProvider(__dirname + "/public_html"),
    Connect.staticProvider(__dirname + "/support/socket.io")
);

var socket = SocketIO.listen(server);
var playerServer = new Server();

socket.on("connection", function(client){
    // new client is here!
    playerServer.addClient(client);
});

server.listen(5000);
