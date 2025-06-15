class baseCanvas
{
    constructor()
    {
    }

    Line(start,end,inColour,inWidth)
    {
        var canvas = document.getElementById("canvas");
        return;
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

    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        if(ctx != undefined)
        {
            if (font == undefined)
            {
                ctx.font = inSize + "px san-serif";
            }
            else
                {
                ctx.font = inSize + "px " + font;//Archivo Black";
            }
            ctx.textAlign = inJustification;
            ctx.fillStyle = inColour;

            if (inJustification == 'center')
            {
                ctx.fillText(inString, inPos.x, inPos.y + (inSize / 4));
            }
            else {
                ctx.fillText(inString, inPos.x, inPos.y);
            }
        }
    }

    Rect(inRect,inColour)
    {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        if(ctx != undefined)
        {
            ctx.fillStyle = inColour;
            ctx.fillRect(inRect.x, inRect.y, inRect.w, inRect.h);
        }
    }
}

Canvas = new baseCanvas();