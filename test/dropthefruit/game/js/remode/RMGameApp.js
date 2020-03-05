var gGameModel = null;

function IsAttributeSupported(tagName, attrName)
{
    var val = false;
    // Create element
    var input = document.createElement(tagName);
    // Check if attribute (attrName)
    // attribute exists
    if (attrName in input)
    {
        val = true;
    }
    // Delete "input" variable to
    // clear up its resources
    delete input;
    // Return detected value
    return val;
}


function createGameApp(inID){

    if (!IsAttributeSupported("input", "placeholder"))
    {
        // Do something special here
        location.href = 'fail.html';

        return;
    }

    gGameApp = new RMGameApp(inID);
}

var RMGameApp = function(inID)
{
    this.mID		=		inID;

    this.mWidth =  window.innerWidth;
    this.mHeight = window.innerHeight;

    this.mCanvas		=		new RMCanvas(this);
    this.mCanvas.setCurrentResolution(window.innerWidth,window.innerHeight);
    this.mResizeTimer	=		null;

    this.frameCount = 1;

    if(window.addEventListener)
    {
        var self =this;

        window.addEventListener('resize',function() {self.startResizeEvent(); });
    }
    else
    {
        window.resize		=		startResizeEvent;
    }

    this.mTimer	= new RMGameTimer();
    this.mTimer.eUpdate.attach(this.draw,this);
    this.mTimer.start();

    document.width		=	"100%";
    document.height		=	"100%";

    this.init();
}

RMGameApp.prototype	=
{
    startResizeEvent:function(evt)
    {
        var self		=		this;
        //console.log("Starting Resize");
//        this.clearResizeTimer();

        this.mResizeTimer		=		setTimeout(function(){self .doResizeEvent(); }, 50);

    },

    showAlert:function(inMessage,inStyle)
    {
        if(this.mAlert) return;
        this.mAlert		=		new RMGameAlert(inMessage,inStyle);
    },

    doResizeEvent:function()
    {
        var thisWidth;
        var thisHeight;

        thisWidth	=		window.innerWidth;
        thisHeight	=		window.innerHeight;

        document.width		=		String(thisWidth) + "px";
        document.height		=		String(thisHeight) + "px";

        this.setAppSize(thisWidth,thisHeight);
    },

    setAppSize:function(inWidth,inHeight)
    {
        if((inWidth == this.mWidth) && (inHeight == this.mHeight)) return;

        this.mCanvas.setSize(this.mWidth,this.mHeight);
        this.mCanvas.setCurrentResolution(inWidth,inHeight);
    },


    //
    //
    //  Our code!
    //
    //

	init:function()
	{
        gGame.oneTimeInit();
	},


    draw:function(inArgs)
    {
        gGame.runGame();
    }
}