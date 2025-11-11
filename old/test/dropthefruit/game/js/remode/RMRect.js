var RMRect	=	function(inX,inY,inW,inH)
{
    if(inX == undefined)
    {
        this.x = 0;this.y=0;this.w=0;this.h=0;
    }
    else
    {
        this.x = inX;
        this.y = inY;
        this.w = inW;
        this.h = inH;
    }
}


RMRect.prototype	={
    clone:function(){
        return new RMRect(this.x,this.y,this.w,this.h);
    },

    toString:function()
    {
        return ""+this.x.toFixed(2)+ ":" + this.y.toFixed(2) +":" +this.w.toFixed(2) +":"+this.h.toFixed(2);
    },

    set:function(inX,inY,inW,inH)
    {
        this.x = inX;
        this.y = inY;
        this.w = inW;
        this.h = inH;
    },

    isInMe:function(inVal)
    {
        if(inVal != undefined)
        {
            if( (inVal.x >= this.x) && (inVal.x < (this.x + this.w))
                &&(inVal.y >= this.y) && (inVal.y < (this.y + this.h))
                )
            {
                return true;
            }
        }

        return false;
    },

    getCentre:function()
    {
        var centre = new RMVector2();

        centre.x = this.x + (this.w/2);
        centre.y = this.y + (this.h/2);

        return centre;
    },

    TL:function()
    {
        var pos = new RMVector2();

        pos.x = this.x;
        pos.y = this.y;

        return pos;
    },

    getPosition:function()
    {
      return new RMVector2(this.x,this.y);
    },

    isContainedBy:function(inRect)
    {
        return (  (this.x>= inRect.x)
               && ((this.x+this.w) <= (inRect.x+inRect.w))
               && (this.y>= inRect.y)
               && ((this.y+this.h) <= (inRect.y+inRect.h)));
    }

};


