/*
    base GUIButton
    
    This creates a rectangular box that can be used for point hit testing (isInRect)
 */

class GUIButton
{
    constructor(rect)
    {
        this.active = false;
        this.selected = false;

        this.rect = rect;
        this.bgColor = '#ffffff';
    }

    label()
    {
        return "";
    }

    isInRect(pos)
    {
        if (this.active === false)
        {
            return false;
        }
        return this.rect.isInMe(pos);
    }

    update()
    {
        GAZCanvas.Rect(this.rect, this.bgColor);
    }

    draw()
    {
    }
}
