function Server() {
    this.clients = {};
}

(function() {
    this.addClient = function(client) {
        this.clients[client.sessionId] = client;
        var _self = this;
        client.on("message", function(data) {
            _self.onClientMessage(data, client);
        });
        client.on("disconnect", function() {
            _self.onClientDisconnect(client);
        });
    };
    
    this.onClientMessage = function(data, client) {
        data = JSON.parse(data);
        data.sessionId = client.sessionId;

        switch (data.type) {
            case "playerJoin":
            case "playerMove":
                //console.log("broadcasting type", data.type);
                this.broadcast(data, client);
                break;
            case "playerMapSelect":
                this.broadcast(data, client);
                this.startGame();
                break;
        }
    };
    
    this.onClientDisconnect = function(client) {
        for (var i in this.clients) {
            if (this.clients[i] === client) {
                delete this.clients[i];
                break;
            }
        }
        this.broadcast({
            type: "playerLeave",
            sessionId: client.sessionId
        });
    };
    
    this.startGame = function() {
        var _self = this;
        setTimeout(function() {
            _self.broadcast({type: "startRace"});
        }, 2000);
    };
    
    this.broadcast = function(msg, exclude) {
        if (typeof msg != "string")
            msg = JSON.stringify(msg);
        var _self = this;
        Object.keys(this.clients).forEach(function(id) {
            if (_self.clients[id] !== exclude)
                _self.clients[id].send(msg);
        });
    };
}).call(Server.prototype);

module.exports = Server;
