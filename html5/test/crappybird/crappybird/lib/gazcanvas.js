class gazcanvas
{
    constructor()
    {
        this.currentScreenSize = new Size();
        this.referenceScreenSize = new Size();
        this.offset = new Size(0,0);
        this.targetSize = new Size(0,0);
    }

    update()
    {
        this.currentScreenSize = new Size(window.innerWidth, window.innerHeight);
    
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
    
        ctx.canvas.width  = this.currentScreenSize.w;
        ctx.canvas.height = this.currentScreenSize.h;
    
        this.targetSize = new Size(0,0);
    
        this.targetSize.h = this.currentScreenSize.h;
        this.targetSize.w = (this.targetSize.h * this.referenceScreenSize.w / this.referenceScreenSize.h);
    
        if(this.targetSize.w > this.currentScreenSize.w)
        {
            this.targetSize.w = this.currentScreenSize.w;
            this.targetSize.h = (this.targetSize.w*this.referenceScreenSize.h) / this.referenceScreenSize.w;
        }
        
        this.offset.x = this.currentScreenSize.w - this.targetSize.w;
        this.offset.y = this.currentScreenSize.h - this.targetSize.h;
    }

    toScreenSpace(inRect)
    {
        var drawRect = new Rect();
        drawRect.x = ((inRect.x / this.referenceScreenSize.w) * this.targetSize.w) + this.offset.x/2;
        drawRect.y = ((inRect.y / this.referenceScreenSize.h) * this.targetSize.h) + this.offset.y/2;
        drawRect.w = (inRect.w / this.referenceScreenSize.w) * this.targetSize.w;
        drawRect.h = (inRect.h / this.referenceScreenSize.h) * this.targetSize.h;

        return drawRect;
    }
    
    Line(start,end,inColour, inWidth)
    {
        var r = new Rect();
        
    
        r.set(start.x,start.y,0,0);
        r = this.toScreenSpace(r);
        
        var v0 = new Vector2(r.x,r.y);
        
    
        r.set(end.x,end.y,inWidth,inWidth);
        r = this.toScreenSpace(r);
        
        var width = Math.min(r.w,r.h);
    
        var v1 = new Vector2(r.x,r.y);
        
        Canvas.Line(v0,v1,inColour, width);
    }

    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        var r = new Rect();

        r.set(inPos.x,inPos.y,inSize,inSize);
        r = this.toScreenSpace(r);

        Canvas.Text(r.h, inString, new Vector2(r.x,r.y),inColour,inJustification,font);
    }

    Rect(inRect,inColour, inFilled,inWidth)
    {
        Canvas.Rect(this.toScreenSpace(inRect), inColour,inFilled,inWidth);
    }
    
    drawLetterbox(colour)
    {
        var rect = this.toScreenSpace(new Rect(0,0,this.referenceScreenSize.w,this.referenceScreenSize.h));
        
        if(rect.x > 0)
        {
            //left + right letterbox
            
            Canvas.Rect(new Rect(0,0,rect.x,rect.h),colour);
            Canvas.Rect(new Rect(rect.x+rect.w,0,this.currentScreenSize.w-(rect.x+rect.w),rect.h),colour);
            
        }
        //else
        {
            //top + bottom
            Canvas.Rect(new Rect(0,0,rect.w,rect.y),colour);
            Canvas.Rect(new Rect(0,rect.h+(this.offset.y/2),rect.w,this.currentScreenSize.h - rect.h+(this.offset.y/2)),colour);
        }
    }
    
    Sprite(image,inRect,uvRect)
    {
        var rect = this.toScreenSpace(inRect);
        Canvas.Sprite(image,rect,uvRect);
    }
}

GAZCanvas = new gazcanvas();

