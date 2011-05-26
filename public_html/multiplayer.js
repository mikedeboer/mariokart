(function() {
    onDomReady(function() {
        var lastMove, lastMoveSent, player,
            playerProps = ["rotation", "rotinc", "rotincdir", "speed", "speedinc", "x", "y"],
            timer = null;

        var socket = new io.Socket("localhost", {
            rememberTransport: false
        });
        socket.connect();
        
        socket.on("connect", function(e) {
            //
        });
        
        socket.on("disconnect", function() {
            //
        });
        
        socket.on("message", function(msg) {
            msg = JSON.parse(msg);
            //console.log("message received: ", msg.type, msg.player, msg);
            switch (msg.type) {
                case "playerJoin":
                    MarioKart.addPlayer(msg.player);
                    break;
                case "playerMapSelect":
                    MarioKart.setMap(msg.map);
                    break;
                case "startRace":
                    MarioKart.gotoGameStart();
                    break;
                case "playerMove":
                    MarioKart.movePlayer(msg.player, msg);
                    break;
            }
        });
        
        function buildMoveObject(oPlayer) {
            var obj = {type: "playerMove", player: player};
            playerProps.forEach(function(prop) {
                obj[prop] = oPlayer[prop];
            });
            return obj;
        }
        
        MarioKart.on("playerMove", function(oPlayer) {
            lastMove = buildMoveObject(oPlayer);
            if (timer)
                return;
            timer = setInterval(function() {
                if (lastMoveSent === lastMove)
                    return;
                lastMoveSent = lastMove;
                socket.send(JSON.stringify(lastMove));
            }, 10);
        });
        
        MarioKart.on("playerSelect", function(msg) {
            player = msg;
            socket.send(JSON.stringify({type: "playerJoin", player: msg}));
        });
        
        MarioKart.on("playerMapSelect", function(msg) {
            socket.send(JSON.stringify({type: "playerMapSelect", map: msg, player: player}));
        });
    });
})();
