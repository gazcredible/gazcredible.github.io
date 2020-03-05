class ButtonBase
{
    constructor()
    {
        this.active = false;
        this.selected = false
    }

    label()
    {
        return "add label";
    }
    
    isInRect(pos)
    {
        if(this.active == false)
        {
            return false;
        }
        return this.rect.isInMe(pos);
    }
    
    update()
    {
    
    }
    
    draw()
    {
        //var rect = toScreenSpace(this.rect);
        
        var fontSize = GAZCanvas.toScreenSpace(new Rect(0,0,24,24) ).h;
        
        if(this.active == false)
        {
            GAZCanvas.Rect(this.rect, 'rgb(255,127,127)') ;
        }
        else
        {
            if(this.selected == true)
            {
                GAZCanvas.Rect(this.rect, 'rgb(127,127,255)');
            }
            else
            {
                if (this.rect.isInMe(Input.mouseLogicalPos) == true)
                {
                    GAZCanvas.Rect(this.rect, 'rgb(0,255,255)');
                }
                else
                {
                    GAZCanvas.Rect(this.rect, 'rgb(0,255,0)');
                }
            }
        }
        
        
        var pos = this.rect.getCentre();
        
        GAZCanvas.Text(24,this.label(), pos,"#ffffff",'center','Noto Sans');
    }
}



//======================================================================================================================

class KeyButton extends ButtonBase
{
    constructor(label, rect)
    {
        super();
        
        this.labelText = label;
        this.rect = rect;
        
        this.active = true;
    }
    
    label()
    {
        return this.labelText;
    }
}

//======================================================================================================================

class ModeButton extends ButtonBase
{
    constructor(mode, rect)
    {
        super();
        
        this.mode = mode;
        this.rect = rect;
        
        this.active = true;
        this.selected = false;
    }
    
    label()
    {
        return this.mode.label;
    }
}
