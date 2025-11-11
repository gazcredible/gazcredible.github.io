class BitmapFont
{
    constructor(bitmapfile)
    {
        this.image = new Image();
        this.image.src = bitmapfile;
        this.scaleFactor = 1.0
    }

    setScale(factor)
    {
        this.scaleFactor = factor;
    }

    measureString(stringToPrint,size)
    {
        size.x = 0;
        size.y = 8 *this.scaleFactor;

        for(let i = 0; i < stringToPrint.length;i++)
        {
            switch(stringToPrint[i])
            {
                case ' ':
                size.x += 8 * this.scaleFactor;
                break;

                case '\n':
                return;

                default:
                    size.x +=8 * this.scaleFactor;
                break;
            }
        }
    }

    applyJustificationOffset(just, size, Offset)
    {
        switch(just)
        {
            case 'left':
                Offset.x = 0;
                Offset.y = 0;
                break;
            case 'right':
                Offset.x -= size.x;
                break;

            case 'centre':
                Offset.x -= size.x/2;
                break;

            case 'centreXY':
                Offset.x -= size.x/2;
                Offset.y -= size.y/2;
                break;
            default:
                Offset.x = 0;
                Offset.y = 0;
                break;
        }
    }


    print(position, text,justify)
    {
        var offset = new Vector2();
        var size = new Vector2();
        var i=0;

        this.measureString(text,size);
        this.applyJustificationOffset(justify,size,offset);

        Canvas.ctx().imageSmoothingEnabled = false;

        for(let ch = 0; ch < text.length;ch++)
        {
            switch(text[ch])
            {
                case ' ':
                    offset.x += 8 * this.scaleFactor;
                    break;

                case '\n':
                {
                    offset.x = 0;
                    position.y+= 10  * this.scaleFactor;

                    this.measureString(text.substring(ch+1),size);
                    this.applyJustificationOffset(justify,size,offset);
                }
                    break;


                default:
                    let charIndex = text.charCodeAt(ch);

                    GAZCanvas.Sprite(this.image
                        ,new Rect(position.x+offset.x,position.y+offset.y, 8*this.scaleFactor, 8*this.scaleFactor)
                        ,new Rect(Math.floor(charIndex % 16)*8, Math.floor(charIndex / 16)*8, 8,7.5)
                    );

                    offset.x +=8 * this.scaleFactor;
                    break;
            }
        }

        Canvas.ctx().imageSmoothingEnabled = true;
    }
}

debugFont = new BitmapFont("data/font.png")