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
            
            if (Input.currentMouseState == 'pressed')
            {
                this.actionCallback(this);
            }
        }
        super.update();

        GAZCanvas.Text(32,this.label, this.rect.getCentre(),'#000000','center',drummachineInst.textStyle);
    }
}