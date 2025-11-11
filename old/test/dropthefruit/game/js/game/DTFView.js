var ScreenOverlay = function()
{
    this.r = 0;
    this.g = 0;
    this.b = 0;

    this.alpha = 1.0;
    this.bDraw = false;

}

ScreenOverlay.prototype.draw = function()
{
    if(this.bDraw == true)
    {
        var colour = "rgba(" +this. r +"," + this.g+"," + this.b+"," + this.alpha +")";
        gCanvas.GLRect(new RMRect(-2,0,804,600),colour );
    }
};

var DTFView = function()
{
    this.screen = new RMPSDScreen();

    /*GARETH - these names are from the psd file, so watch out ;)
     */
    this.screenNames = new Array
    (
        "introscreen",
        "outroscreen",
        "titlescreen",
        "gamescreen",
        "levelselect"
    );

    this.backdrops = new Array
    (
        "env_orchard",
        "env_field",
        "country scene"
    );

    this.levelSelectButtons = new Array
    (
        new RMVector2(0,0),
        new RMVector2(300,0),
        new RMVector2(0,200),
        new RMVector2(300,200)
    );

    this.uibuttons = new Array
    (
        "ui_backbuttonlow_active",
        "ui_soundbuttonlow_active"
    );


    this.buttonTransferfn = new SinTransferFunction();

    this.textPrinter = new RMTextPrinter();
    this.activeScreen="";

    this.leafImage = new Image();
    this.leafImage.src = 'game/data/anim/leafanim.png';

    this.screenFade = new ScreenOverlay();
    this.screenFade.r  =255;
    this.screenFade.g  =255;
    this.screenFade.b  =255;

    this.darkDialogBackdrop = new ScreenOverlay();
    this.darkDialogBackdrop.r = 0;
    this.darkDialogBackdrop.g = 0;
    this.darkDialogBackdrop.b = 0;

    this.adamuppbackdropOffset = new RMVector2();
    this.adamuppOffset = new RMVector2();

    this.levelover_boardOffset = new RMVector2();
    this.levelover_dimm1Offset = new RMVector2();
    this.levelover_dimm2Offset = new RMVector2();

    this.levelover_displayScore = false;
    this.levelover_showBestScore = false;
    this.levelover_showBallsBonus = false;
    this.levelover_bonusBallCount = 0;
    this.levelover_showFruitBonus = false;
    this.levelover_bonusFruitCount = 0;
    this.levelover_showLevelUnlocked = false;
    this.levelover_buttonsActive = false;
    this.levelover_hidebuttons = false;

    this.enableAttactPlayButton = false;
    this.animateAttactScreen = true;

    this.drawBallProjection = false;
}

DTFView.prototype.oneTimeInit = function()
{
    gGame.controller.gamestate.showBounds = true;

    this.screen.root = "game/data/screen/img/";
    createScreen(this.screen);

    //set callbacks for non-dumb nodes
    this.screen.nodegraph.findNode("moregames").setRenderNode(this.drawMoreGames);
    //title screen
    this.screen.nodegraph.findNode("titlescreen_rendernode").setRenderNode(this.drawTitle);
    this.screen.nodegraph.findNode("ui_playbutton").setRenderNode(this.processPlayButton);

    //
    this.screen.nodegraph.findNode("gamescene_rendernode").setRenderNode(this.drawScene);
    this.screen.nodegraph.findNode("ui_ballcounter").setRenderNode(null);
    this.screen.nodegraph.findNode("ui_juicecounter").setRenderNode(null);
    this.screen.nodegraph.findNode("leafrendernode").setRenderNode(this.drawIntroLeaves);
    this.screen.nodegraph.findNode("env_sun").setRenderNode(this.drawSun);


    //GARETH? not sure about this this.screen.nodegraph.findNode("ui_throwbutton").setRenderNode(this.throwButtonController);
    this.screen.nodegraph.findNode("ui_score").setAsText();
    this.screen.nodegraph.findNode("ui_score").setText("0");
    this.screen.nodegraph.findNode("messagescreen").setRenderNode(this.drawAdamUppOverlay);

    //levelover
    this.screen.nodegraph.findNode("levelover").setRenderNode(gGame.view.levelover_Callback);
    //this.screen.nodegraph.findNode("levelover_eyelid_rendernode").setRenderNode(this.drawLevelOverEylids);

    //levelselect
    this.screen.nodegraph.findNode("levelselect_rendernode").setRenderNode(this.drawLevelSelect);

    this.screen.nodegraph.findNode("ui").setRenderNode(this.uiCallback);

    this.screen.nodegraph.findNode("introscreen").setDraw(false);
    this.screen.nodegraph.findNode("outroscreen").setDraw(false);
    this.screen.nodegraph.findNode("titlescreen").setDraw(false);
    this.screen.nodegraph.findNode("ui").setDraw(true);

    this.screen.nodegraph.findNode("gamescreen").setDraw(false);
    this.screen.nodegraph.findNode("backgrounds").setDraw(false);

    this.screen.nodegraph.findNode("levelselect").setDraw(false);

    this.screen.nodegraph.findNode("introscreen").setRenderNode(this.drawIntroScreen);
    this.screen.nodegraph.findNode("outroscreen").setRenderNode(this.drawOutroScreen);

    this.setScreen("titlescreen");
};

/*GARETH - use this to manage the visual flow as much as possible
 */

DTFView.prototype.setScreen=function(screenName)
{
    //1. turn of everything ....
    for(var i=0;i<this.screenNames.length;i++)
    {
        var node = this.screen.nodegraph.findNode(this.screenNames[i]);

        if(node == null)
        {
            alert("no layer: " + this.screenNames[i]);
        }
        node.setDraw(false);
    }

    for(var i=0;i<this.backdrops.length;i++)
    {
        this.screen.nodegraph.findNode(this.backdrops[i]).setDraw(false);
    }

    //2. on on screens on demand ...
    this.activeScreen = this.screen.nodegraph.findNode(screenName);

    if(this.activeScreen != null)
    {
        this.activeScreen.setDraw(true);

        this.screen.nodegraph.findNode("backgrounds").setDraw(true);

        if(this.activeScreen.name == "gamescreen")
        {
            this.screen.nodegraph.findNode("env_sun").setDraw(true);
            this.screen.nodegraph.findNode("leafrendernode").setDraw(false);

            var level = gGame.model.getCurrentLevel();
            this.screen.nodegraph.findNode(level.backdrop).setDraw(true);
        }
        else
        {
            this.screen.nodegraph.findNode("env_sun").setDraw(false);
            this.screen.nodegraph.findNode("leafrendernode").setDraw(true);

            //random backdrop screen here
            this.screen.nodegraph.findNode(this.backdrops[0]).setDraw(true);
        }
    }
    else
    {
        alert("No screen: " + screenName);
    }
};

DTFView.prototype.update = function()
{
}

DTFView.prototype.draw = function()
{

    this.screen.nodegraph.findNode("ui_score").setText(gGame.model.getPlayerScore().toString() );

    this.screen.draw();

    this.screenFade.draw();

    var inRect = new RMRect(0,0,800,600);
    var drawRect = gCanvas.toScreenSpace(inRect);

    gCanvas.rect(new RMRect(0,0,drawRect.x,gCanvas.GLcurrentScreenSize.h),'#000000');
    gCanvas.rect(new RMRect(drawRect.x+drawRect.w,0,drawRect.w,gCanvas.GLcurrentScreenSize.h),'#000000');
    gCanvas.rect(new RMRect(0,0,gCanvas.GLcurrentScreenSize.w,drawRect.y),'#000000');
    gCanvas.rect(new RMRect(0,drawRect.y+drawRect.h,gCanvas.GLcurrentScreenSize.w,gCanvas.GLcurrentScreenSize.h-(drawRect.y+drawRect.h) ),'#000000');
};

//
//===================================================================================================================
//GARETH - these are all the render callbacks
//

DTFView.prototype.drawScene = function(inScreen)
{
    var level = gGame.model.getCurrentLevel();

    var treename = "env_tree_" + level.fruitType;

    gGame.model.dim1.drawBehindTree();

    inScreen.drawNode(inScreen.nodegraph.findNode(treename));

    for(var i=0;i<gGame.model.fruitHiglightList.length;i++)
    {
        var inst = gGame.model.fruitHiglightList[i];
        var layerName = "fruit glow large";
        if(inst.ripe != true)
        {
            layerName = "fruit glow small";
        }

        var imageSize = inScreen.layerBank[layerName].size;
        var pos = new RMVector2(inst.position.x,inst.position.y);
        var rect = new RMRect(pos.x-(imageSize.w/2),pos.y-(imageSize.h/2),imageSize.w,imageSize.h);

        inScreen.drawLayer(layerName,  rect);
    }

    for(var i=0;i<gGame.model.fruitList.length;i++)
    {
        drawFruit(inScreen,gGame.model.fruitList[i]);
    }

    for(var i=0;i<gGame.model.dropFruitList.length;i++)
    {
        drawFruit(inScreen,gGame.model.dropFruitList[i]);
    }

    for(var i=0;i<gGame.model.critterList.length;i++)
    {
        drawCritter(inScreen,gGame.model.critterList[i],false);
    }

    if(gGame.model.mode != "dropcritters")
    {
        if(gGame.model.dropCritterList != undefined)
        {
            for(var i=0;i<gGame.model.dropCritterList.length;i++)
            {
                drawCritter(inScreen,gGame.model.dropCritterList[i],true);
            }
        }
    }

    if(gGame.model.mode ==  "readytothrow")
    {
        if(gGame.model.isBallVisible() == true)
        {
            var position =gGame.model.ball.position;

            inScreen.drawLayer("ava_dimmbro1_ball", new RMRect(position.x-20/2,position.y-20/2,20,20) );

            if(gShowColliders == true)
            {
                gGame.model.ball.draw();
            }
        }
    }

    gGame.model.dim1.drawInfrontOfTree();

    if(gGame.model.mode !=  "readytothrow")
    {
        if(gGame.model.isBallVisible() == true)
        {
            var position =gGame.model.ball.position;

            inScreen.drawLayer("ava_dimmbro1_ball", new RMRect(position.x-20/2,position.y-20/2,20,20) );

            if(gShowColliders == true)
            {
                gGame.model.ball.draw();
            }
        }
    }
    else
    {
        // draw the ball stuff here!
        if(gGame.view.drawBallProjection == true)
        {
            if( (gGame.model.ballData != undefined)
                &&(gGame.model.ballData.length > 0)
                )
            {
                var size = inScreen.layerBank["ballpath_dot"].size.clone();
                for(var i = 3;i<gGame.model.ballData.length-2;i+=3)
                {
                    var pos = gGame.model.ballData[i].clone();

                    //gCanvas.GLLine(start.x,start.y,end.x,end.y,'#ff0000');

                    inScreen.drawLayer("ballpath_dot", new RMRect(pos.x-(size.w/2),pos.y-(size.h/2),size.w,size.h) );
                }

                var pos = gGame.model.ballData[gGame.model.ballData.length-2].clone();

                var dist = new RMVector2();
                dist.x = gGame.model.ballData[gGame.model.ballData.length-1].x -gGame.model.ballData[gGame.model.ballData.length-2].x;
                dist.y = gGame.model.ballData[gGame.model.ballData.length-1].y -gGame.model.ballData[gGame.model.ballData.length-2].y;

                var angle = Math.atan2(dist.y,dist.x);

                var rays = inScreen.layerBank["ballpath_arrow"];

                var rect = rays.size.clone();
                rect.x = gGame.model.ballData[gGame.model.ballData.length-2].x - (rect.w/2);
                rect.y = gGame.model.ballData[gGame.model.ballData.length-2].y - (rect.h/2);

                rect = gCanvas.toScreenSpace(rect);

                gCanvas.mContext.save();
                gCanvas.mContext.translate(rect.x+(rect.w/2),rect.y+(rect.h/2) );
                gCanvas.mContext.rotate(angle + (Math.PI/2) );

                rect.x= -rect.w/2;
                rect.y= -rect.h/2;

                gCanvas.sprite(rays.image,rect);

                gCanvas.mContext.restore();
            }
        }
    }



    if(gGame.model.mode == "dropcritters")
    {
        if(gGame.model.dropCritterList != undefined)
        {
            for(var i=0;i<gGame.model.dropCritterList.length;i++)
            {
                drawCritter(inScreen,gGame.model.dropCritterList[i],true);
            }
        }
    }


    gGame.model.dim2.draw();

    for(var i=0;i<gGame.model.scoreList.length;i++)
    {
        var inst = gGame.model.scoreList[i];
        gCanvas.GLTextCentred(20,inst.score.toString(),inst.position,'#ffffff');
    }

    gGame.view.draw_ui_ballcounter(inScreen);
    gGame.view.draw_ui_juicecounter(inScreen);
};

function drawCritter(inScreen,inCritter, inBeingDropped)
{
    var critterLabel = "npc_" + inCritter.type;
    var critterLayer = inScreen.layerBank[critterLabel+"head"];
    var imageSize = critterLayer.size;
    var offset = inCritter.position.clone();

    offset.x -= imageSize.x + (imageSize.w/2);
    offset.y -= imageSize.y + (imageSize.h/2);

    inScreen.nodegraph.findNode(critterLabel +"_lids").draw = inCritter.shouldBlink();

    if(inBeingDropped == true)
    {
        inScreen.nodegraph.findNode(critterLabel +"_movestate").draw = true;
        inScreen.nodegraph.findNode(critterLabel +"_idlestate").draw = false;
        inScreen.drawNodeFromName("npc_" + inCritter.type,offset);
    }
    else
    {
        inScreen.nodegraph.findNode(critterLabel +"_movestate").draw = false;
        inScreen.nodegraph.findNode(critterLabel +"_idlestate").draw = true;
        inScreen.drawNodeFromName("npc_animals_branch",offset);
        inScreen.drawNodeFromName("npc_" + inCritter.type,offset);

        if(inCritter.hit == true)
        {
            inScreen.drawNodeFromName("npc_animal_hit",offset);

            if(gShowColliders == true)
            {
                gCanvas.GLLine(inCritter.position.x,inCritter.position.y
                              ,inCritter.position.x +(inCritter.hitDirection.x*30)
                              ,inCritter.position.y +(inCritter.hitDirection.y*30)
                              ,'#ff0000');
            }
        }
    }

    if(gShowColliders == true)
    {
        inCritter.draw();

    }
};

function drawFruit(inScreen,inFruit)
{
    var level = gGame.model.getCurrentLevel();

    var fruitname = "fruit_" + level.fruitType;

    if(inFruit.ripe == true)
    {
        fruitname += "ripe";
    }
    else
    {
        fruitname += "unripe";
    }

    var imageSize = inScreen.layerBank[fruitname].size;
    var pos = new RMVector2(inFruit.position.x,inFruit.position.y);
    var rect = new RMRect(pos.x-(imageSize.w/2),pos.y-(imageSize.h/2),imageSize.w,imageSize.h);

    inScreen.drawLayer(fruitname,  rect);

    if(gShowColliders == true)
    {
        inFruit.draw();
    }
};

DTFView.prototype.draw_ui_ballcounter=function( inScreen)
{
    inScreen.drawNode(inScreen.nodegraph.findNode("ui_ballcounterbkg"));
    inScreen.drawNode(inScreen.nodegraph.findNode("ui_balls"));

    var ballLabels = new Array
    (
        "ui_ball08",
        "ui_ball07",
        "ui_ball06",
        "ui_ball05",
        "ui_ball04",
        "ui_ball03",
        "ui_ball02",
        "ui_ball01"
    );

    for(var i=0;i<gGame.model.getBallsLeft();i++)
    {
        inScreen.drawLayer(ballLabels[i]);
    }
};

DTFView.prototype.draw_ui_juicecounter=function( inScreen)
{
    inScreen.drawLayer("ui_juicecounterbkg");
    inScreen.drawLayer("ui_juice");

    //inScreen.drawLayer("ui_juiceapple");

    //fill bottle
    var rect = inScreen.layerBank["ui_bottleclear"].size.clone();

    var timeSpan = 120;

    rect.x +=5;
    rect.w -=10;
    rect.y += 40;
    rect.h -= 46;

    var fill = (gGame.model.ripeFruitCount * rect.h) / gGame.model.totalripeFruitCount;

    rect.y += fill;
    rect.h -= fill;

    gCanvas.GLRect(rect, gGame.model.getFruitColour() );
    inScreen.drawLayer("ui_bottleclear");

    var level = gGame.model.getCurrentLevel();
    inScreen.drawLayer("ui_label"+level.fruitType);

    gGame.model.throwButton.setPosition(inScreen.layerBank["throw_hand"].size.getPosition() );
    gGame.model.throwButton.draw();


    var rect = gGame.model.throwButton.getClickRect();

    if( (rect.isInMe(inScreen.getUserEventPosition() ) == true)
        &&(inScreen.getUserEventsEnabled() == true)
        )
    {
        if(inScreen.getUserEvent()== "released")
        {
            gGame.controller.buttonCallback("ui_throwbutton",inScreen);
        }
    }
};


DTFView.prototype.drawIntroLeaves=function(inScreen)
{
    var sprite = inScreen.layerBank['leafsprite'];

    for(var i = 0;i< gGame.model.leafList.length;i++)
    {
        var inst = gGame.model.leafList[i];
        //gCanvas.GLSprite(sprite.image, new RMRect(inst.position.x,inst.position.y,sprite.size.w,sprite.size.h) );

        inst.draw();
    }
};

DTFView.prototype.drawTitle=function(inScreen)
{
    gGame.model.logo.draw();

    if(gGame.view.enableAttactPlayButton == true)
    {
        gGame.view.processCustomButton("ui_playbutton",inScreen,"ui_playbutton_active","PLAY",true);
    }
};

DTFView.prototype.drawSun=function(inScreen)
{
    var rays = inScreen.layerBank["sunrays"];

    var rect = rays.size.clone();
    rect = gCanvas.toScreenSpace(rect);

    gCanvas.mContext.save();
    gCanvas.mContext.translate(rect.x+(rect.w/2),rect.y+(rect.h/2) );
    gCanvas.mContext.rotate(gGame.model.sunrayAngle);

    rect.x= -rect.w/2;
    rect.y= -rect.h/2;

    gCanvas.sprite(rays.image,rect);

    gCanvas.mContext.restore();

    inScreen.drawNode(inScreen.nodegraph.findNode("sun"));
};

DTFView.prototype.drawMessageScreen=function(inScreen)
{
};

DTFView.prototype.drawIntroScreen=function(inScreen)
{
    inScreen.drawNodeFromName("introscreen_image");

    if( (gGame.model.lifetimeTick%60) >=30)
    {
        inScreen.drawNodeFromName("introscreen_text");
    }

};

DTFView.prototype.drawOutroScreen=function(inScreen)
{
    inScreen.drawNodeFromName("outroscreen_image");

    if( (gGame.model.lifetimeTick%60) >=30)
    {
        inScreen.drawNodeFromName("outroscreen_text");
    }
}

DTFView.prototype.drawLevelSelect=function(inScreen)
{
    /*
    inScreen.nodegraph.findNode("levelselect_leftbutton").setButtonIsSelectable (gGame.model.selectPage > 0);
    inScreen.nodegraph.findNode("levelselect_rightbutton").setButtonIsSelectable (gGame.model.selectPage < 4);
*/
    gGame.view.drawIntroLeaves(inScreen);

    if(gGame.model.changingPage == true)
    {
        if(gGame.model.desiredPage > gGame.model.selectPage)
        {
            gGame.view.drawLevelSelectScreen(inScreen,gGame.model.selectPage, new RMVector2(-gGame.model.selectPageOffset.x,gGame.model.selectPageOffset.y));
            gGame.view.drawLevelSelectScreen(inScreen,gGame.model.desiredPage, new RMVector2(800-gGame.model.selectPageOffset.x,gGame.model.selectPageOffset.y));
        }
        else
        {
            gGame.view.drawLevelSelectScreen(inScreen,gGame.model.selectPage, new RMVector2(gGame.model.selectPageOffset.x,gGame.model.selectPageOffset.y));
            gGame.view.drawLevelSelectScreen(inScreen,gGame.model.desiredPage, new RMVector2(-(800-gGame.model.selectPageOffset.x),gGame.model.selectPageOffset.y));
        }
    }
    else
    {
        gGame.view.drawLevelSelectScreen(inScreen,gGame.model.selectPage, new RMVector2(0,0));
    }
/*
    inScreen.drawNodeFromName("levelselect_leftbutton");
    inScreen.drawNodeFromName("levelselect_rightbutton");
*/
    if(gGame.model.selectPage > 0)
    {
        // do left button
        var node = inScreen.nodegraph.findNode("levelselect_leftbutton");
        gGame.view.processCustomButton(node,inScreen,"levelselect_leftbutton_active");
    }

    if(gGame.model.selectPage < 4)
    {
        // do right button
        var node = inScreen.nodegraph.findNode("levelselect_rightbutton");
        gGame.view.processCustomButton(node,inScreen,"levelselect_rightbutton_active");
    }

    for(var i=0;i<5;i++)
    {
        var pipName = "ui_areadot" +(i+1)+"_inactive";

        inScreen.drawNodeFromName(pipName);
    }

    {
        var pipName = "ui_areadot" +(gGame.model.selectPage+1)+"_active";
        inScreen.drawNodeFromName(pipName);
    }

};

DTFView.prototype.drawLevelSelectScreen=function(inScreen,inPageIndex,inOffset)
{
    var node = inScreen.nodegraph.findNode("levelselect_layer");
    var layer;

    var levelName = "ui_levelselect_"+gGame.model.fruitNames[inPageIndex]+"title";
    inScreen.drawLayerOffset(levelName,inOffset);

    for(var i=0;i<4;i++)
    {
        var offset = inOffset.clone();
        var fruitType = "fruit_" + gGame.model.fruitNames[inPageIndex];
        offset.x += gGame.view.levelSelectButtons[i].x;
        offset.y += gGame.view.levelSelectButtons[i].y;

        inScreen.drawLayerOffset("levelselect_button_active",offset);

        layer = inScreen.layerBank["ui_levelselect_tile_level"];

        var pos = layer.size.getCentre();
        pos.x += 0 + offset.x;
        pos.y += offset.y -5;

        var level = (inPageIndex*4)+(i);
        var label = "LEVEL " + (level+1);

        gCanvas.GLTextCentred(32,label ,pos,'#ffffff');

        inScreen.drawLayerOffset("ui_levelselect_tile_topscore",offset);

        layer = inScreen.layerBank["ui_levelselect_tile_hiscore"];

        var pos = layer.size.getCentre();
        pos.x += 0 + offset.x;
        pos.y +=offset.y - 5;



        if(gGame.model.isLevelAvailable((inPageIndex*4)+i) == true)
        {
            var label = gGame.model.levelHighScores.getScore(level);
            gCanvas.GLTextCentred(32,label ,pos,'#ffffff');
        }
        else
        {
            gCanvas.GLTextCentred(32,"LOCKED" ,pos,'#ffffff');
        }

        inScreen.drawLayerOffset(fruitType,offset);

        if(gGame.model.isLevelAvailable((inPageIndex*4)+i) == true)
        {
            // do button ....
            var button = inScreen.layerBank["levelselect_button_active"];

            var rect = button.size.clone();
            rect.x += offset.x;
            rect.y += offset.y;

            if( (rect.isInMe(inScreen.getUserEventPosition() ) == true)
                &&(inScreen.getUserEventsEnabled() == true)
                )
            {
                if(inScreen.getUserEvent()== "released")
                {
                    gGame.controller.buttonCallback("levelselect_b"+i,inScreen);
                }
            }
        }
        else
        {
            //inScreen.drawLayerOffset("levelselect_locked",offset);
        }
    }
};

DTFView.prototype.processPlayButton=function(inScreen)
{

};

DTFView.prototype.processCustomButton=function(inRootButton,inScreen,inButtonName,inText,inGrow,inOffset,inActive)
{
    if(inOffset == undefined)
    {
        inOffset = new RMVector2();
    }

    if(inActive == undefined)
    {
        inActive = inScreen.getUserEventsEnabled();

    }

    var layer;
    var fontScale = 1.0;
    layer = inScreen.layerBank[inButtonName];

    var refSize = layer.size.clone();

    refSize.x += inOffset.x;
    refSize.y += inOffset.y;

    var tmpSize;

    if(inGrow == true)
    {
        var timeSpan = 60;
        var size = 5;
        var ticker = gGame.controller.gamestate.lifetimeTick%timeSpan;
        var aspect = refSize.w/refSize.h;

        var amount = gGame.view.buttonTransferfn.get(ticker/timeSpan) * size;

        var tmpSize = new RMRect();
        tmpSize.x = refSize.x - (amount*aspect);
        tmpSize.y = refSize.y - (amount);
        tmpSize.w = refSize.w + (2*amount*aspect);
        tmpSize.h = refSize.h + (2*amount);

        fontScale = tmpSize.h /refSize.h;

        gCanvas.GLSprite(layer.image,tmpSize);
    }
    else
    {
        gCanvas.GLSprite(layer.image,refSize);
        tmpSize = refSize.clone();
    }

    if(inText != undefined)
    {
        var pos = tmpSize.getCentre();
        pos.x += 0;
        pos.y -= 5;
        gCanvas.GLTextCentred(32*fontScale,inText,pos,'#ffffff');
    }

    if( (layer.size.isInMe(inScreen.getUserEventPosition() ) == true)
      &&(inActive==true)
        )
    {
        if(inScreen.getUserEvent()== "released")
        {
            //this.buttonCallback(this,inScreen);
            gGame.controller.buttonCallback(inRootButton,inScreen);

        }
    }
};

DTFView.prototype.levelover_Callback = function(inScreen)
{
    if(gGame.model.drawEndOfLevel == true)
    {
        if(gGame.view.darkDialogBackdrop.bDraw == true)
        {
            gGame.view.darkDialogBackdrop.draw();
        }

        var inOffset = new RMVector2();

        //draw the board
        inScreen.drawLayerOffset("levelover_board",gGame.view.levelover_boardOffset);


        if(gGame.view.levelover_displayScore == true)
        {
            inScreen.drawLayerOffset("levelcomplete_score1",gGame.view.levelover_boardOffset);

            var rect = inScreen.layerBank["levelcomplete_score2"].size.clone();
            rect.x += gGame.view.levelover_boardOffset.x;
            rect.y += gGame.view.levelover_boardOffset.y;

            gCanvas.GLTextCentred(50
                                 ,gGame.model.playerScore
                                 ,rect.getCentre(),'#ffffff');

        }

        //draw the brothers
        {
            inScreen.drawLayerOffset("levelover_bro1",gGame.view.levelover_dimm1Offset);
            inScreen.drawLayerOffset("levelover_bro2",gGame.view.levelover_dimm2Offset);

            if(gGame.model.lifetimeTick%120 >=115)
            {
                inScreen.drawLayerOffset("levelstatus_bro1lids",gGame.view.levelover_dimm1Offset);
            }

            if(gGame.model.lifetimeTick%45 >=20)
            {
                inScreen.drawLayerOffset("levelstatus_bro2lids",gGame.view.levelover_dimm2Offset);
            }
        }


        if(gGame.view.levelover_displayScore == true)
        {
            //arms
            inScreen.drawLayerOffset("layer 6",gGame.view.levelover_dimm1Offset);
            inScreen.drawLayerOffset("layer 7",gGame.view.levelover_dimm2Offset);

            inScreen.drawLayerOffset("ui_levelcomplete_message",gGame.view.levelover_boardOffset);
            inScreen.drawLayerOffset("ui_levelcomplete_title",gGame.view.levelover_boardOffset);
            inScreen.drawLayerOffset("ui_levelcomplete_score_text",gGame.view.levelover_boardOffset);

            if( (gGame.model.pendingGamemodeChange == false)
              &&(gGame.view.levelover_hidebuttons == false)
              )
            {
                gGame.view.processCustomButton("levelover_button1",inScreen,"levelover_button1_active","MENU",false,gGame.view.levelover_boardOffset,gGame.view.levelover_buttonsActive);
                gGame.view.processCustomButton("levelover_button2",inScreen,"levelover_button2_active","PLAY",true,gGame.view.levelover_boardOffset,gGame.view.levelover_buttonsActive);
            }
        }
        else
        {
            inScreen.drawLayerOffset("layer 4",gGame.view.levelover_dimm1Offset);
            inScreen.drawLayerOffset("layer 5",gGame.view.levelover_dimm2Offset);

            if(gGame.view.levelover_displayScore == false)
            {
                inScreen.drawLayerOffset("ui_levelfail_message",gGame.view.levelover_boardOffset);
            }

            inScreen.drawLayerOffset("ui_levelfailtitle",gGame.view.levelover_boardOffset);

            if(gGame.model.pendingGamemodeChange == false)
            {
                gGame.view.processCustomButton("levelover_button1",inScreen,"levelover_button1_active","MENU",false,gGame.view.levelover_boardOffset,gGame.view.levelover_buttonsActive);
                gGame.view.processCustomButton("levelover_button2",inScreen,"levelover_button2_active","REPLAY",true,gGame.view.levelover_boardOffset,gGame.view.levelover_buttonsActive);
            }
        }

        if(gGame.view.levelover_displayScore == true)
        {
            inScreen.drawNodeFromName("levelover_winlines",gGame.view.levelover_boardOffset);

            if(gGame.view.levelover_showBestScore == true)
            {
                inScreen.drawNodeFromName("levelover_highscore",gGame.view.levelover_boardOffset);
            }

            if(gGame.view.levelover_showBallsBonus == true)
            {
                inScreen.drawLayerOffset("levelover_ball",gGame.view.levelover_boardOffset);

                rect = inScreen.layerBank["levelover_ballbonus_text1"].size.clone();

                rect.x += gGame.view.levelover_boardOffset.x;
                rect.y += gGame.view.levelover_boardOffset.y;

                gCanvas.GLTextCentred(28,"x"+ gGame.view.levelover_bonusBallCount ,rect.getCentre(),'#EEAF05');

                rect = inScreen.layerBank["levelover_ballbonus_text2"].size.clone();

                rect.x += gGame.view.levelover_boardOffset.x;
                rect.y += gGame.view.levelover_boardOffset.y;

                gCanvas.GLTextCentred(20,"+"+ gGame.model.ballBonus * gGame.view.levelover_bonusBallCount,rect.getCentre(),'#ffffff');
            }

            if(gGame.view.levelover_showFruitBonus == true)
            {
                var level = gGame.model.getCurrentLevel();

                var fruitname = "fruit_" + level.fruitType + "unripe";

                var imageSize = inScreen.layerBank[fruitname].size.clone();

                rect = inScreen.layerBank["levelover_unripefruit"].size.clone();

                imageSize.x = rect.x + gGame.view.levelover_boardOffset.x;
                imageSize.y = rect.y + gGame.view.levelover_boardOffset.y +10;
                imageSize.w*=2;
                imageSize.h*=2;

                inScreen.drawLayer(fruitname,  imageSize);

                rect = inScreen.layerBank["levelover_unripetext1"].size.clone();

                rect.x += gGame.view.levelover_boardOffset.x;
                rect.y += gGame.view.levelover_boardOffset.y;

                gCanvas.GLTextCentred(28,"x"+ gGame.view.levelover_bonusFruitCount ,rect.getCentre(),'#EEAF05');

                rect = inScreen.layerBank["levelover_unripetext2"].size.clone();

                rect.x += gGame.view.levelover_boardOffset.x;
                rect.y += gGame.view.levelover_boardOffset.y;

                gCanvas.GLTextCentred(20,"+"+ gGame.model.fruitBonus * gGame.view.levelover_bonusFruitCount,rect.getCentre(),'#ffffff');
            }

            if(gGame.view.levelover_showLevelUnlocked ==true)
            {
                inScreen.drawNodeFromName("levelover_nextlevel",gGame.view.levelover_boardOffset);
            }
        }
    }
};

DTFView.prototype.uiCallback = function(inScreen)
{

    var offset = new RMVector2();
    var buttons = gGame.view.uibuttons;

    for(var i=0;i<buttons.length;i++)
    {
        var canPressButton = true;
        if(gGame.controller.isUIButtonActive(buttons[i]) == true)
        {
            if(buttons[i] == "ui_soundbuttonlow_active")
            {
                if(gGame.audio.getMute() == false)
                {
                    inScreen.drawLayerOffset("ui_sound_mute",offset);
                }
                else
                {
                    inScreen.drawLayerOffset("ui_soundbuttonlow_active",offset);
                }
            }

            if(buttons[i] == "ui_backbuttonlow_active")
            {
                if( (gGame.controller.gamestate.screenName == 'levelover')
                    &&(gGame.view.levelover_buttonsActive == false)
                    )
                {
                    canPressButton = false;
                }
                else
                {
                    inScreen.drawLayerOffset(buttons[i],offset);
                }
            }

            var button = inScreen.layerBank[buttons[i]];

            var rect = button.size.clone();
            rect.x += offset.x;
            rect.y += offset.y;

            if( (rect.isInMe(inScreen.getUserEventPosition() ) == true)
                &&(inScreen.getUserEventsEnabled() == true)
                &&(canPressButton == true)
                )
            {
                if(inScreen.getUserEvent()== "released")
                {
                    gGame.controller.buttonCallback(buttons[i],inScreen);
                }
            }
        }
    }
}

DTFView.prototype.throwButtonController = function(inScreen)
{
    gGame.model.throwButton.setPosition(inScreen.nodegraph.findNode("ui_throwbutton").size.getPosition() );
    gGame.model.throwButton.draw();
}

DTFView.prototype.drawAdamUppOverlay = function(inScreen)
{
    if(gGame.model.drawAdamUpp == true)
    {
        if(gGame.view.darkDialogBackdrop.bDraw == true)
        {
            gGame.view.darkDialogBackdrop.draw();
        }

        var offset =gGame.view.adamuppbackdropOffset.clone();
        var text = inScreen.nodegraph.findNode("messagescreen_text");

        var pos = inScreen.layerBank["messagescreen_text"].size.TL();

        inScreen.nodegraph.findNode("messagescreen_text").setDraw(false);


        inScreen.nodegraph.findNode("npc_adamupp_lids").setDraw((gGame.model.lifetimeTick%90) >=75);

        if( (gGame.view.textPrinter.isPrintingComplete() == true)
            &&(gGame.model.showClickToContinueMessage == true)
            )
        {
            inScreen.nodegraph.findNode("messagescreen_instruction").setDraw((gGame.model.lifetimeTick%60) >=30);
        }
        else
        {
            inScreen.nodegraph.findNode("messagescreen_instruction").setDraw(false);
        }

        inScreen.drawNodeFromName("messagescreen_rendernode",offset);

        var offset =gGame.view.adamuppOffset.clone();
        inScreen.drawNodeFromName("messagescreen_adamupp",offset);


        gGame.view.textPrinter.draw(gGame.view.adamuppbackdropOffset.clone());

        if( (gGame.view.textPrinter.isPrintingComplete() == true)
        //         &&( (gGame.model.lifetimeTick%40) <=20)
            )
        {
            var level = gGame.model.getCurrentLevel();
            var fruitname = "fruit_" + level.fruitType + "ripe";

            var imageSize = inScreen.layerBank[fruitname].size.clone();
            imageSize.x = gGame.view.adamuppbackdropOffset.x + 650;
            imageSize.y = gGame.view.adamuppbackdropOffset.y + 455;
            imageSize.w*=2;
            imageSize.h*=2;
            rect = new RMRect(imageSize.x-(imageSize.w/2)
                ,imageSize.y-(imageSize.h/2)
                ,imageSize.w
                ,imageSize.h);

            inScreen.drawLayer(fruitname,  rect);

            var pos = new RMVector2(gGame.view.adamuppbackdropOffset.x+400
                ,gGame.view.adamuppbackdropOffset.y+440);
            gCanvas.GLText(20,"COLLECT THESE" ,pos,'#ffffff','left');

            pos.y +=30;
            gCanvas.GLText(20,"LOVELY RIPE FRUIT" ,pos,'#ffffff','left');
        }
    }
}

DTFView.prototype.drawMoreGames = function(inScreen)
{
    if(gGame.model.moreGamesButtonActive == true)
    {
        inScreen.drawNodeFromName("moregames_button");
    }
}

DTFView.prototype.isContentLoaded = function()
{
    return this.screen.isContentLoaded();
}