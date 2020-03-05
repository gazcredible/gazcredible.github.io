
var RMMouseState	=	function(){

    this.currentPosition = new RMVector2(0,0);
    this.lastPosition = new RMVector2(0,0);
    this.delta = new RMVector2(0,0);

    this.state = "not pressed";

    this.rawState = false;
    this.rawPosition= new RMVector2(0,0);
    this.GLPosition = undefined;

    this.reset();
}


RMMouseState.prototype	={

    toString:function()
    {
        return ""+this.currentPosition.toString() + " " +this.lastPosition.toString()+ " " +  this.state +" "+ this.delta.toString();
    },

    setRawState:function(inVar)
    {
        this.rawState = inVar;
    },

    reset:function()
    {
        this.rawState = false;
        this.state = "not pressed";

        this.currentPosition = new RMVector2(0,0);
        this.lastPosition = new RMVector2(0,0);
        this.delta = new RMVector2(0,0);
    },

    update:function()
    {
        this.delta = new RMVector2(this.currentPosition.x - this.lastPosition.x
            ,this.currentPosition.y - this.lastPosition.y);

        if(this.delta.length() > 4 )
        {
            this.lastPosition = this.currentPosition.clone();
        }
        else
        {
            this.delta = new RMVector2(0,0);
        }

        this.currentPosition = this.rawPosition.clone();

        switch(this.state)
        {
            case "not pressed":
            {
                if(this.rawState == true)
                {
                    this.state = "pressed";
                }
            }
            break;

            case "pressed":
            {
                if(this.rawState == true)
                {
                    this.state = "held";
                }
                else
                {
                    this.state = "released";
                }
            }
            break;

            case "held":
            {
                if(this.rawState == false)
                {
                    this.state = "released";
                }
            }
            break;

            case "released":
            {
                if(this.rawState == true)
                {
                    this.state = "pressed";
                }
                else
                {
                    this.state = "not pressed";
                }
            }
            break;
        }

        this.updateScaledCoords();
    },

    draw:function(inCanvas, inSize)
    {
        inCanvas.mContext.fillStyle	= '#ffffff';
        inCanvas.mContext.fillRect(this.currentPosition.x-(inSize.w/2)
            ,this.currentPosition.y-(inSize.h/2)
            ,inSize.w,inSize.h);
    },

    setPosition:function(inX,inY)
    {
        this.rawPosition.x = inX;
        this.rawPosition.y = inY;
    },

    GLMousePos:function()
    {
        return this.GLPosition;
    },

    updateScaledCoords:function()
    {
        var screenRect = new RMRect();
        screenRect.set(0,0,gCanvas.GLreferenceScreen.w,gCanvas.GLreferenceScreen.h);
        screenRect = gCanvas.toScreenSpace(screenRect);

        var rawMousePos = new RMVector2(this.currentPosition.x,this.currentPosition.y);

        var rect = new RMRect();

        if(screenRect.isInMe(rawMousePos) == true)
        {
            // convert screen space to renderspace (1280x720)
            rawMousePos.x -= screenRect.x;
            rawMousePos.y -= screenRect.y;

            rawMousePos.x /= screenRect.w;
            rawMousePos.y /= screenRect.h;

            rawMousePos.x *= gCanvas.GLreferenceScreen.w;
            rawMousePos.y *= gCanvas.GLreferenceScreen.h;

            this.GLPosition = rawMousePos;
        }
        else
        {
            this.GLPosition = undefined;
        }
    }
};