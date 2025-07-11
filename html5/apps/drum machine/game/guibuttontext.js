/*
    GUIButtonText
    
    This class extends the GUIButton and adds mouse based isInRect.
    This is closely tied to the app, given the reference to drummachineInst, though this could be removed as the class
    uses function callbacks for on pressed
 */

class GUIButtonText extends GUIButton
{
    constructor(rect,label, actionCallback)
    {
        super(rect);

        this.label = label;

        this.active = true;
        this.selected = false;

        this.actionCallback = actionCallback;
    }

    update()
    {
        this.bgColor = '#ffffff';
        if (this.isInRect(Input.mouseLogicalPos) === true)
        {
            this.bgColor = drummachineInst.itemSelectCol;
            
            if (Input.currentMouseState === 'pressed')
            {
                this.actionCallback(this);
            }
        }
        super.update();

        GAZCanvas.Text(32,this.label, this.rect.getCentre(),'#000000','center',drummachineInst.textStyle);
    }
}