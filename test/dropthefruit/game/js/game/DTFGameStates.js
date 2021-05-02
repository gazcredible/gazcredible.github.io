var TickFader = function()
{
    this.tickFrames = 0;
    this.tick = 0;
};

TickFader.prototype.reset=function()
{
    this.tick = 0;
};

TickFader.prototype.set=function(inMaxTicks)
{
    this.tickFrames = inMaxTicks;
};

TickFader.prototype.update = function()
{
    if(this.finished() == false)
    {
        this.tick++;
    }
};

TickFader.prototype.finished = function()
{
    return (this.tick >= this.tickFrames);
};

TickFader.prototype.getParameter = function()
{
    return this.tick / this.tickFrames;
};





//======================================================================================================================


       

var DTFBootLoader = function()
{
    this.oneTimeInitCalled = false;
    this.itemsLoaded = 0;
    this.itemsToLoad = 0;

    
    this.button = new Image();
    this.button.src = "game/data/screen/bootloader/loaderimage.jpg";

  

};

   
   



DTFBootLoader.prototype = new RMGamemode();
DTFBootLoader.prototype.constructor = DTFBootLoader;


DTFBootLoader.prototype.init = function()
{
    gGame.model.moreGamesButtonActive = false;

    this.itemsLoaded = 0;
    this.itemsToLoad = 0;
};


DTFBootLoader.prototype.uiInput = function()
{
};

DTFBootLoader.prototype.update = function()
{

    if((gGame.controller.gamestate.lifetimeTick > 120) && (this.oneTimeInitCalled == false))
    {
        gGame.model.oneTimeInit();
        gGame.view.oneTimeInit();
        gGame.audio.oneTimeInit();

        this.oneTimeInitCalled = true;
    }

    if(this.oneTimeInitCalled == true)
    {
        this.itemsToLoad = gAudioWebkit.resourceCount;
        this.itemsToLoad += gGame.view.screen.getItemsToLoadCount();

        this.itemsLoaded = gAudioWebkit.resourceLoaded;
        this.itemsLoaded += gGame.view.screen.getItemsLoadedCount();
    }

    if(gGame.isContentLoaded() == true)
    {
        gGame.controller.gamestate.setScreen('attractscreen');
    }
};

DTFBootLoader.prototype.draw = function()
{
    gCanvas.GLSprite(this.button,new RMRect(0,0,800,600));
    

    if(gGame.controller.gamestate.lifetimeTick%60 < 30)
    {
        gCanvas.GLText(34,"Loading", new RMVector2(400+1,535+1),'#0','center');
        gCanvas.GLText(34,"Loading", new RMVector2(400,535),'#ffffff','center');
    }

    //gCanvas.GLText(34,"" + this.itemsLoaded +" / " + this.itemsToLoad, new RMVector2(400,350),'#ffffff','center');

    var pos = new RMVector2(200,480);
    var size = new RMSize(400,30);
    gCanvas.GLRect(new RMRect(pos.x,pos.y,size.w,size.h), '#ffffff');
    gCanvas.GLRect(new RMRect(pos.x+1,pos.y+1,size.w-2,size.h-2), '#000000');
    gCanvas.GLRect(new RMRect(pos.x+2,pos.y+2,((size.w-4)*this.itemsLoaded)/this.itemsToLoad,size.h-4), '#ffff00');
};

DTFBootLoader.prototype.exit = function()
{

};

//======================================================================================================================
var DTFAttractScreen = function()
{
    this.alphaFader = new TickFader();
    this.alphaFader.set(30);
};


DTFAttractScreen.prototype = new RMGamemode();
DTFAttractScreen.prototype.constructor = DTFAttractScreen;


DTFAttractScreen.prototype.init = function()
{
    gGame.model.selectPage = 0;
    gGame.audio.playTune("wrapper",true);
    gGame.model.mode = "";
    gGame.view.setScreen("titlescreen");

    gGame.model.logo.init();
    gGame.model.moreGamesButtonActive = false;
};


DTFAttractScreen.prototype.uiInput = function()
{
};

DTFAttractScreen.prototype.update = function()
{
    if(gGame.view.screenFade.bDraw == true)
    {
        this.alphaFader.update();
        gGame.view.screenFade.alpha = 1-this.alphaFader.getParameter();

        if(this.alphaFader.finished() == true)
        {
            gGame.view.screenFade.bDraw = false;
        }
    }

    gGame.view.screen.getUserEventsEnabled(gGame.controller.gamestate.stateTick > 5);
    gGame.update();

    gGame.model.logo.update();
};

DTFAttractScreen.prototype.draw = function()
{
    gGame.draw();
};

DTFAttractScreen.prototype.exit = function()
{
    gGame.audio.playTune("wrapper",false);
};

//======================================================================================================================
var DTFLevelSelect = function()
{
    this.mode = "";
    this.resultantGameMode = "";

    this.alphatick = 0;
    this.tickTime = 30;

    this.alphaFader = new TickFader();
    this.alphaFader.set(30);
};


DTFLevelSelect.prototype = new RMGamemode();
DTFLevelSelect.prototype.constructor = DTFLevelSelect;


DTFLevelSelect.prototype.init = function()
{
    this.mode = 'select';
    this.resultantGameMode = "";
    this.alphatick = 0;

    this.alphaFader.reset();

    gGame.model.mode = "";
    gGame.view.setScreen("levelselect");
    gGame.view.screen.eventsEnabled = false;
    gGame.model.moreGamesButtonActive = true;
};


DTFLevelSelect.prototype.uiInput = function()
{
};

DTFLevelSelect.prototype.update = function()
{
    if(gGame.controller.gamestate.stateTick > 5)
    {
        gGame.view.screen.eventsEnabled = true;
    }

    switch(this.mode)
    {
        case 'select':
            break;

        case 'wipe':
            gGame.view.screen.eventsEnabled = false;
            this.alphatick++;

            this.alphaFader.update();

            if(this.alphaFader.finished() == true)
            {
                gGame.controller.gamestate.setScreen(this.resultantGameMode);
            }
            else
            {
                gGame.view.screenFade.bDraw = true;
                gGame.view.screenFade.alpha = this.alphaFader.getParameter();
            }
            break;

        default:
            alert("DTFLevelSelect - unknown mode: " + this.mode);
            break;
    }

    gGame.update();
};

DTFLevelSelect.prototype.draw = function()
{
    gGame.draw();
};

DTFLevelSelect.prototype.setWipeMode = function(inGameMode)
{
    this.mode = 'wipe';
    this.resultantGameMode = inGameMode;
};

DTFLevelSelect.prototype.exit = function()
{
    gGame.view.screen.eventsEnabled = true;
    gGame.model.moreGamesButtonActive = false;
};

//======================================================================================================================
var DTFIntroScreen = function()
{
    this.alphaFader = new TickFader();
    this.alphaFader.set(30);

    this.state = "";
};


DTFIntroScreen.prototype = new RMGamemode();
DTFIntroScreen.prototype.constructor = DTFIntroScreen;


DTFIntroScreen.prototype.init = function()
{
    gGame.model.mode = "";
    gGame.view.setScreen("introscreen");

    this.state = "fadedown";
    this.alphaFader.reset();
    gGame.model.moreGamesButtonActive = true;
};


DTFIntroScreen.prototype.uiInput = function()
{
};

DTFIntroScreen.prototype.update = function()
{
    this.alphaFader.update();

    switch(this.state)
    {
        case 'fadedown':
        {
            if(this.alphaFader.finished() == true)
            {
                if(gGame.view.screen.getUserEvent() == "pressed")
                {
                    this.alphaFader.reset();
                    this.state= 'fadeup';
                }
            }
            else
            {
                gGame.view.screenFade.bDraw = true;
                gGame.view.screenFade.alpha = 1-this.alphaFader.getParameter();
            }
        }
        break;

        case 'fadeup':
        {
            if(this.alphaFader.finished() == true)
            {
                gGame.controller.gamestate.setScreen('startgame');
            }
            else
            {
                gGame.view.screenFade.bDraw = true;
                gGame.view.screenFade.alpha = this.alphaFader.getParameter();
            }
        }
        break;
    }
    gGame.update();
};

DTFIntroScreen.prototype.draw = function()
{
    gGame.draw();
};

DTFIntroScreen.prototype.exit = function()
{

};

//======================================================================================================================
var DTFOutroScreen = function()
{
    this.alphaFader = new TickFader();
    this.alphaFader.set(30);
};


DTFOutroScreen.prototype = new RMGamemode();
DTFOutroScreen.prototype.constructor = DTFOutroScreen;


DTFOutroScreen.prototype.init = function()
{
    gGame.model.mode = "";
    gGame.view.setScreen("outroscreen");
    gGame.model.moreGamesButtonActive = true;

    // screen will start with whiteout
};


DTFOutroScreen.prototype.uiInput = function()
{
};

DTFOutroScreen.prototype.update = function()
{
    if(gGame.view.screenFade.bDraw == true)
    {
        this.alphaFader.update();
        gGame.view.screenFade.alpha = 1-this.alphaFader.getParameter();

        if(this.alphaFader.finished() == true)
        {
            gGame.view.screenFade.bDraw = false;
        }
    }
    else
    {
        if(gGame.view.screen.getUserEvent() == "pressed")
        {
            gGame.controller.gamestate.setScreen('attractscreen');
        }
    }
    gGame.update();
};

DTFOutroScreen.prototype.draw = function()
{
    gGame.draw();
};

DTFOutroScreen.prototype.exit = function()
{
    gGame.model.moreGamesButtonActive = false;
};


//======================================================================================================================
var DTFStartGame = function()
{
    this.mode = "";
    this.resultantGameMode = "";

    this.alphatick = 0;
    this.tickTime = 30;

    this.alphaFader = new TickFader();
    this.alphaFader.set(30);

    this.adamScrollSpeed = 0;
    this.adamBackgroundScrollSpeed = 0;
    this.scrollDuration = gAdamBackgroundScrollTime;

    this.backdropPos = new RMVector2(800,0);
    this.adamPos = new RMVector2(-400,0);
};


DTFStartGame.prototype = new RMGamemode();
DTFStartGame.prototype.constructor = DTFStartGame;


DTFStartGame.prototype.init = function()
{
    //gGame.view.setScreen("messagescreen");
    gGame.model.onNewLevel();
    gGame.model.mode = "";
    gGame.model.updateGameCharacters = false;
    gGame.view.setScreen("gamescreen");

    this.mode = 'fadein';
    this.resultantGameMode = "";
    this.alphatick = 0;

    this.alphaFader.reset();

    //gGame.view.screen.eventsEnabled = false;

    gGame.view.textPrinter.init();

    var textLabel = "adamintro_" +gGame.model.currentLevel;

    gGame.view.textPrinter.position = gGame.view.screen.layerBank["messagescreen_text"].size.TL();

    if(gGameTextLabels == true)
    {
        gGame.view.textPrinter.referenceText = textLabel +"\n" + gametext[textLabel];
        gGame.view.textPrinter.position.y -= 20*1.3; // GARETH
    }
    else
    {
        gGame.view.textPrinter.referenceText = gametext[textLabel];
    }

    gGame.view.adamuppbackdropOffset = this.backdropPos.clone();
    gGame.view.adamuppOffset = this.adamPos.clone();

    gGame.model.drawAdamUpp = true;
    gGame.model.moreGamesButtonActive = true;
};


DTFStartGame.prototype.uiInput = function()
{
};

DTFStartGame.prototype.update = function()
{
    this.alphaFader.update();

    switch(this.mode)
    {
        case 'fadein':
        {
            if(this.alphaFader.finished() == true)
            {
                this.mode = 'fadegamedown';
                this.alphaFader.reset();

                gGame.view.screenFade.bDraw = false;
            }
            else
            {
                gGame.view.screenFade.alpha = 1 - this.alphaFader.getParameter();
                gGame.view.screenFade.bDraw = true;
            }
        }
        break;

        case 'fadegamedown':
        {
            //if(this.alphaFader.finished() == true)
            {
                this.mode = 'rollon';

                this.adamScrollSpeed = (gGame.view.adamuppOffset.x/this.scrollDuration)*-1;
                this.adamBackgroundScrollSpeed = (gGame.view.adamuppbackdropOffset.x/this.scrollDuration)*-1;

                gGame.view.darkDialogBackdrop.bDraw = true;
                gGame.view.darkDialogBackdrop.alpha = 0.8;
            }

        }
        break;

        case 'rollon':
        {
            var backgroundDone = false;
            var adamDone = false;

            if( (gGame.view.adamuppbackdropOffset.x + this.adamBackgroundScrollSpeed) > 0)
            {
                gGame.view.adamuppbackdropOffset.x += this.adamBackgroundScrollSpeed;
            }
            else
            {
                gGame.view.adamuppbackdropOffset.x = 0;
                backgroundDone = true;

                if( (gGame.view.adamuppOffset.x + this.adamScrollSpeed) < 0)
                {
                    gGame.view.adamuppOffset.x += this.adamScrollSpeed;
                }
                else
                {
                    gGame.view.adamuppOffset.x = 0;
                    adamDone = true;
                }
            }

            if((adamDone == true) && (backgroundDone == true))
            {
                this.mode = 'text';
            }
        }
        break;

        case 'text':
        {
            gGame.view.textPrinter.update();
            gGame.model.showClickToContinueMessage = true;

            if(gGame.view.screen.getUserEvent() == "pressed")
            {
                if(gGame.controller.userEventInUI() == false)
                {
                    if(gGame.view.textPrinter.isPrintingComplete() == false)
                    {
                        gGame.view.textPrinter.setPrintingComplete();
                        gGame.audio.playButtonHit();
                    }
                    else
                    {
                        this.mode = 'rolloff';

                        this.adamBackgroundScrollSpeed *= -1;
                        this.adamScrollSpeed *=-1;
                        gGame.audio.playButtonHit();
                    }
                }
            }
        }
        break;

        case 'rolloff':

            gGame.model.showClickToContinueMessage = false;

            if((gGame.view.adamuppOffset.x + this.adamScrollSpeed) > this.adamPos.x)
            {
                gGame.view.adamuppOffset.x += this.adamScrollSpeed;
            }
            else
            {
                gGame.view.adamuppOffset = this.adamPos;

                if((gGame.view.adamuppbackdropOffset.x + this.adamBackgroundScrollSpeed) < this.backdropPos.x)
                {
                    gGame.view.adamuppbackdropOffset.x += this.adamBackgroundScrollSpeed;
                }
                else
                {
                    gGame.view.adamuppbackdropOffset = this.backdropPos;
                    this.mode = 'fadegameup';
                }
            }
            break;

        case 'fadegameup':
            gGame.view.darkDialogBackdrop.bDraw = false;
            gGame.controller.gamestate.setScreen('startlevel');
            break;

        default:
            alert("DTFStartGame unknown state: " + this.mode);
            break;
    }

    /*
    if(gGame.view.screen.getUserEvent() == "released")
    {
        if(gGame.controller.userEventInUI() == true)
        {
            gGame.controller.buttonCallback(gGame.controller.userEventInUIGetButton());
        }
    }
*/
    gGame.update();
};

DTFStartGame.prototype.draw = function()
{
    gGame.draw();
};

DTFStartGame.prototype.exit = function()
{
    gGame.model.drawAdamUpp = false;
};

//======================================================================================================================
var DTFStartLevel = function()
{
};


DTFStartLevel.prototype = new RMGamemode();
DTFStartLevel.prototype.constructor = DTFStartLevel;


DTFStartLevel.prototype.init = function()
{
    gGame.audio.playTune("ingame",true);
    gGame.model.onNewLevel();
    gGame.view.setScreen("gamescreen");
    gGame.model.moreGamesButtonActive = false;
};


DTFStartLevel.prototype.uiInput = function()
{
};

DTFStartLevel.prototype.update = function()
{
    gGame.controller.gamestate.setScreen('readytothrow');
};

DTFStartLevel.prototype.draw = function()
{
    gGame.draw();
};

DTFStartLevel.prototype.exit = function()
{

};

//======================================================================================================================
var DTFReadyToThrow = function()
{
    this.ballData = [];
};


DTFReadyToThrow.prototype = new RMGamemode();
DTFReadyToThrow.prototype.constructor = DTFReadyToThrow;


DTFReadyToThrow.prototype.init = function()
{
    gGame.onReadyToThrow();
    gGame.view.drawBallProjection = false;
    gGame.model.moreGamesButtonActive = false;
};


DTFReadyToThrow.prototype.uiInput = function()
{
};

DTFReadyToThrow.prototype.update = function()
{
    if(gShowBallTrajectory == true)
    {
        gGame.model.ballData = [];

        gGame.model.ball.projectBall(gGame.model.ballData,22);
    }

    // tick a bit before doing this ...
    gGame.view.drawBallProjection = true;

    gGame.update();
};

DTFReadyToThrow.prototype.draw = function()
{
    gGame.draw();
};

DTFReadyToThrow.prototype.exit = function()
{
    gGame.view.drawBallProjection = false;
};

//======================================================================================================================
var DTFDropBall = function()
{
};


DTFDropBall.prototype = new RMGamemode();
DTFDropBall.prototype.constructor = DTFDropBall;


DTFDropBall.prototype.init = function()
{
    gGame.model.moreGamesButtonActive = false;
};


DTFDropBall.prototype.uiInput = function()
{
};

DTFDropBall.prototype.update = function()
{
    gGame.update();
};

DTFDropBall.prototype.draw = function()
{
    gGame.draw();
};

DTFDropBall.prototype.exit = function()
{

};

//======================================================================================================================
var DTFDropFruit = function()
{
};


DTFDropFruit.prototype = new RMGamemode();
DTFDropFruit.prototype.constructor = DTFDropFruit;


DTFDropFruit.prototype.init = function()
{
    gGame.onDropFruit();
    gGame.model.moreGamesButtonActive = false;
};


DTFDropFruit.prototype.uiInput = function()
{

};

DTFDropFruit.prototype.update = function()
{
    gGame.update();
    gGame.controller.onDroppingFruitMode();
};

DTFDropFruit.prototype.draw = function()
{
    gGame.draw();
};

DTFDropFruit.prototype.exit = function()
{

};

//======================================================================================================================
var DTFBucketBall = function()
{
};


DTFBucketBall.prototype = new RMGamemode();
DTFBucketBall.prototype.constructor = DTFBucketBall;


DTFBucketBall.prototype.init = function()
{
    gGame.onBucketBall();
    gGame.model.moreGamesButtonActive = false;
};


DTFBucketBall.prototype.uiInput = function()
{

};

DTFBucketBall.prototype.update = function()
{
    gGame.update();

    if( (gGame.model.isFruitToDrop == true) || (gGame.model.isCrittersToDrop == true))
    {
        gGame.controller.onDroppingFruitMode();
    }
    else
    {
        if(gGame.controller.gamestate.stateTick > 60)
        {
            gGame.controller.gamestate.setScreen('readytothrow');
        }
    }
};

DTFBucketBall.prototype.draw = function()
{
    gGame.draw();
    gCanvas.GLTextCentred(60,"Bucky Ball", new RMVector2(800/2,600/2),'#ffffff');
};

DTFBucketBall.prototype.exit = function()
{

};

//======================================================================================================================
var DTFLevelOver = function()
{
    this.mode = "";
    this.boardInitialOffset = new RMVector2(0,600);
    this.boardSpeed = 0;
    this.dimm1InitialOffset = new RMVector2(-300,0);
    this.dimm2InitialOffset = new RMVector2(300,0);
    this.dimm1Speed = 0;
    this.dimm2Speed = 0;

    this.rollOnFrames = glevelover_ScrollTime;
    this.tick = 0;

    this.alphaFader = new TickFader();
    this.alphaFader.set(30);
};


DTFLevelOver.prototype = new RMGamemode();
DTFLevelOver.prototype.constructor = DTFLevelOver;


DTFLevelOver.prototype.init = function()
{
    this.mode = "rollon";
    gGame.model.updateGameCharacters = false;
    gGame.view.darkDialogBackdrop.bDraw = true;
    gGame.model.drawEndOfLevel = true;
    gGame.model.pendingGamemodeChange = false;
    gGame.view.levelover_buttonsActive = false;
    gGame.view.levelover_hidebuttons = true;
    gGame.audio.playVan(false);
    /*
    gGame.checkForHighScore();
    gGame.model.levelWon = true;
    gGame.model.unlockLevel(gGame.model.currentLevel+1);
    //gGame.view.setScreen("levelover");
*/

    //if(gGame.model.isGameOver() == true) - game over man!
    //if(gGame.model.isLevelSuccessfullyCompleted() == true) - success man!
    //

    gGame.view.levelover_boardOffset = this.boardInitialOffset.clone();
    this.boardSpeed = this.boardInitialOffset.y/this.rollOnFrames;

    gGame.view.levelover_dimm1Offset = this.dimm1InitialOffset.clone();
    this.dimm1Speed = this.dimm1InitialOffset.x/this.rollOnFrames;

    gGame.view.levelover_dimm2Offset = this.dimm2InitialOffset.clone();
    this.dimm2Speed = this.dimm2InitialOffset.x/this.rollOnFrames;

    this.mode = "rollon";

    gGame.view.levelover_displayScore = !gGame.model.isGameOver();
    gGame.view.levelover_showBallsBonus = gGame.isBallsBonus();
    gGame.view.levelover_showFruitBonus = gGame.isUnripeFruitBonus();
    gGame.view.levelover_showLevelUnlocked = gGame.canUnlockNextLevel();

    gGame.view.levelover_bonusBallCount = gGame.getBonusBallCount();
    gGame.view.levelover_bonusFruitCount = gGame.getBonusFruitCount();

    gGame.view.levelover_showBestScore = false;


    /*GARETH - test for setting up results
    gGame.view.levelover_displayScore = true;
    gGame.view.levelover_showBestScore = false;
    gGame.view.levelover_showBallsBonus = true;
    gGame.view.levelover_bonusBallCount = 7;
    gGame.view.levelover_showFruitBonus = true;
    gGame.view.levelover_bonusFruitCount = 12;
    gGame.view.levelover_showLevelUnlocked = true;
    */

    if(gGame.view.levelover_showLevelUnlocked == true)
    {
        gGame.unlockLevel();
    }

    gGame.model.moreGamesButtonActive = true;
};


DTFLevelOver.prototype.uiInput = function()
{

};

DTFLevelOver.prototype.update = function()
{
    this.alphaFader.update();
    this.tick++;

    switch(this.mode)
    {
        case 'rollon':
        {
            if(gGame.view.levelover_boardOffset.y > 0)
            {
                if( (gGame.view.levelover_boardOffset.y + this.boardSpeed) >= 0)
                {
                    gGame.view.levelover_boardOffset.y -= this.boardSpeed;
                }
                else
                {
                    gGame.view.levelover_boardOffset.y = 0;
                }
            }
            else
            {
                var dimm1Finished = false;
                var dimm2Finished = false;
                if(gGame.view.levelover_dimm1Offset.x < 0)
                {
                    if( (gGame.view.levelover_dimm1Offset.x - this.dimm1Speed) <=0)
                    {
                        gGame.view.levelover_dimm1Offset.x -= this.dimm1Speed;
                    }
                    else
                    {
                        gGame.view.levelover_dimm1Offset.x = 0;
                    }
                }
                else
                {
                    dimm1Finished = true;
                }

                if(gGame.view.levelover_dimm2Offset.x > 0)
                {
                    if( (gGame.view.levelover_dimm2Offset.x + this.dimm2Speed) >=0)
                    {
                        gGame.view.levelover_dimm2Offset.x -= this.dimm2Speed;
                    }
                    else
                    {
                        gGame.view.levelover_dimm2Offset.x = 0;
                    }
                }
                else
                {
                    dimm2Finished = true;
                }

                if( (dimm1Finished == true)
                  &&(dimm2Finished == true)
                  )
                {
                    if(gGame.view.levelover_displayScore == false) // player lost?
                    {
                        this.mode = 'losetext1';
                    }
                    else
                    {
                        this.mode = 'doballs';
                    }

                    this.tick = 0;
                }
            }
        }
        break;

        case 'losetext1':
        {
            if(this.tick > 30)
            {
                this.mode = 'finaltext';
                this.tick = 0;
                gGame.view.levelover_buttonsActive = true;
            }
        }
        break;

        case 'showscore':
            gGame.view.levelover_displayScore = true;

        break;

        case 'doballs':
        {
            if(this.tick == 1)
            {
                if(gGame.view.levelover_bonusBallCount > 0)
                {
                    gGame.view.levelover_bonusBallCount--;
                    gGame.model.playerScore+= gGame.model.ballBonus;
                    gGame.audio.playLevelCompleteSuccess();
                }

                if(gGame.view.levelover_bonusBallCount == 0)
                {
                    this.mode = 'dofruit';
                }

            }
            else
            {
                if(this.tick == 40)
                {
                    this.tick = 0;
                }
            }
        }
        break;

        case 'dofruit':
        {
            if(this.tick == 1)
            {
                if(gGame.view.levelover_bonusFruitCount > 0)
                {
                    gGame.view.levelover_bonusFruitCount--;
                    gGame.model.playerScore+= gGame.model.fruitBonus;
                    gGame.audio.playLevelCompleteSuccess();
                }

                if(gGame.view.levelover_bonusFruitCount == 0)
                {
                    this.mode = 'finaltext';
                }
            }
            else
            {
                if(this.tick == 40)
                {
                    this.tick = 0;
                }
            }
        }
        break;


        case 'finaltext':
        {
            if(this.tick == 40)
            {
                if(gGame.view.levelover_showBestScore == false)
                {
                    if(gGame.isHighScore() == true)
                    {
                        gGame.view.levelover_showBestScore = true;
                        gGame.audio.playLevelCompleteSuccess();
                        gGame.setHighScore();
                    }
                }

                //prep next level
                // see onleveloverbutton2 for the rest of the functionality ...
                //GARETH - i think this is making the fail->retry->next level problem gGame.model.levelSuccess=true;
                gGame.view.levelover_buttonsActive = true;
                gGame.view.levelover_hidebuttons = false;
            }

            if(gGame.model.pendingGamemodeChange == true)
            {
                this.mode = 'rolloff';
                this.dimm1Speed *=-1;
                this.dimm2Speed *=-1;
                this.boardSpeed *=-1;
            }
        }
        break;

        case 'rolloff':
            var dimm1Finished = false;
            var dimm2Finished = false;
            if(gGame.view.levelover_dimm1Offset.x > this.dimm1InitialOffset.x)
            {
                if( (gGame.view.levelover_dimm1Offset.x - this.dimm1Speed) > this.dimm1InitialOffset.x)
                {
                    gGame.view.levelover_dimm1Offset.x -= this.dimm1Speed;
                }
                else
                {
                    gGame.view.levelover_dimm1Offset.x = this.dimm1InitialOffset.x;
                }
            }
            else
            {
                dimm1Finished = true;
            }

            if(gGame.view.levelover_dimm2Offset.x <  this.dimm2InitialOffset.x)
            {
                if( (gGame.view.levelover_dimm2Offset.x - this.dimm2Speed) < this.dimm2InitialOffset.x)
                {
                    gGame.view.levelover_dimm2Offset.x -= this.dimm2Speed;
                }
                else
                {
                    gGame.view.levelover_dimm2Offset.x = this.dimm2InitialOffset.x;
                }
            }
            else
            {
                dimm2Finished = true;
            }

            if( (dimm1Finished == true)
                &&(dimm2Finished == true)
                )
            {
                if(gGame.view.levelover_boardOffset.y < this.boardInitialOffset.y)
                {
                    if( (gGame.view.levelover_boardOffset.y - this.boardSpeed) < this.boardInitialOffset.y)
                    {
                        gGame.view.levelover_boardOffset.y -= this.boardSpeed;
                    }
                    else
                    {
                        gGame.view.levelover_boardOffset.y = this.boardInitialOffset.y;
                    }
                }
                else
                {
                    this.mode = 'fadeout';
                    this.alphaFader.reset();

                    if(gGame.model.levelSuccess==true)
                    {
                        //fade to white
                        gGame.view.screenFade.r = 255;
                        gGame.view.screenFade.g = 255;
                        gGame.view.screenFade.b = 255;
                    }
                    else
                    {
                        //fade to black
                        gGame.view.screenFade.r = 0;
                        gGame.view.screenFade.g = 0;
                        gGame.view.screenFade.b = 0;
                    }
                }
            }
            break;

        case 'fadeout':
            //do switching here ....
            gGame.view.screenFade.bDraw = true;
            gGame.view.screenFade.alpha = this.alphaFader.getParameter();

            if(this.alphaFader.finished() == true)
            {
                gGame.controller.gamestate.setScreen(gGame.model.pendingGamemode);
                gGame.model.pendingGamemodeChange = false;
            }
            break;
    }
    gGame.model.mode = "";
    gGame.update();
};

DTFLevelOver.prototype.draw = function()
{
    gGame.draw();
};

DTFLevelOver.prototype.exit = function()
{
    gGame.model.drawEndOfLevel = false;
    gGame.view.darkDialogBackdrop.bDraw = false;
};
//======================================================================================================================
var DTFFreeGo = function()
{
};


DTFFreeGo.prototype = new RMGamemode();
DTFFreeGo.prototype.constructor = DTFFreeGo;


DTFFreeGo.prototype.init = function()
{
    gGame.model.onFreeThrow();
    gGame.model.moreGamesButtonActive = false;
};


DTFFreeGo.prototype.uiInput = function()
{

};

DTFFreeGo.prototype.update = function()
{
    gGame.model.mode = "";
    gGame.update();

    if(gGame.controller.gamestate.stateTick > 60)
    {
        gGame.controller.gamestate.setScreen('readytothrow');
    }

};

DTFFreeGo.prototype.draw = function()
{
    gGame.draw();
    gCanvas.GLTextCentred(60,"Free throw", new RMVector2(800/2,600/2),'#ffffff');
};

DTFFreeGo.prototype.exit = function()
{

};

//======================================================================================================================
var DTFPauseMode = function()
{
    this.returnMode = "";
};


DTFPauseMode.prototype = new RMGamemode();
DTFPauseMode.prototype.constructor = DTFPauseMode;


DTFPauseMode.prototype.init = function()
{
    this.returnMode = gGame.controller.gamestate.previousScreen;

    gGame.audio.pause();
    gGame.model.moreGamesButtonActive = false;
};


DTFPauseMode.prototype.uiInput = function()
{

};

DTFPauseMode.prototype.update = function()
{
    if(gRMPlatform.isActiveWindow() == true)
    {
        gGame.controller.gamestate.resumeMode(this.returnMode);
        gGame.audio.resume();
    }
};

DTFPauseMode.prototype.draw = function()
{
    gGame.draw();
    gCanvas.GLTextCentred(60,"Game Paused"
        , new RMVector2(800/2,600/2),'#ffffff');
};

DTFPauseMode.prototype.exit = function()
{

};