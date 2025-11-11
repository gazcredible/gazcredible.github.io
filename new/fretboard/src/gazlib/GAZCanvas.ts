import {Size, Rect, Vector2} from "./maths.ts";

export class Canvas
{
    constructor()
    {
    }

    // ctx() - return the 2D canvas context
    ctx()
    {
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        return canvas.getContext("2d");
    }

    /*
        Line(vector2 start, vector2 end, string inColour, float inWidth)

        This will draw a line between start and end

        inWidth is optional
     */
    Line(start,end,inColour,inWidth)
    {
        this.ctx().beginPath();
        if(inWidth == undefined)
        {
            this.ctx().lineWidth = 1;
        }
        else
        {
            this.ctx().lineWidth = inWidth;
        }
        this.ctx().strokeStyle = inColour;
        this.ctx().moveTo(start.x,start.y);
        this.ctx().lineTo(end.x,end.y);
        this.ctx().stroke();
    }

    /*
        Text(float inSize,string inString, vector2 inPos, string inColour, string inJustification,string font)

        This will draw text in the canvas, see:
            https://www.w3schools.com/tags/canvas_filltext.asp
            https://www.w3schools.com/tags/canvas_textalign.asp

            inJustification - 'start', 'left', 'centre', 'end', 'right'
     */
    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        if(font == undefined)
        {
            this.ctx().font = inSize +"px san-serif";
        }
        else
        {
            this.ctx().font = inSize +"px "+font;//Archivo Black";
        }
        this.ctx().textAlign = inJustification;
        this.ctx().fillStyle = inColour;

        if(inJustification == 'center')
        {
            this.ctx().fillText(inString,inPos.x,inPos.y+(inSize/4));
        }
        else
        {
            this.ctx().fillText(inString,inPos.x,inPos.y);
        }
    }

    /*
        Rect(Rect inRect,string inColour, bool inFilled, float inWidth)

        Draw Rectangle
            inRect      - containing rectangle (see rect.js)
            inColour    - RGB colour as string
            inFilled    - optional bool, whether rectangle is filled our outline only
            inWidth     - optional float, thickness of outline
        see:
            https://www.w3schools.com/tags/canvas_fillrect.asp
            https://www.w3schools.com/tags/canvas_strokerect.asp
     */
    Rect(inRect,inColour, inFilled?,inWidth?)
    {
        if(inWidth !== undefined)
        {
            this.ctx().lineWidth = inWidth;
        }
        else
        {
            this.ctx().lineWidth = 1;
        }

        if((inFilled === undefined) || (inFilled === true))
        {
            this.ctx().fillStyle = inColour;

            this.ctx().fillRect(inRect.x, inRect.y, inRect.w, inRect.h);
        }
        else
        {
            this.ctx().strokeStyle = inColour;
            this.ctx().strokeRect(inRect.x, inRect.y, inRect.w, inRect.h);
        }
    }

    /*
        Sprite(image,inRect,uvRect)

        Draw rectangle with texture (or texture region)
            image   - Image() object
            inRect  - containing rectangle (see rect.js)
            uVRect  - (optional) texture co-ordinates in pixels
                      if ommitted, full image will be drawn
        see:
            https://www.w3schools.com/tags/canvas_drawimage.asp
     */
    Sprite(image,inRect,uvRect)
    {
        if((image != null) && (image.width >0))
        {
            if(uvRect == undefined)
            {
                this.ctx().drawImage(image
                    ,Math.floor(inRect.x)
                    ,Math.floor(inRect.y)
                    ,Math.floor(inRect.w)
                    ,Math.floor(inRect.h) );
            }
            else
            {
                try
                {
                    this.ctx().drawImage(image
                        ,uvRect.x,uvRect.y,uvRect.w,uvRect.h
                        ,inRect.x,inRect.y,inRect.w,inRect.h
                    );
                }
                catch(err)
                {
                    alert(err);
                }
            }
        }
    }
}


export class GAZCanvas extends Canvas
{
    currentScreenSize;
    referenceScreenSize;
    offset;
    targetSize;

    canvas;

    constructor()
    {
        super();
        
        this.currentScreenSize = new Size();
        this.referenceScreenSize = new Size();
        this.offset = new Size(0,0);
        this.targetSize = new Size(0,0);
    }

    update(offset = 0)
    {
        this.currentScreenSize = new Size(window.innerWidth, window.innerHeight-offset);

        this.ctx().canvas.width  = this.currentScreenSize.w;
        this.ctx().canvas.height = this.currentScreenSize.h;

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
        let drawRect = new Rect();
        drawRect.x = ((inRect.x / this.referenceScreenSize.w) * this.targetSize.w) + this.offset.x/2;
        drawRect.y = ((inRect.y / this.referenceScreenSize.h) * this.targetSize.h) + this.offset.y/2;
        drawRect.w = (inRect.w / this.referenceScreenSize.w) * this.targetSize.w;
        drawRect.h = (inRect.h / this.referenceScreenSize.h) * this.targetSize.h;

        return drawRect;
    }

    /*
        Line(vector2 start, vector2 end, string inColour, float inWidth)

        This will draw a line between start and end

        inWidth is optional
     */

    Line(start,end,inColour, inWidth)
    {
        let r = new Rect();


        r.set(start.x,start.y,0,0);
        r = this.toScreenSpace(r);

        let v0 = new Vector2(r.x,r.y);


        r.set(end.x,end.y,inWidth,inWidth);
        r = this.toScreenSpace(r);

        let width = Math.min(r.w,r.h);

        let v1 = new Vector2(r.x,r.y);

        super.Line(v0,v1,inColour, width);
    }

    /*
        Text(float inSize,string inString, vector2 inPos, string inColour, string inJustification,string font)

        This will draw text

            inJustification - 'start', 'left', 'centre', 'end', 'right'
     */
    Text(inSize,inString,inPos,inColour,inJustification,font?)
    {
        let r = new Rect();

        r.set(inPos.x,inPos.y,inSize,inSize);
        r = this.toScreenSpace(r);

        super.Text(r.h, inString, new Vector2(r.x,r.y),inColour,inJustification,font);
    }

    /*
        Rect(Rect inRect,string inColour, bool inFilled, float inWidth)

        Draw Rectangle
            inRect      - containing rectangle (see rect.js)
            inColour    - RGB colour as string
            inFilled    - optional bool, whether rectangle is filled our outline only
            inWidth     - optional float, thickness of outline
     */

    Rect(inRect,inColour, inFilled?,inWidth?)
    {
        super.Rect(this.toScreenSpace(inRect), inColour,inFilled,inWidth);
    }

    /*
        Sprite(image,inRect,uvRect)

        Draw rectangle with texture (or texture region)
            image   - Image() object
            inRect  - containing rectangle (see rect.js)
            uVRect  - (optional) texture co-ordinates in pixels
                      if ommitted, full image will be drawn
     */
    Sprite(image,inRect,uvRect)
    {
        let rect = this.toScreenSpace(inRect);
        super.Sprite(image,rect,uvRect);
    }

    /*
        drawLetterbox(oolour)

        Draw a letterbox on canvas
            colour    - RGB colour as string
     */
    drawLetterbox(colour)
    {
        let rect = this.toScreenSpace(new Rect(0,0,this.referenceScreenSize.w,this.referenceScreenSize.h));

        if(rect.x > 0)
        {
            //left + right letterbox

            super.Rect(new Rect(0,0,rect.x,rect.h),colour);
            super.Rect(new Rect(rect.x+rect.w,0,this.currentScreenSize.w-(rect.x+rect.w),rect.h),colour);

        }
        //else
        {
            //top + bottom
            super.Rect(new Rect(0,0,rect.w,rect.y),colour);
            super.Rect(new Rect(0,rect.h+(this.offset.y/2),rect.w,this.currentScreenSize.h - rect.h+(this.offset.y/2)),colour);
        }
    }
}
