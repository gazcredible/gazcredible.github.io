var VisualObjectController = function()
{
    var initialPosition = new RMVector2();
    var currentPosition = new RMVector2();

    var timespan = 0;
    var ticks = 0;
    var speed = 0;

    var mode = "";

};

VisualObjectController.prototype.update = function()
{
};

VisualObjectController.prototype.isFinished = function()
{
    return false;
};


//=============================================================================================
var DTFController = function()
{
    this.gamestate = new RMGamestate();
};

DTFController.prototype.oneTimeInit = function()
{
    this.gamestate.addScreen('attractscreen'  ,new DTFAttractScreen());
    this.gamestate.addScreen('levelselect'  ,new DTFLevelSelect() );
    this.gamestate.addScreen('introscreen'  ,new DTFIntroScreen() );
    this.gamestate.addScreen('outroscreen' ,new DTFOutroScreen() );

    this.gamestate.addScreen('startgame'  ,new DTFStartGame() );
    this.gamestate.addScreen('startlevel', new DTFStartLevel());
    this.gamestate.addScreen('readytothrow', new DTFReadyToThrow());
    this.gamestate.addScreen('dropball', new DTFDropBall());

    this.gamestate.addScreen('dropfruit', new DTFDropFruit());
    this.gamestate.addScreen('bucketball', new DTFBucketBall());

    this.gamestate.addScreen('levelover', new DTFLevelOver());
    this.gamestate.addScreen('free go', new DTFFreeGo());

    this.gamestate.addScreen('pausemode', new DTFPauseMode());
    this.gamestate.addScreen('bootloader', new DTFBootLoader());

    this.gamestate.setScreen('bootloader');
};

DTFController.prototype.buttonCallback=function(inButton, inScreen)
{
    var name;

    if(inButton.name == undefined)
    {
        name = inButton;
    }
    else
    {
        name = inButton.name;
    }

    switch(name)
    {
        case "ui_playbutton":
            gGame.audio.playButtonHit();
            gGame.audio.playTune('wrapper',true);
            this.gamestate.setScreen('levelselect');
            break;

        case 'ui_throwbutton':
            gGame.model.throwBall();
            break;

        case "levelover_button1":
            gGame.audio.playButtonHit();
            gGame.controller.onLeveloverButton1();
            break;
        case "levelover_button2":
            gGame.audio.playButtonHit();
            gGame.controller.onLeveloverButton2();
            break;

        case "levelselect_leftbutton":
            gGame.audio.playButtonHit();
            gGame.model.onPrevLevelSelectPage();
            break;

        case "levelselect_rightbutton":
            gGame.audio.playButtonHit();
            gGame.model.onNextLevelSelectPage();
            break;

        case "levelselect_b0":
            gGame.audio.playButtonHit();
            gGame.model.startlevel( (gGame.model.selectPage*4)+0);
            break;

        case "levelselect_b1":
            gGame.audio.playButtonHit();
            gGame.model.startlevel( (gGame.model.selectPage*4)+1);
            break;

        case "levelselect_b2":
            gGame.audio.playButtonHit();
            gGame.model.startlevel( (gGame.model.selectPage*4)+2);
            break;

        case "levelselect_b3":
            gGame.audio.playButtonHit();
            gGame.model.startlevel( (gGame.model.selectPage*4)+3);
            break;

        case "ui_backbuttonlow_active":
        case "ui_soundbuttonlow_active":
            gGame.controller.processUIButton(name);
            gGame.audio.playButtonHit();
            break;
        default:
            alert("unhandled button: " + name);
    }
};

/*
 GARETH - the function of the level over buttons depends on whether the player
 has won or lost the level
 won
 button 1 - exit to menu
 button 2 - play next level

 lost
 button 1 - exit to menu
 button 2 - replay current level
 */
DTFController.prototype.onLeveloverButton1=function()
{
    this.setPendingLevel('attractscreen');
};

DTFController.prototype.onLeveloverButton2=function()
{
    if(gGame.model.isGameOver() == false)
    {
        if(gGame.model.currentLevel+1 >= gGame.model.gameLevels)
        {
            this.setPendingLevel('outroscreen');
            return;
        }

        gGame.model.incrementCurrentLevel = true;
    }

    gGame.controller.setPendingLevel('startgame');
};


DTFController.prototype.update=function()
{
    switch(gGame.model.mode)
    {
        case "":
            break;
        case "adamuppintro":
            // no anims ...
            break;
        case "readytothrow":
            gGame.model.updateBall();
            break;

        case "ball":
        {
            if(gGame.model.dim2.isBucketBall(gGame.model.ball) == false)
            {
                gGame.model.ball.updateCollisionList(gGame.model.fruitList);
                gGame.model.ball.updateCollisionList(gGame.model.critterList);
                gGame.model.dim2.collidesWithBall(gGame.model.ball);

                gGame.model.ball.update();
            }

            switch(gGame.model.getBallState())
            {
                case "in play":
                    //do nothing special
                    gGame.model.ballIsVisisble = true;
                    break;

                case "in van":
                    this.gamestate.setScreen('bucketball');
                    gGame.model.mode = 'fruit';
                    break;

                case "no hits":
                    this.gamestate.setScreen('free go');
                    gGame.model.mode = 'fruit';
                    break;

                case "off screen":
                    this.gamestate.setScreen('dropfruit');
                    gGame.model.mode = 'fruit';
                    break;
            }
        }
            break;

        case "fruit":
        {
            if(this.processFruitDropList() == true)
            {
                if(gGame.model.ballHasHitCritters == true)
                {
                    gGame.model.mode = 'dropcritters';
                }
                else
                {
                    gGame.model.droppingCrittersComplete = true;
                    //gGame.model.mode = 'ball';
                }
            }
        }
        break;

        case "dropcritters":
        {
            this.processFruitDropList();
            this.processCritterDropList();
        }
        break;

        default:
            alert("Unandled update: " + gGame.model.mode);
            break;
    }

    gGame.model.updateLeaves();
    gGame.model.updateScoreList();
    gGame.model.updateFruitHighlightList();

    if(gGame.model.updateGameCharacters == true)
    {
        gGame.model.dim1.update();
        gGame.model.dim2.update();
        gGame.model.throwButton.update();

        gGame.model.sunrayAngle += 0.25*(Math.PI/180.0);
    }
    for(var i=0;i<gGame.model.critterList.length;i++)
    {
        gGame.model.critterList[i].update();
    }

    gGame.model.lifetimeTick++;



    if(gGame.model.changingPage == true)
    {
        gGame.view.screen.eventsEnabled = false;
        gGame.model.selectPageOffset.x+=gGame.model.selectPageScrollSpeed;

        if(gGame.model.selectPageOffset.x > 800)
        {
            gGame.model.selectPage = gGame.model.desiredPage;
            gGame.model.changingPage = false;
            gGame.model.selectPageOffset.x=0;
            gGame.view.screen.eventsEnabled = true;
        }
    }
};

DTFController.prototype.buildDropList = function(srcList, dropList)
{
    //build fruit list
    //dropList = [];

    for(var i=0;i< srcList.length;i++)
    {
        if(srcList[i].beenHit() == true)
        {
            dropList.push(srcList[i]);
        }
    }

    for(var i=0;i< dropList.length;i++)
    {
        var index = srcList.indexOf(dropList[i]);

        if(index !=-1)
        {
            srcList.splice(index,1);
        }
    }

};



DTFController.prototype.buildFruitDropList = function()
{

    gGame.model.dropFruitList = [];
    this.buildDropList(gGame.model.fruitList,gGame.model.dropFruitList);

    gGame.model.isFruitToDrop = gGame.model.dropFruitList.length > 0;
};

DTFController.prototype.processFruitDropList = function()
{
    gGame.model.droppingFruitComplete = true;
    for(var i=0;i< gGame.model.dropFruitList.length;i++)
    {
        gGame.model.dropFruitList[i].updateDrop();

        if(gGame.model.dropFruitList[i].isOnScreen() == true)
        {
            gGame.model.droppingFruitComplete = false;
        }
    }

    if(gGame.model.droppingFruitComplete == true)
    {
        gGame.model.dropFruitList=[];

        return true;
    }

    return false;
};

DTFController.prototype.buildCritterDropList = function()
{
    gGame.model.droppingCrittersComplete = false;

    gGame.model.dropCritterList = [];
    this.buildDropList(gGame.model.critterList,gGame.model.dropCritterList);

    gGame.model.isCrittersToDrop = gGame.model.dropCritterList > 0;
};

DTFController.prototype.processCritterDropList = function()
{
    gGame.model.droppingCrittersComplete = true;
    for(var i=0;i< gGame.model.dropCritterList.length;i++)
    {
        gGame.model.dropCritterList[i].updateDrop(gGame.model.fruitList);

        if(gGame.model.dropCritterList[i].isOnScreen() == true)
        {
            gGame.model.droppingCrittersComplete = false;
        }
    }

    if(gGame.model.droppingCrittersComplete == true)
    {
        gGame.model.dropCritterList=[];

        return true;
    }

    return false;
};

DTFController.prototype.onFruitHitByCritter=function(fruit)
{
    gGame.model.onFruitHit(fruit);
    /*
    if(fruit.ripe == true)
    {
        gGame.model.ripeFruitCount--;

        if(gGame.model.ripeFruitCount == 0)
        {
            gGame.model.levelSuccess = true;
        }
    }

    var inst = new DTFScoreDisplay();
    var score = gGame.model.getFruitScore(fruit);
    gGame.model.playerScore += score;
    inst.init(fruit,score);
    gGame.model.scoreList.push(inst);
*/
    if(gGame.model.dropFruitList == undefined)
    {
        gGame.model.dropFruitList = [];
        this.buildDropList(gGame.model.fruitList,gGame.model.dropFruitList);

        gGame.model.isFruitToDrop = gGame.model.dropFruitList.length > 0;
    }
    else
    {
        // add fruit to existing drop list

        var index = gGame.model.fruitList.indexOf(fruit);

        if(index !=-1)
        {
            gGame.model.fruitList.splice(index,1);
        }

        gGame.model.dropFruitList.push(fruit);
    }

    gGame.model.droppingFruitComplete = false;
};

DTFController.prototype.onDroppingFruitMode=function()
{
    if(gGame.model.isDroppingComplete() == true)
    {
        if(gGame.model.isGameOver() == true)
        {
            this.gamestate.setScreen('levelover');
        }
        else
        {
            if(gGame.model.isLevelSuccessfullyCompleted() == true)
            {
                this.gamestate.setScreen('levelover');
            }
            else
            {
                this.gamestate.setScreen('readytothrow');
            }
        }
    }
};

DTFController.prototype.isUIButtonActive=function(name)
{
    if(this.gamestate.screenName == 'attractscreen')
    {
        if(name == "ui_backbuttonlow_active")   return false;

    }

    return true;
};

DTFController.prototype.processUIButton=function(name)
{
    if(name == "ui_soundbuttonlow_active")
    {
        gGame.audio.setMute( !gGame.audio.getMute() );
    }

    if(name == "ui_backbuttonlow_active")
    {
        gGame.audio.playVan(false);

        if(this.gamestate.screenName == 'levelselect')
        {
            this.gamestate.setScreen('attractscreen');
            return;
        }

        if( (this.gamestate.screenName == 'levelover')
          &&(gGame.view.levelover_buttonsActive == true)
          )
        {
            this.gamestate.setScreen('levelselect');
            return;
        }

        if(this.gamestate.screenName == 'startgame')
        {
            this.gamestate.setScreen('levelselect');
            return;
        }

        if( (this.gamestate.screenName == 'dropball')
          ||(this.gamestate.screenName == 'readytothrow')
          ||(this.gamestate.screenName == 'bucketball')
          ||(this.gamestate.screenName == 'dropfruit')
          ||(this.gamestate.screenName == 'free go')
          )
        {
            this.gamestate.setScreen('levelselect');
            return;
        }

        if(this.gamestate.screenName == 'lostlevel')
        {
            this.gamestate.setScreen('startlevel');
        }
    }
};

DTFController.prototype.userEventInUI=function()
{
    var offset = new RMVector2();
    var buttons = gGame.view.uibuttons;
    var inScreen = gGame.view.screen;

    for(var i=0;i<buttons.length;i++)
    {
        if(gGame.controller.isUIButtonActive(buttons[i]) == true)
        {
            var button = inScreen.layerBank[buttons[i]];

            var rect = button.size.clone();
            rect.x += offset.x;
            rect.y += offset.y;

            if(rect.isInMe(inScreen.getUserEventPosition() ) == true)
            {
                return true;
            }
        }
    }
    return false;
}

DTFController.prototype.userEventInUIGetButton=function()
{
    var offset = new RMVector2();
    var buttons = gGame.view.uibuttons;
    var inScreen = gGame.view.screen;

    for(var i=0;i<buttons.length;i++)
    {
        if(gGame.controller.isUIButtonActive(buttons[i]) == true)
        {
            var button = inScreen.layerBank[buttons[i]];

            var rect = button.size.clone();
            rect.x += offset.x;
            rect.y += offset.y;

            if(rect.isInMe(inScreen.getUserEventPosition() ) == true)
            {
                return buttons[i];
            }
        }
    }
    return null;
}

DTFController.prototype.setPendingLevel=function(inGameMode)
{
    gGame.model.pendingGamemodeChange = true;
    gGame.model.pendingGamemode = inGameMode;
};