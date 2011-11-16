onDomReady(function() {
    var lastMove, lastMoveSent, player,
        playerProps = ["rotation", "rotinc", "rotincdir", "speed", "speedinc", "x", "y"],
        timer = null;
        
    var playerCount = MarioKart.getPlayerCount();

    var socket = io.connect();
    
    socket.on("connect", function(e) {
        console.log("connected!");
    });
    
    socket.on("disconnect", function() {
        //
    });
    
    socket.on("message", function(msg) {
        msg = JSON.parse(msg);
        if (playerCount < 2 && msg.type != "playerCount")
            return;
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
            case "playerCount":
                MarioKart.setPlayerCount(msg.count);
                break;
            case "playerLeave":
                MarioKart.reset();
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
        if (playerCount < 2)
            return;
        lastMove = buildMoveObject(oPlayer);
        if (timer)
            return;
        timer = setInterval(function() {
            if (lastMoveSent === lastMove)
                return;
            lastMoveSent = lastMove;
            socket.json.send(lastMove);
        }, 200);
    });
    
    MarioKart.on("playerSelect", function(msg) {
        if (playerCount < 2)
            return;
        player = msg;
        socket.json.send({type: "playerJoin", player: msg});
    });
    
    MarioKart.on("playerMapSelect", function(msg) {
        if (playerCount < 2)
            return;
        socket.json.send({type: "playerMapSelect", map: msg, player: player});
    });
    
    MarioKart.on("playerCountChange", function(num) {
        playerCount = num;
        if (playerCount === num || num < 2)
            return;
        socket.json.send({type: "playerCount", count: num});
    });
    
    MarioKart.on("reset", function(num) {
        if (playerCount < 2)
            return;
        socket.json.send({type: "reset", player: player});
        clearInterval(timer);
        lastMove = lastMoveSent = player = null;
    });
});
