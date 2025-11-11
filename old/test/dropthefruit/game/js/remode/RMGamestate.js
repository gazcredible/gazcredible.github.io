
var RMGamestate	=	function()
{
    this.screenName ="";
    this.newScreen = "";
    this.previousScreen = "";
    this.screenHash = {};
    this.lifetimeTick = 0;
    this.stateTick = 0;

    this.fade = false;
    this.fadeTimer = 0;
    this.fadeDownTime = 60;
    this.fadeUpTime = 100;
    this.fadeState ="";


    this.showBounds = false;

    this.mFrameTime		=		getTicks();
    this.mLastFrameTime	=		getTicks();
    this.mLogicTime	=		getTicks();

    this.mFrameRate		=		0;
    this.worstLogicTime = 0;

}


RMGamestate.prototype =
{
    doStuff:function()
    {

    },

    addScreen:function(inName, inScreen)
    {
        this.screenHash.name = inName;
        this.screenHash[inName] = inScreen;
    },

    setScreen:function(inName)
    {
        if(this.screenName != inName)
        {
            this.newScreen = inName;
        }
    },

    setScreenFade:function(inScreen)
    {
        this.newScreen = inScreen;
        this.fade = true;
        this.fadeTimer = 0;
        this.fadeState ="down";
    },

    //GARETH - return to an existing game mode
    resumeMode:function(inScreen)
    {
        this.screenName = inScreen;
    },

    startPauseMode:function(inScreen)
    {
        this.previousScreen = this.screenName;
        this.screenName = inScreen;

        this.screenHash[this.screenName].init();
    },

    update:function(inTicks)
    {
        var time = getTicks();

        if( (this.screenHash[this.screenName] != undefined)
          &&(this.fade == false)
          )
        {
            this.screenHash[this.screenName].uiInput();
        }

        if(this.newScreen != "")
        {
            //new screen
            if(this.screenName != "")
            {
                if(this.fade == false)
                {
                    if(this.screenHash[this.screenName] != undefined)
                    {
                        if(this.screenHash[this.screenName].exit != undefined)
                            this.screenHash[this.screenName].exit();
                    }

                    this.previousScreen = this.screenName;
                    this.screenName = this.newScreen;

                    if( (this.screenName != "")
                        &&(this.screenHash[this.screenName] != undefined)
                        )
                    {
                        this.screenHash[this.screenName].init();
                        this.stateTick = 0;
                    }

                    this.newScreen = "";
                }
                else
                {
                    this.fadeTimer+= inTicks;

                    if((this.fadeState == "down") && (this.fadeTimer >= this.fadeDownTime))
                    {
                        this.fadeState = "up";
                        this.fadeTimer = 0;

                        if(this.screenHash[this.screenName] != undefined)
                        {
                            if(this.screenHash[this.screenName].exit != undefined)
                            {
                                this.screenHash[this.screenName].exit();
                            }

                            this.screenName = this.newScreen;

                            if( (this.screenName != "")
                                &&(this.screenHash[this.screenName] != undefined)
                                )
                            {
                                this.screenHash[this.screenName].init();
                                this.stateTick = 0;
                            }

                            this.newScreen = "";
                        }
                    }
                }
            }
            else
            {
                this.screenName = this.newScreen;

                if( (this.screenName != "")
                    &&(this.screenHash[this.screenName] != undefined)
                    )
                {
                    this.screenHash[this.screenName].init();
                    this.stateTick = 0;
                }

                this.newScreen = "";
            }
        }
        else
        {
            if( (this.screenName != "")
                &&(this.screenHash[this.screenName] != undefined)
                &&(this.fade == false)
                )
            {
                this.screenHash[this.screenName].update(inTicks);
                this.stateTick++;
            }
            else
            {
                if((this.fadeState == "up") && (this.fadeTimer >= this.fadeUpTime))
                {
                    this.fade = false;
                }

                this.fadeTimer+= inTicks;
            }
        }


        this.lifetimeTick++;

        var endTime = getTicks();
        var logicDelta = endTime - time;

        this.mLogicTime = (logicDelta*1).toFixed(2);

        if(this.lifetimeTick > 120)
        {
            if(this.mLogicTime > this.worstLogicTime)
            {
                this.worstLogicTime = this.mLogicTime;
            }
        }
    },

    draw:function(inCanvas)
    {
        gCanvas.reset();

        if(this.showBounds = true)
        {
            //var size = gCanvas.GLcurrentScreenSize;

            //gCanvas.rect(new RMRect(0,0,size.w,size.h),'#000000');

            size = gCanvas.GLreferenceScreen;

            gCanvas.GLRect(new RMRect(0,0,size.w,size.h),'#700000');
        }

        if( (this.screenName != "")
            &&(this.screenHash[this.screenName] != undefined)
            )
        {
            //inCanvas.setCurrentResolution(window.innerWidth,window.innerHeight);
            this.screenHash[this.screenName].draw(inCanvas);

            if(this.fade == true)
            {
                var alpha = 1;

                if(this.fadeState == "down")
                {
                    alpha = (this.fadeTimer /this.fadeDownTime);
                }

                if(this.fadeState == "up")
                {
                    alpha = 1.0 - (this.fadeTimer/this.fadeUpTime);
                }

                alpha = Math.max(0,Math.min(1,alpha));

                if(alpha > 0.3)
                {
                    gCanvas.mContext.save();
                    gCanvas.mContext.globalAlpha	=	alpha;
                    gCanvas.rect(new RMRect(0,0,gCanvas.GLreferenceScreen.w,gCanvas.GLreferenceScreen.h),'#000000');

                    gCanvas.mContext.restore();
                }
            }
        }
        else
        {
            if(false)
            {
                var rect = new RMRect();
                rect.set(0,0,window.innerWidth,window.innerHeight);
                gCanvas.rect(rect,'#ff0000');
            }
        }

        this.mCurrentFrameTime = microtime(true);//getTicks()*1000;///1000.0;
        this.mFrameRate	= 0;

        var frameDelta = this.mCurrentFrameTime - this.mLastFrameTime;
        this.mLastFrameTime	= this.mCurrentFrameTime;

        this.mFrameRate = (frameDelta*1000);
    },

    reset:function()
    {
        if( (this.screenName != "")
            &&(this.screenHash[this.screenName] != undefined)
            )
        {
            this.screenHash[this.screenName].reset();
        }
    }
};

function microtime (get_as_float) {
    // http://kevin.vanzonneveld.net
    // + original by: Paulo Freitas
    // * example 1: timeStamp = microtime(true);
    // * results 1: timeStamp > 1000000000 && timeStamp < 2000000000
    var now = new Date().getTime() / 1000;
    var s = parseInt(now, 10);

    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}



var RMGamemode = function()
{

}

RMGamemode. prototype =
{
    init:function()
    {

    },

    uiInput:function()
    {

    },

    update:function(inTicks)
    {

    },

    draw:function()
    {

    },

    exit:function()
    {

    }
};

//gamestate = new RMGamestate();
