var DTFGame = function()
{
    this.model = new DTFModel();
    this.controller = new DTFController();
    this.view = new DTFView();

    this.audio = new DTFAudio();

    this.timeToUpdate = 0;
    this.firstFrame = true;
};

DTFGame.prototype.oneTimeInit = function()
{
    gCanvas.setGLReferenceScreen(800,600);
    this.controller.oneTimeInit();
};

DTFGame.prototype.draw=function()
{
    this.view.draw();
    if(gEnableAudio == true)
    {
        this.audio.update();
    }
};

DTFGame.prototype.update=function()
{
    if( this.controller.gamestate.screenName != "pausemode")
    {
        if(gRMPlatform.isActiveWindow() == false)
        {
            this.controller.gamestate.startPauseMode("pausemode");
        }
        else
        {
            var zibboButton = new RMRect(680, 0, 100, 60);
            var moreGamesButton = new RMRect(0, 0, 180, 130);

            if(gMouseState.state == "pressed")
            {
                if(gMouseState.GLPosition != undefined)
                {
                    if(zibboButton.isInMe(gMouseState.GLPosition) == true)
                    {
                        //gRMPlatform.openNewTab("http://www.zibbo.com/");
                        GameAPI.Branding.getLink('more_games').action();
                    }

                    if(this.model.moreGamesButtonActive == true)
                    {
                        if(moreGamesButton.isInMe(gMouseState.GLPosition) == true)
                        {
                            //gRMPlatform.openNewTab("http://www.zibbo.com/");
                            //GameAPI.Branding.getLink('more_games').action();
                        }
                    }
                }
            }
        }
    }
    //this.model.update();
    this.controller.update();
    this.view.update();
};

DTFGame.prototype.onReadyToThrow = function()
{
    this.model.mode = 'readytothrow';
    this.model.ballAngle = 0;
    this.model.ballDir = 1;

    this.model.ballHasHitFruit = false;
    this.model.ballHasHitCritters=false;
    this.model.ballIsVisisble = true;

    this.audio.playVan(true);

    gGame.view.screen.eventsEnabled = true;
    gGame.model.updateGameCharacters = true;
};

DTFGame.prototype.onDropFruit = function()
{
    this.model.droppingFruitComplete = false;
    this.model.droppingCrittersComplete = false;

    this.controller.buildFruitDropList();
    this.controller.buildCritterDropList();

    if(this.model.dropFruitList.length > 0)
    {
        this.audio.onFruitDrop();
    }
};

DTFGame.prototype.onBucketBall = function()
{
    this.model.ballIsVisisble = false;
    this.model.mode = "fruit";
    this.model.ballCount++;

    this.controller.buildFruitDropList();
    this.controller.buildCritterDropList();
    this.audio.onBucketBall();
},


DTFGame.prototype.checkForHighScore=function()
{
    if(this.model.levelHighScores.getScore(this.model.currentLevel) < this.model.getPlayerScore())
    {
        this.model.highScoreSet = true;
        this.model.levelHighScores.setScore(this.model.currentLevel,this.model.getPlayerScore() );
    }
};

var mySound = null;

DTFGame.prototype.runGame=function()
{
    gCanvas.setSize(window.innerWidth,window.innerHeight);
    gCanvas.setCurrentResolution(window.innerWidth,window.innerHeight);

    var logicTicks = 0;
    var remainingTIme = 0;

    gMouseState.update();

    var rate = 1000/60.0;

    if(this.timeToUpdate < 0)
    {
        this.timeToUpdate = 0
    }

    if(this.timeToUpdate > (20*rate))
    {
        this.timeToUpdate = 20*rate;
    }

    if(this.firstFrame == true)
    {
        this.timeToUpdate = rate;
        this.firstFrame = false;
    }

    do
    {
        if(this.timeToUpdate >= rate)
        {
            gGame.controller.gamestate.update();
            this.timeToUpdate -= rate;

            logicTicks++;
        }
    }while(this.timeToUpdate >= rate);

    remainingTIme = this.timeToUpdate;
    gGame.controller.gamestate.draw();

    if(Math.abs(gGame.controller.gamestate.mFrameRate) < 1000)
    {
        this.timeToUpdate += gGame.controller.gamestate.mFrameRate;
    }

    if(gDebugInfo == true)
    {
        gCanvas.Text(24,gGame.controller.gamestate.mFrameRate.toFixed(1) +"mS :" + gGame.controller.gamestate.screenName,new RMVector2(10,20),'#ffffff','left');
        gCanvas.Text(24,"Logics: "+logicTicks.toFixed(0) + " " + remainingTIme.toFixed(2),new RMVector2(10,70),'#ffffff','left');

        var hw = gRMPlatform.getPlatform();

        gCanvas.Text(12,"Platform " + hw + " Device: " + gRMPlatform.getDeviceName() + " " + gRMPlatform.getVersion().toString(),new RMVector2(10,100),'#ffffff','left');

        gCanvas.Text(12,this.audio.toString(),new RMVector2(10,120),'#ffffff','left');



        var hw = gRMPlatform;

        for(var i=0;i<hw.strings.length;i++)
        {
            gCanvas.Text(12,i +" >" + hw.strings[i]+"<",new RMVector2(10,140+(i*14)),'#ffffff','left');
        }

        var mousePos = gMouseState.GLMousePos();

        if(mousePos != undefined)
        {
            var modelRect = new RMRect();
            modelRect.set(mousePos.x,mousePos.y,10,10);

            gCanvas.GLRect(modelRect,'#0000ff');
        }
    }
};

DTFGame.prototype.isContentLoaded=function()
{
    if(this.view.isContentLoaded() == true)
    {
        return gAudioWebkit.isContentLoaded();
    }

    return false;
};

DTFGame.prototype.setHighScore=function()
{
    this.model.levelHighScores.setScore(this.model.currentLevel,this.model.playerScore);
};

DTFGame.prototype.unlockLevel=function()
{
    if(gGame.model.currentLevel+1 >= gGame.model.gameLevels)  return;
    this.model.levelHighScores.unlockLevel(this.model.currentLevel+1);
}

DTFGame.prototype.isHighScore=function()
{
    return this.model.levelHighScores.levelScores[this.model.currentLevel] < this.model.playerScore;
}

DTFGame.prototype.isBallsBonus=function()
{
    if(gGame.model.isGameOver() == true) return false;

    return true;
}

DTFGame.prototype.isUnripeFruitBonus=function()
{
    if(gGame.model.isGameOver() == true) return false;

    return gGame.model.getUnripeFruitCount() > 0;
}

DTFGame.prototype.canUnlockNextLevel=function()
{
    if(gGame.model.currentLevel+1 >= gGame.model.gameLevels)  return false;

    return (this.model.levelHighScores.levelAccess[this.model.currentLevel+1] == false)
    && (gGame.model.isGameOver() == false);
}
DTFGame.prototype.getBonusBallCount=function()
{
    return this.model.ballCount;
}
DTFGame.prototype.getBonusFruitCount=function()
{
    return gGame.model.getUnripeFruitCount();
}

gGame = new DTFGame();
