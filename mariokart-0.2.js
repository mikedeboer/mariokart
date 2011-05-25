function MarioKart() {
    var oMaps = {
        "map1": {
            "texture": "map_1.png",
            "width": 512,
            "height": 512,
            "collision": [
                [84, 80, 52, 216],
                [68, 276, 20, 56],
                [136, 188, 208, 60],
                [344, 208, 64, 40],
                [368, 248, 40, 160],
                [368, 4, 140, 76],
                [4, 436, 236, 72]
            ],
            "startposition": {
                x: 476,
                y: 356
            },
            "aistartpositions": [{
                x: 476 - 18,
                y: 356 - 18
            }, {
                x: 476,
                y: 356 - 24
            }],
            "startrotation": 180,
            "aipoints": [
                [467, 273],
                [459, 208],
                [317, 128],
                [160, 50],
                [64, 53],
                [44, 111],
                [38, 272],
                [50, 351],
                [106, 349],
                [215, 300],
                [278, 305],
                [337, 417],
                [405, 451],
                [462, 414]
            ]
        },
        "map2": {
            "texture": "map_2.png",
            "width": 512,
            "height": 512,
            "collision": [
                [120, 116, 8, 228],
                [124, 100, 20, 20],
                [140, 88, 16, 16],
                [152, 84, 48, 8],
                [196, 72, 16, 12],
                [208, 68, 96, 8],
                [296, 68, 8, 28],
                [304, 88, 56, 8],
                [352, 96, 8, 196],
                [356, 288, 12, 36],
                [364, 320, 16, 16],
                [376, 332, 16, 16],
                [388, 344, 16, 16],
                [400, 356, 16, 16],
                [412, 368, 12, 24],
                [412, 244, 32, 8],
                [476, 244, 32, 8],
                [204, 0, 100, 36],
                [196, 4, 8, 24],
                [124, 340, 16, 16],
                [136, 352, 16, 16],
                [148, 364, 16, 16],
                [160, 376, 16, 16],
                [172, 388, 12, 12],
                [180, 396, 12, 12],
                [280, 284, 8, 224],
                [268, 272, 16, 16],
                [256, 260, 16, 16],
                [248, 252, 12, 12],
                [240, 244, 12, 12],
                [232, 236, 12, 12],
                [224, 228, 12, 12],
                [216, 220, 12, 12]
            ],
            "startposition": {
                x: 70,
                y: 322
            },
            "aistartpositions": [{
                x: 70 - 18,
                y: 322 - 18
            }, {
                x: 70,
                y: 322 - 24
            }],
            "startrotation": 180,
            "aipoints": [
                [64, 253],
                [55, 184],
                [67, 132],
                [141, 59],
                [215, 51],
                [317, 53],
                [416, 51],
                [462, 125],
                [392, 191],
                [399, 270],
                [464, 353],
                [431, 431],
                [347, 373],
                [303, 238],
                [210, 191],
                [187, 253],
                [242, 378],
                [188, 459],
                [87, 420]
            ]
        }
    }
    var aAvailableMaps = ["map1", "map2"];
    // render modes:
    // 0: One screen canvas
    // 1: One canvas per horizontal screen line
    var iRenderMode = 0;
    var iWidth = 80;
    var iHeight = 35;
    var iScreenScale = 8;
    var iQuality = 1; // 1 = best, 2 = half as many lines, etc.
    var bSmoothSprites = true;
    var bMusic = true;

    function setRenderMode(iValue) {
        if (bCounting) return;
        iRenderMode = iValue;
        if (bRunning) resetScreen();
    }

    function setScreenScale(iValue) {
        if (bCounting) return;
        iScreenScale = iValue;
        if (bRunning) resetScreen();
    }

    function setQuality(iValue) {
        if (bCounting) return;
        iQuality = iValue;
        if (bRunning) resetScreen();
    }
    var oMap;
    var oHills;
    var oTrees;
    var aPlayers = ["mario", "luigi", "peach"];
    var oPlayer;
    var strPlayer = "";
    var iMapWidth;
    var iMapHeight;
    var oMapImg;

    function resetGame(strMap) {
        oMap = oMaps[strMap];
        loadMap(oMap);
    }

    function loadMap() {
        oMapImg = new Image();
        iMapWidth = oMap.width;
        iMapHeight = oMap.height;
        oMapImg.onload = startGame;
        oMapImg.src = oMap.texture;
    }
    var fMaxSpeed = 6;
    var fMaxRotInc = 6;
    var fMaxRotTimer = 0;
    var aKarts = [];
    var bRunning = false;
    var bCounting = false;

    function startGame() {
        resetScreen();
        if (bMusic) {
            startMusic();
        }
        oPlayer = {
            x: oMap.startposition.x,
            y: oMap.startposition.y,
            speed: 0,
            speedinc: 0,
            rotation: oMap.startrotation,
            rotincdir: 0,
            rotinc: 0,
            sprite: new Sprite(strPlayer),
            cpu: false
        }
        aKarts = [];
        aKarts.push(oPlayer);
        var iAI = 0;
        for (var i = 0; i < aPlayers.length; i++) {
            if (aPlayers[i] != strPlayer) {
                var oEnemy = {
                    x: oMap.aistartpositions[iAI].x,
                    y: oMap.aistartpositions[iAI].y,
                    speed: 0,
                    speedinc: 0,
                    rotation: oMap.startrotation,
                    rotincdir: 0,
                    rotinc: 0,
                    sprite: new Sprite(aPlayers[i]),
                    cpu: true,
                    aipoint: 0
                };
                aKarts.push(oEnemy);
                iAI++;
            }
        }
        render();
        bCounting = true;
        var oCount = document.createElement("div");
        var oCntStyle = oCount.style;
        oCntStyle.position = "absolute";
        oCntStyle.width = (12 * iScreenScale) + "px";
        oCntStyle.height = (12 * iScreenScale) + "px";
        oCntStyle.overflow = "hidden";
        oCntStyle.top = (4 * iScreenScale) + "px";
        oCntStyle.left = (8 * iScreenScale) + "px";
        var oCountImg = document.createElement("img");
        oCountImg.src = "countdown.png";
        oCountImg.style.position = "absolute";
        oCountImg.style.left = "0px";
        oCountImg.height = 12 * iScreenScale;
        oCount.appendChild(oCountImg);
        oContainer.appendChild(oCount);
        var iCntStep = 1;
        oCount.scrollLeft = 0;
        var fncCount = function() {
                oCount.scrollLeft = iCntStep * 12 * iScreenScale;
                iCntStep++;
                if (iCntStep < 4) {
                    setTimeout(fncCount, 1000);
                }
                else {
                    setTimeout(

                    function() {
                        oContainer.removeChild(oCount);
                        bCounting = false;
                    }, 1000);
                    cycle();
                    bRunning = true;
                }
            }
        setTimeout(fncCount, 1000);
    }
    var oMusicEmbed;
    var bMusicPlaying = false;

    function startMusic() {
        bMusicPlaying = true;
        oMusicEmbed = document.createElement("embed");
        oMusicEmbed.src = strMap + ".mid";
        oMusicEmbed.setAttribute("loop", "true");
        oMusicEmbed.setAttribute("autostart", "true");
        oMusicEmbed.style.position = "absolute";
        oMusicEmbed.style.left = "-1000px";
        oMusicEmbed.style.top = "-1000px";
        document.body.appendChild(oMusicEmbed);
    }

    function stopMusic() {
        if (!bMusicPlaying) {
            return;
        }
        bMusicPlaying = false;
        document.body.removeChild(oMusicEmbed);
    }
    var fSpriteScale = 0;
    var fLineScale = 0;
    // setup main container
    var oContainer = document.createElement("div")
    oContainer.tabindex = 1;
    var oCtrStyle = oContainer.style;
    oCtrStyle.position = "absolute";
    oCtrStyle.border = "2px solid black";
    oCtrStyle.overflow = "hidden";
    //document.body.appendChild(oContainer);
    document.getElementById("mariokartcontainer").appendChild(oContainer);
    // setup screen canvas for render mode 0.
    var oScreenCanvas = document.createElement("canvas");
    var oScreenCtx = oScreenCanvas.getContext("2d");
    var oScrStyle = oScreenCanvas.style;
    oScrStyle.position = "absolute";
    oContainer.appendChild(oScreenCanvas);
    // setup strip container render mode 1.
    var oStripCtr = document.createElement("div");
    oStripCtr.style.position = "absolute";
    oContainer.appendChild(oStripCtr);
    // array for screen strip descriptions
    var aStrips = [];
    var iCamHeight = 24;
    var iCamDist = 32;
    var iViewHeight = -10;
    var iViewDist = 0;
    var fFocal = 1 / Math.tan(Math.PI * Math.PI / 360);

    function resetScreen() {
        fSpriteScale = iScreenScale / 4;
        fLineScale = 1 / iScreenScale * iQuality;
        aStrips = [];
        oStripCtr.innerHTML = "";
        // change dimensions of main container
        oCtrStyle.width = (iWidth * iScreenScale) + "px";
        oCtrStyle.height = (iHeight * iScreenScale) + "px";
        if (oHills) oContainer.removeChild(oHills.div);
        if (oTrees) oContainer.removeChild(oTrees.div);
        // change dimensions of screen canvas
        oScreenCanvas.width = iWidth / fLineScale;
        oScreenCanvas.height = iHeight / fLineScale;
        oScrStyle.width = (iWidth * iScreenScale + iScreenScale) + "px";
        oScrStyle.left = (-iScreenScale / 2) + "px";
        oScrStyle.top = iScreenScale + "px";
        oScrStyle.height = (iHeight * iScreenScale) + "px";
        oStripCtr.style.width = (iWidth * iScreenScale + iScreenScale) + "px";
        oStripCtr.style.left = (-iScreenScale / 2) + "px";
        var fLastZ = 0;
        // create horizontal strip descriptions
        for (var iViewY = 0; iViewY < iHeight; iViewY += fLineScale) {
            var iTotalY = iViewY + iViewHeight; // total height of point (on view) from the ground up
            var iDeltaY = iCamHeight - iTotalY; // height of point relative to camera
            var iPointZ = (iTotalY / (iDeltaY / iCamDist)); // distance to point on the map
            var fScaleRatio = fFocal / (fFocal + iPointZ);
            var iStripWidth = Math.floor(iWidth / fScaleRatio);
            if (fScaleRatio > 0 && iStripWidth < iViewCanvasWidth) {
                if (iViewY == 0) fLastZ = iPointZ - 1;
                var oCanvas;
                if (iRenderMode == 1) {
                    var oCanvas = document.createElement("canvas");
                    oCanvas.width = iStripWidth;
                    oCanvas.height = 1;
                    var oStyle = oCanvas.style;
                    oStyle.position = "absolute";
                    oStyle.width = (iWidth * iScreenScale + iScreenScale) + "px";
                    oStyle.height = (iScreenScale * fLineScale) + iScreenScale * 0.5;
                    oStyle.left = (-iScreenScale / 2) + "px";
                    oStyle.top = Math.round((iHeight - iViewY) * iScreenScale) + "px";
                    oStripCtr.appendChild(oCanvas);
                }
                aStrips.push({
                    canvas: oCanvas || null,
                    viewy: iViewY,
                    mapz: iPointZ,
                    scale: fScaleRatio,
                    stripwidth: iStripWidth,
                    mapzspan: iPointZ - fLastZ
                })
                fLastZ = iPointZ;
            }
        }
        oHills = new BGLayer("hills", 360);
        oTrees = new BGLayer("trees", 720);
    }
    // setup canvas for holding the currently visible portion of the map
    // this is the canvas used to draw from when rendering
    var iViewCanvasHeight = 90; // these height, width and y-offset values 
    var iViewCanvasWidth = 256; // have been adjusted to work with the current camera setup
    var iViewYOffset = 10;
    var oViewCanvas = document.createElement("canvas");
    var oViewCtx = oViewCanvas.getContext("2d");
    oViewCanvas.width = iViewCanvasWidth;
    oViewCanvas.height = iViewCanvasHeight;

    function Sprite(strSprite) {
        var oImg = new Image();
        oImg.style.position = "absolute";
        oImg.style.left = "0px";
        oImg.src = "sprite_" + strSprite + (bSmoothSprites ? "_smooth" : "") + ".png";
        var oSpriteCtr = document.createElement("div");
        oSpriteCtr.style.width = "32px";
        oSpriteCtr.style.height = "32px";
        oSpriteCtr.style.position = "absolute";
        oSpriteCtr.style.overflow = "hidden";
        oSpriteCtr.style.zIndex = 10000;
        oSpriteCtr.style.display = "none";
        oSpriteCtr.appendChild(oImg);
        oContainer.appendChild(oSpriteCtr);
        var iActiveState = 0;
        this.draw = function(iX, iY, fScale) {
            var bDraw = true;
            if (iY > iHeight * iScreenScale || iY < 6 * iScreenScale) {
                bDraw = false;
            }
            if (!bDraw) {
                oSpriteCtr.style.display = "none";
                return;
            }
            oSpriteCtr.style.display = "block";
            var fSpriteSize = 32 * fSpriteScale * fScale;
            oSpriteCtr.style.left = (iX - fSpriteSize / 2) + "px";
            oSpriteCtr.style.top = (iY - fSpriteSize / 2) + "px";
            oImg.style.height = fSpriteSize + "px";
            oSpriteCtr.style.width = fSpriteSize + "px";
            oSpriteCtr.style.height = fSpriteSize + "px";
            oImg.style.left = -(fSpriteSize * iActiveState) + "px";
        }
        this.setState = function(iState) {
            iActiveState = iState;
        }
        this.div = oSpriteCtr;
    }

    function BGLayer(strImage, iLayerWidth) {
        var oLayer = document.createElement("div");
        oLayer.style.height = (10 * iScreenScale) + "px";
        oLayer.style.width = (iWidth * iScreenScale) + "px";
        oLayer.style.position = "absolute";
        oLayer.style.overflow = "hidden";
        var oImg1 = new Image();
        oImg1.height = 20;
        oImg1.width = iLayerWidth;
        oImg1.style.position = "absolute";
        oImg1.style.left = "0px";
        var oImg2 = new Image();
        oImg2.height = 20;
        oImg2.width = iLayerWidth;
        oImg2.style.position = "absolute";
        oImg2.style.left = "0px";
        var oCanvas1 = document.createElement("canvas");
        oCanvas1.width = iLayerWidth;
        oCanvas1.height = 20;
        oImg1.onload = function() {
            oCanvas1.getContext("2d").drawImage(oImg1, 0, 0);
        }
        oImg1.src = "bg_" + strImage + ".png";
        oCanvas1.style.width = Math.round(iLayerWidth / 2 * iScreenScale + iScreenScale) + "px"
        oCanvas1.style.height = (10 * iScreenScale) + "px";
        oCanvas1.style.position = "absolute";
        oCanvas1.style.left = "0px";
        var oCanvas2 = document.createElement("canvas");
        oCanvas2.width = iLayerWidth;
        oCanvas2.height = 20;
        oImg2.onload = function() {
            oCanvas2.getContext("2d").drawImage(oImg2, 0, 0);
        }
        oImg2.src = "bg_" + strImage + ".png";
        oCanvas2.style.width = Math.round(iLayerWidth / 2 * iScreenScale) + "px";
        oCanvas2.style.height = (10 * iScreenScale) + "px";
        oCanvas2.style.position = "absolute";
        oCanvas2.style.left = Math.round(iLayerWidth * iScreenScale) + "px";
        oLayer.appendChild(oCanvas1);
        oLayer.appendChild(oCanvas2);
        oContainer.appendChild(oLayer);
        return {
            draw: function(fRotation) {
                // something is wrong in here. For now, it looks fine due to fortunate hill placement
                var iRot = -Math.round(fRotation);
                while (iRot < 0)
                iRot += 360;
                while (iRot > 360)
                iRot -= 360;
                // iRot is now between 0 and 360
                var iScaledWidth = (iLayerWidth / 2 * iScreenScale);
                // one degree of rotation equals x width units:
                var fRotScale = iScaledWidth / 360;
                var iScroll = iRot * fRotScale;
                var iLeft1 = -iScroll;
                var iLeft2 = -iScroll + iScaledWidth;
                oCanvas1.style.left = Math.round(iLeft1) + "px";
                oCanvas2.style.left = Math.round(iLeft2) + "px";
            },
            div: oLayer
        }
    }

    function render() {
        // (posx, posy) should be at (iViewCanvasWidth/2, iViewCanvasHeight - iViewYOffset) on view canvas
        oViewCanvas.width = oViewCanvas.width;
        oViewCtx.fillStyle = "green";
        oViewCtx.fillRect(0, 0, oViewCanvas.width, oViewCanvas.height);
        oViewCtx.save();
        oViewCtx.translate(iViewCanvasWidth / 2, iViewCanvasHeight - iViewYOffset);
        oViewCtx.rotate((180 + oPlayer.rotation) * Math.PI / 180);
        oViewCtx.drawImage(
        oMapImg, -oPlayer.x, -oPlayer.y);
        oViewCtx.restore();
        oScreenCanvas.width = oScreenCanvas.width;
        oScreenCtx.fillStyle = "green";
        //oScreenCtx.fillRect(0,0,oScreenCanvas.width,oScreenCanvas.height);
        for (var i = 0; i < aStrips.length; i++) {
            var oStrip = aStrips[i];
            if (iRenderMode == 0) {
                try {
                    oScreenCtx.drawImage(
                    oViewCanvas, iViewCanvasWidth / 2 - (oStrip.stripwidth / 2),
                    //Math.floor(((iViewCanvasHeight-iViewYOffset) - oStrip.mapz)),
                    ((iViewCanvasHeight - iViewYOffset) - oStrip.mapz) - 1, oStrip.stripwidth, oStrip.mapzspan, 0, (iHeight - oStrip.viewy) / fLineScale, iWidth / fLineScale, 1);
                }
                catch (e) {};
            }
            if (iRenderMode == 1) {
                var iStripHeight = Math.max(3, oStrip.mapzspan);
                //oStrip.canvas.width=oStrip.canvas.width;
                oStrip.canvas.height = iStripHeight;
                oStrip.canvas.getContext("2d").clearRect(0, 0, oStrip.stripwidth, 1);
                try {
                    oStrip.canvas.getContext("2d").drawImage(
                    oViewCanvas, iViewCanvasWidth / 2 - (oStrip.stripwidth / 2), ((iViewCanvasHeight - iViewYOffset) - oStrip.mapz) - 1, oStrip.stripwidth, oStrip.mapzspan, 0, 0, oStrip.stripwidth, iStripHeight);
                }
                catch (e) {};
            }
        }
        var iOffsetX = (iWidth / 2) * iScreenScale;
        var iOffsetY = (iHeight - iViewYOffset) * iScreenScale;
        for (var i = 0; i < aKarts.length; i++) {
            var oKart = aKarts[i];
            if (oKart.cpu) {
                var fCamX = -(oPlayer.x - oKart.x);
                var fCamY = -(oPlayer.y - oKart.y);
                var fRotRad = oPlayer.rotation * Math.PI / 180;
                var fTransX = fCamX * Math.cos(fRotRad) - fCamY * Math.sin(fRotRad);
                var fTransY = fCamX * Math.sin(fRotRad) + fCamY * Math.cos(fRotRad);
                var iDeltaY = -iCamHeight;
                var iDeltaX = iCamDist + fTransY;
                var iViewY = ((iDeltaY / iDeltaX) * iCamDist + iCamHeight) - iViewHeight;
                var fViewX = -(fTransX / (fTransY + iCamDist)) * iCamDist;
                var fAngle = oPlayer.rotation - oKart.rotation;
                while (fAngle < 0)
                fAngle += 360;
                while (fAngle > 360)
                fAngle -= 360;
                var iAngleStep = Math.round(fAngle / (360 / 22));
                if (iAngleStep == 22) iAngleStep = 0;
                oKart.sprite.setState(iAngleStep);
                oKart.sprite.div.style.zIndex = Math.round(10000 - fTransY);
                oKart.sprite.draw(((iWidth / 2) + fViewX) * iScreenScale, (iHeight - iViewY) * iScreenScale, fFocal / (fFocal + (fTransY)));
            }
        }
        oPlayer.sprite.div.style.zIndex = 10000;
        oPlayer.sprite.draw(iOffsetX, iOffsetY, 1);
        oHills.draw(oPlayer.rotation);
        oTrees.draw(oPlayer.rotation);
    }

    function canMoveTo(iX, iY) {
        if (iX > iMapWidth - 5 || iY > iMapHeight - 5) return false;
        if (iX < 4 || iY < 4) return false;
        for (var i = 0; i < oMap.collision.length; i++) {
            var oBox = oMap.collision[i];
            if (iX > oBox[0] && iX < oBox[0] + oBox[2]) {
                if (iY > oBox[1] && iY < oBox[1] + oBox[3]) {
                    return false;
                }
            }
        }
        return true;
    }

    function move(oKart) {
        if (oKart.rotincdir) {
            oKart.rotinc += 2 * oKart.rotincdir;
        }
        else {
            if (oKart.rotinc < 0) {
                oKart.rotinc = Math.min(0, oKart.rotinc + 1);
            }
            if (oKart.rotinc > 0) {
                oKart.rotinc = Math.max(0, oKart.rotinc - 1);
            }
        }
        oKart.rotinc = Math.min(oKart.rotinc, fMaxRotInc);
        oKart.rotinc = Math.max(oKart.rotinc, -fMaxRotInc);
        if (oKart.speed) {
            oKart.rotation += (oKart.speedinc < 0 || (oKart.speedinc == 0 && oKart.speed < 0)) ? -oKart.rotinc : oKart.rotinc;
        }
        if (oKart.rotation < 0) oKart.rotation += 360;
        if (oKart.rotation > 360) oKart.rotation -= 360;
        if (!oKart.cpu) {
            if (oKart.rotincdir == 0) {
                oKart.sprite.setState(0);
            }
            else {
                if (oKart.rotincdir < 0) {
                    if (oKart.rotinc == -fMaxRotInc && fMaxRotTimer > 0 && (new Date().getTime() - fMaxRotTimer) > 800) oKart.sprite.setState(26);
                    else oKart.sprite.setState(24);
                }
                else {
                    if (oKart.rotinc == fMaxRotInc && fMaxRotTimer > 0 && (new Date().getTime() - fMaxRotTimer) > 800) oKart.sprite.setState(27);
                    else oKart.sprite.setState(25);
                }
            }
            if (Math.abs(oKart.rotinc) != fMaxRotInc) {
                fMaxRotTimer = 0;
            }
            else if (fMaxRotTimer == 0) {
                fMaxRotTimer = new Date().getTime();
            }
        }
        oKart.speed += oKart.speedinc;
        var fMaxKartSpeed = fMaxSpeed;
        if (oKart.cpu) fMaxKartSpeed *= 0.95;
        if (oKart.speed > fMaxKartSpeed) oKart.speed = fMaxKartSpeed;
        if (oKart.speed < -fMaxKartSpeed / 4) oKart.speed = -fMaxKartSpeed / 4;
        // move position
        var fMoveX = oKart.speed * Math.sin(oKart.rotation * Math.PI / 180);
        var fMoveY = oKart.speed * Math.cos(oKart.rotation * Math.PI / 180);
        var fNewPosX = oKart.x + fMoveX;
        var fNewPosY = oKart.y + fMoveY;
        if (canMoveTo(Math.round(fNewPosX), Math.round(fNewPosY))) {
            oKart.x = fNewPosX;
            oKart.y = fNewPosY;
        }
        else {
            oKart.speed *= -1;
        }
        // decrease speed
        oKart.speed *= 0.9;
    }

    function ai(oKart) {
        var aCurPoint = oMap.aipoints[oKart.aipoint];
        // first time, get the point coords
        if (!oKart.aipointx) oKart.aipointx = aCurPoint[0];
        if (!oKart.aipointy) oKart.aipointy = aCurPoint[1];
        var iLocalX = oKart.aipointx - oKart.x;
        var iLocalY = oKart.aipointy - oKart.y;
        iRotatedX = iLocalX * Math.cos(oKart.rotation * Math.PI / 180) - iLocalY * Math.sin(oKart.rotation * Math.PI / 180);
        iRotatedY = iLocalX * Math.sin(oKart.rotation * Math.PI / 180) + iLocalY * Math.cos(oKart.rotation * Math.PI / 180);
        var fAngle = Math.atan2(iRotatedX, iRotatedY) / Math.PI * 180;
        if (Math.abs(fAngle) > 10) {
            if (oKart.speed == fMaxSpeed) oKart.speedinc = -0.5;
            oKart.rotincdir = fAngle > 0 ? 1 : -1;
        }
        else {
            oKart.rotincdir = 0;
        }
        oKart.speedinc = 1;
        var fDist = Math.sqrt(iLocalX * iLocalX + iLocalY * iLocalY);
        if (fDist < 40) {
            oKart.aipoint++;
            if (oKart.aipoint >= oMap.aipoints.length) oKart.aipoint = 0;
            var oNewPoint = oMap.aipoints[oKart.aipoint];
            oKart.aipointx = oNewPoint[0] + (Math.random() - 0.5) * 10;
            oKart.aipointy = oNewPoint[1] + (Math.random() - 0.5) * 10;
        }
    }

    function cycle() {
        for (var i = 0; i < aKarts.length; i++) {
            if (aKarts[i].cpu) ai(aKarts[i]);
            move(aKarts[i]);
        }
        setTimeout(cycle, 1000 / 15);
        render();
    }
    document.onkeydown = function(e) {
        if (!bRunning) return;
        switch (e.keyCode) {
        case 38:
            // up
            oPlayer.speedinc = 1;
            break;
        case 37:
            // left
            oPlayer.rotincdir = 1;
            break;
        case 39:
            // right
            oPlayer.rotincdir = -1;
            break;
        case 40:
            // down
            oPlayer.speedinc -= 0.2;
            break;
        }
    }
    document.onkeyup = function(e) {
        if (!bRunning) return;
        switch (e.keyCode) {
        case 38:
            // up
            oPlayer.speedinc = 0;
            break;
        case 37:
            // left
            oPlayer.rotincdir = 0;
            break;
        case 39:
            // right
            oPlayer.rotincdir = 0;
            break;
        case 40:
            // down
            oPlayer.speedinc = 0;
            break;
        }
    }
    // hastily tacked on intro screens, so you can select driver and track.

    function selectPlayerScreen() {
        var oScr = document.createElement("div");
        var oStyle = oScr.style;
        oStyle.width = (iWidth * iScreenScale) + "px";
        oStyle.height = (iHeight * iScreenScale) + "px";
        oStyle.border = "1px solid black";
        oStyle.backgroundColor = "black";
        var oTitle = document.createElement("img");
        oTitle.src = "title.png";
        oTitle.style.position = "absolute";
        oTitle.style.width = (39 * iScreenScale) + "px";
        oTitle.style.height = (13 * iScreenScale) + "px";
        oTitle.style.left = ((iWidth - 39) / 2 * iScreenScale) + "px";
        oTitle.style.top = (2 * iScreenScale) + "px";
        oScr.appendChild(oTitle);
        oCtrStyle.width = (iWidth * iScreenScale) + "px";
        oCtrStyle.height = (iHeight * iScreenScale) + "px";
        oContainer.appendChild(oScr);
        for (var i = 0; i < aPlayers.length; i++) {
            var oPImg = document.createElement("img");
            oPImg.src = "select_" + aPlayers[i] + ".png";
            oPImg.style.width = (12 * iScreenScale) + "px";
            oPImg.style.height = (12 * iScreenScale) + "px";
            oPImg.style.position = "absolute"
            oPImg.style.left = (((iWidth - 12 * aPlayers.length) / 2 + i * 12) * iScreenScale) + "px";
            oPImg.style.top = (18 * iScreenScale) + "px";
            oPImg.player = aPlayers[i];
            oPImg.onclick = function() {
                strPlayer = this.player;
                oScr.innerHTML = "";
                oContainer.removeChild(oScr);
                selectMapScreen();
            }
            oScr.appendChild(oPImg);
        }
    }

    function selectMapScreen() {
        var oScr = document.createElement("div");
        var oStyle = oScr.style;
        oStyle.width = (iWidth * iScreenScale) + "px";
        oStyle.height = (iHeight * iScreenScale) + "px";
        oStyle.border = "1px solid black";
        oStyle.backgroundColor = "black";
        oCtrStyle.width = (iWidth * iScreenScale) + "px";
        oCtrStyle.height = (iHeight * iScreenScale) + "px";
        oContainer.appendChild(oScr);
        var oTitle = document.createElement("img");
        oTitle.src = "mushroomcup.png";
        oTitle.style.position = "absolute";
        oTitle.style.width = (36 * iScreenScale) + "px";
        oTitle.style.height = (6 * iScreenScale) + "px";
        oTitle.style.left = ((iWidth - 36) / 2 * iScreenScale) + "px";
        oTitle.style.top = (6 * iScreenScale) + "px";
        oScr.appendChild(oTitle);
        for (var i = 0; i < aAvailableMaps.length; i++) {
            var oPImg = document.createElement("img");
            oPImg.src = "select_" + aAvailableMaps[i] + ".png";
            oPImg.style.width = (30 * iScreenScale) + "px";
            oPImg.style.height = (12 * iScreenScale) + "px";
            oPImg.style.position = "absolute"
            oPImg.style.left = (((iWidth - 30 * aAvailableMaps.length) / 2 + i * 30 + i) * iScreenScale) + "px";
            oPImg.style.top = (14 * iScreenScale) + "px";
            oPImg.map = aAvailableMaps[i];
            oPImg.onclick = function() {
                strMap = this.map;
                oScr.innerHTML = "";
                oContainer.removeChild(oScr);
                resetGame(strMap);
            }
            oScr.appendChild(oPImg);
        }
    }
    for (var i = 0; i < aPlayers.length; i++) {
        var oImg = new Image();
        oImg.src = "sprite_" + aPlayers[i] + "_smooth.png";
    }
    selectPlayerScreen();
    window.MarioKartControl = {
        setRenderMode: function(iValue) {
            setRenderMode(iValue);
        },
        setQuality: function(iValue) {
            setQuality(iValue);
        },
        setScreenScale: function(iValue) {
            setScreenScale(iValue);
        },
        setMusic: function(iValue) {
            bMusic = !! iValue;
            if (bMusic && !bMusicPlaying && bRunning) {
                startMusic();
            }
            if (!bMusic && bMusicPlaying) {
                stopMusic();
            }
        }
    };
}
window.onload = MarioKart;