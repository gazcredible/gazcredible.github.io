class baseCanvas
{
    constructor()
    {
    }

    Line(start,end,inColour,inWidth)
    {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        if(inWidth == undefined)
        {
            ctx.lineWidth = 1;
        }
        else
        {
            ctx.lineWidth = inWidth;
        }
        ctx.strokeStyle = inColour;
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(end.x,end.y);
        ctx.stroke();
    }

    Text(inSize,inString,inPos,inColour,inJustification,font,style)
    {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        if(font == undefined)
        {
            ctx.font = inSize +"px san-serif";
        }
        else
        {
            if(style == undefined)
            {
                ctx.font = inSize + "px " + font;//Archivo Black";
            }
            else
            {
                ctx.font = style + " " + inSize + "px " + font;
            }
        }
        ctx.textAlign = inJustification;
        ctx.fillStyle = inColour;

        if(inJustification == 'center')
        {
            ctx.fillText(inString,inPos.x,inPos.y+(inSize/4));
        }
        else
        {
            ctx.fillText(inString,inPos.x,inPos.y);
        }
    }

    Rect(inRect,inColour)
    {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = inColour;

        ctx.fillRect(inRect.x, inRect.y, inRect.w, inRect.h);
    }
    
    Sprite(image,inRect,uvRect)
    {
        if((image != null) && (image.width >0))
        {
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            
            if(uvRect == undefined)
            {
                ctx.drawImage(image
                    ,Math.floor(inRect.x)
                    ,Math.floor(inRect.y)
                    ,Math.floor(inRect.w)
                    ,Math.floor(inRect.h) );
            }
            else
            {
                try
                {
                    ctx.drawImage(inName
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
        else
        {
            if(false)
            {
                this.Rect(inRect, '#ff0000');
            }
        }
    }
}

Canvas = new baseCanvas();