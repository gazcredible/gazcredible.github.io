var DTFModel	=	function()
{
    this.imageBank = new RMImageBank();
    this.fruitList = [];
    this.dropFruitList = [];
    this.critterList = [];
    this.ball = null;

    this.bNeedsRedraw = true;
    this.renderCanvas = null;

    this.mode = 'ball';
    this.droppingFruitComplete = true;
    this.droppingCrittersComplete = true;

    this.ballCount=0;
    this.ballAngle = 0;
    this.ballDir = 1;
    this.lifetimeTick=0;
    this.ballHasHitFruit=false;
    this.ballHasHitCritters=false;
    this.ripeFruitCount=0;
    this.totalripeFruitCount=0;
    this.levelSuccess = false;
    this.levelHighScores = new DTFLevelScoreTable();

    this.scoreList = [];
    this.fruitHiglightList = [];

    this.playerScore = 0;
    this.highScoreSet = false;
    this.sunrayAngle=0;
    this.currentLevel =0;
    this.levelWon = false;

    makelevels();

    this.gameLevels = levellist.length;
    this.leafList = [];
    this.initLeaves();

    this.selectPage = 0;
    this.selectPageScrollSpeed = 30;
    this.changingPage = false;
    this.desiredPage=0;
    this.selectPageOffset = new RMVector2(0,0);

    this.dim2 = null;
    this.logo = null;
    this.throwButton = null;

    this.isUIEnabled = true;
    this.showClickToContinueMessage = true;

    this.fruitNames = new Array
    (
        "apple",
        "cherry",
        "orange",
        "peach",
        "plum"


    );

    this.ballIsVisisble = false;
    this.isFruitToDrop = false;
    this.isCrittersToDrop = false;

    this.updateGameCharacters = true;

    this.drawEndOfLevel = false;
    this.drawAdamUpp = false;

    this.pendingGamemodeChange = false;
    this.pendingGamemode = "";

    this.ballBonus = 1000;
    this.fruitBonus = 50;

    this.incrementCurrentLevel = false;
    this.moreGamesButtonActive = false;

    //for pre-calc'ing the ball in ready to throw
    this.ballData = [];
}

DTFModel.prototype =
{
    doStuff:function()
    {

    },

    oneTimeInit:function()
    {

    },

    onNewLevel:function()
    {
        if(this.incrementCurrentLevel == true)
        {
            this.currentLevel++;
            this.incrementCurrentLevel = false;
        }

        // GARETH need to do level init here
        this.ballIsVisisble = true;
        this.ripeFruitCount = 0;
        this.levelSuccess = false;
        this.lifetimeTick=0;
        this.ballHasHitFruit=false;
        this.ballHasHitCritters=false;
        this.levelWon = false;

        this.playerScore = 0;
        this.highScoreSet = false;

        this.fruitList = [];
        this.dropFruitList = [];
        this.critterList = [];
        this.isFruitToDrop = false;
        this.isCrittersToDrop = false;
        this.mode = 'readytothrow';
        this.ball = new DTFBall();

        if(gFailLevel == true)
        {
            this.ballCount =1;
        }
        else
        {
            if(gLotsofBalls == true)
            {
                this.ballCount = 15;
            }
            else
            {
                this.ballCount = 7;
            }
        }

        //end
        var level = levellist[this.currentLevel];

        for(var i=0;i<level.ripeFruitList.length;i++)
        {
            this.fruitList.push(level.ripeFruitList[i].clone() );
        }

        this.totalripeFruitCount = level.ripeFruitList.length;

        for(var i=0;i<level.unripeFruitList.length;i++)
        {
            this.fruitList.push(level.unripeFruitList[i].clone());
        }

        this.ripeFruitCount = this.totalripeFruitCount;

        for(var i=0;i<level.critterList.length;i++)
        {
            this.critterList.push(level.critterList[i].clone());
        }
    },

    launchBall:function()
    {
        this.ball.launch();
        this.mode = 'ball';
    },

    isBucketBall:function()
    {
        return false; //GARETH determine if ball made it into truck
    },


    reset:function()
    {
    },

    oneTimeInit:function()
    {
        this.imageBank.addImage('test00','game/images/test00.png');
        this.imageBank.addImage('peg','game/images/peg.png');

        this.dim1 = new DTFBallChucker();
        this.dim1.init();

        this.dim2 = new DTFBucketVan();
        this.dim2.init();

        this.logo = new DTFLogo();
        this.logo.init();

        this.throwButton = new DTFThrowButton();
        this.throwButton.init();
    },

    throwBall:function()
    {
        if(this.canThrowBall() == true)
        {
            this.launchBall();
            gGame.controller.gamestate.setScreen('dropball');
            this.ballCount--;
        }
    },

    canThrowBall:function()
    {
        if(gGame.controller.gamestate.screenName == 'readytothrow')
        {
            return true;
        }

        return false;
    },

    isDroppingComplete:function()
    {
        return ((this.droppingFruitComplete == true)
            && (this.droppingCrittersComplete == true));
    },

    onFreeThrow:function()
    {
        this.mode = "";
        this.ballCount++;
        gGame.audio.onFreeThrow();
    },


    buildDropList:function()
    {
        this.dropFruitList = [];

        for(var i=0;i< this.fruitList.length;i++)
        {
            if(this.fruitList[i].beenHit() == true)
            {
                this.dropFruitList.push(this.fruitList[i]);
            }
        }

        for(var i=0;i< this.dropFruitList.length;i++)
        {
            var index = this.fruitList.indexOf(this.dropFruitList[i]);

            if(index !=-1)
            {
                this.fruitList.splice(index,1);
            }
        }
    },

    getBallsLeft:function()
    {
        return this.ballCount;
    },

    isGameOver:function()
    {
        if((this.getBallsLeft() == 0) && (this.levelSuccess == false))
        {
            //GARETH && ripe fruit left
            return true;
        }

        return false;
    },

    isLevelSuccessfullyCompleted:function()
    {
        return this.levelSuccess;
    },


    updateBall:function()
    {
        if(this.mode == 'readytothrow')
        {
            this.ball.setPosition(this.dim1.getBallPosition());
        }
    },

    canHighlightThrowButton:function()
    {
        if(this.mode == 'readytothrow')
        {
            return (this.lifetimeTick%60 >=30);
        }

        return false;
    },

    isBallThrowable:function()
    {
        return (this.mode == 'readytothrow');
    },

    onCritterHit:function(critter)
    {
        this.ballHasHitCritters = true;
    },

    onFruitHit:function(fruit)
    {
        if(fruit.ripe == true)
        {
            this.ripeFruitCount--;

            if(this.ripeFruitCount == 0)
            {
                this.levelSuccess = true;
            }

            gGame.audio.playRipeFruitInitialHit();
        }
        else
        {
            gGame.audio.playFruitHit();
        }

        var inst = new DTFScoreDisplay();
        var score = this.getFruitScore(fruit);
        this.playerScore += score;
        inst.init(fruit,score);
        this.scoreList.push(inst);

        this.ballHasHitFruit = true;
    },

    updateScoreList:function()
    {
        var newList = [];

        for(var i=0;i<this.scoreList.length;i++)
        {
            this.scoreList[i].update();

            if(this.scoreList[i].isFinished() == false)
            {
                newList.push(this.scoreList[i]);
            }
        }

        this.scoreList = newList;
    },

    updateFruitHighlightList:function()
    {
        var newList = [];

        for(var i=0;i<this.fruitHiglightList.length;i++)
        {
            this.fruitHiglightList[i].update();

            if(this.fruitHiglightList[i].isFinished() == false)
            {
                newList.push(this.fruitHiglightList[i]);
            }
        }

        this.fruitHiglightList = newList;
    },

    getBallState:function()
    {
        if(this.dim2.isBucketBall(this.ball) == true)
        {
            return "in van";
        }
        if(this.ball.isOnScreen() == false)
        {
            if((this.ballHasHitFruit == false) && (this.ballHasHitCritters == false))
            {
                return "no hits";
            }
            return "off screen";
        }
        return "in play";
    },

    getFruitScore:function(fruit)
    {
        if(fruit.ripe == true)
        {
            return 100;
        }

        if(this.levelSuccess == true)
        {
            return 10;
        }

        return 10;
    },

    getPlayerScore:function()
    {
        return this.playerScore;
    },

    getCurrentLevel:function()
    {
        return levellist[this.currentLevel];
    },

    initLeaves:function()
    {

    },

    updateLeaves:function()
    {
        if (this.lifetimeTick%60 ==0)
        {
            var inst =  new DTFLeaf();
            inst.init();
            this.leafList.push(inst);
        }

        var newList = [];

        for(var i = 0;i< this.leafList.length;i++)
        {
            this.leafList[i].update();

            if(this.leafList[i].isFinished() == false)
            {
                newList.push(this.leafList[i]);
            }
        }

        this.leafList = newList;
    },

    onPrevLevelSelectPage:function()
    {
        if(this.selectPage > 0)
        {
            this.onStartChangeSelectPage(this.selectPage-1);
        }
    },


    onNextLevelSelectPage:function()
    {
        if(this.selectPage < 4)
        {
            this.onStartChangeSelectPage(this.selectPage+1);
        }
    },

    onStartChangeSelectPage:function (inDesiredPage)
    {
        this.changingPage = true;
        this.desiredPage=inDesiredPage;
        this.selectPageOffset = new RMVector2(0,0);
    },

    startlevel:function(inLevel)
    {
        if(inLevel > 19)
        {
            alert("bad level: " + inLevel);
        }

        this.currentLevel  = inLevel;

        if(this.currentLevel == 0)
        {
            gGame.controller.gamestate.screenHash[gGame.controller.gamestate.screenName].setWipeMode('introscreen');
        }
        else
        {
            gGame.controller.gamestate.screenHash[gGame.controller.gamestate.screenName].setWipeMode('startgame');
        }
    },

        /*
     *  GARETH - this is what we call when a new game is started
     */
    onStartGame:function()
    {
        this.playerScore = 0;
        this.ballIsVisisble = true;
    },

    isBallVisible:function()
    {
        if(this.ball == undefined)  return false;
        if(this.ball.isOnScreen() == false) return false;
        return this.ballIsVisisble;
    },

    getFruitColour:function()
    {
        switch( Math.floor(this.currentLevel/4) )
        {
            case 0: // apple
                return "rgba(201,187,37,0.75)";
                break;
            case 1: // cherry
                return "rgba(233,54,73,0.75)";
                break;
            case 2: // orange
                return "rgba(244,169,122,0.75)";
                break;
            case 3: // peach

                return "rgba(236,89,121,0.75)";
                break;
            case 4: // plum
                return "rgba(165,43,183,0.75)";
                break;

            default:
                alert("unhandled level: " + name);

        }
    },

    isLevelAvailable:function(inLevel)
    {
        if(gMakeAllLevelsAvailable == true)
        {
            return true;
        }
        return this.levelHighScores.isLevelAvailable(inLevel);
    },

    getUnripeFruitCount:function()
    {
        var count = 0;
        for(var i=0;i< this.fruitList.length;i++)
        {
            if(this.fruitList[i].ripe == false)
            {
                count++;
            }
        }

        return count;
    }
};