class GUIDial
{
    constructor(inX,inY,inSize,inRange)
    {
        this.centre = new Vector2(inX,inY);
        this.radius = inSize;

        this.value = 0;
        this.isSelected = false;

        this.adjustStartY = 0;
        
        this.range = 200;
        
        if(inRange!=undefined)
        {
            this.range = inRange;
        }
    }
    
    update()
    {
        var rect = GAZCanvas.toScreenSpace(new Rect(this.centre.x, this.centre.y, this.radius, this.radius));

        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(rect.x, rect.y, rect.w, 0, 2 * Math.PI);
        ctx.lineTo(rect.x, rect.y);
        ctx.fillStyle = drummachineInst.itemDarkBGCol;
        ctx.closePath();
        ctx.fill();

        var start = 2 * Math.PI * 0.3;
        var end = start + (2 * Math.PI * 0.9);

        ctx.beginPath();
        ctx.arc(rect.x, rect.y, rect.w, start, end);
        ctx.lineTo(rect.x, rect.y);
        ctx.fillStyle = drummachineInst.itemBGCol;
        ctx.closePath();
        ctx.fill();

        end = start + (2 * Math.PI * 0.9) * this.value;

        ctx.beginPath();
        ctx.arc(rect.x, rect.y, rect.w, start, end);
        ctx.lineTo(rect.x, rect.y);
        ctx.fillStyle = drummachineInst.itemSelectCol;
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rect.x, rect.y, rect.w / 2, 0, 2 * Math.PI);
        ctx.lineTo(rect.x, rect.y);
        ctx.fillStyle = drummachineInst.itemDarkBGCol;
        ctx.closePath();
        ctx.fill();

        GAZCanvas.Text(rect.w / 2, this.value.toFixed(2), this.centre, '#000000', 'center',drummachineInst.textStyle);
        
        if (Input.mouseLogicalPos !== undefined)
        {
            if (Input.currentMouseState == INPUT_PRESSED)
            {
                if (this.centre.distance(Input.mouseLogicalPos) < this.radius)
                {
                    this.isSelected = true;
                    this.adjustStartY = Input.mouseLogicalPos.y;
                }
            }
            else
            {
                if (this.isSelected === true)
                {
                    if (Input.currentMouseState == INPUT_HELD)
                    {
                        //held
                        var rect = GAZCanvas.toScreenSpace(new Rect(0,0,this.range,this.range));
                        this.value += (this.adjustStartY - Input.mouseLogicalPos.y) / (rect.h);

                        if (this.value > 1)
                        {
                            this.value = 1;
                        }

                        if (this.value < 0)
                        {
                            this.value = 0;
                        }

                        this.adjustStartY = Input.mouseLogicalPos.y;
                    }
    
                    if (Input.currentMouseState == INPUT_NOT_PRESSED)
                    {
                        //released
                        this.isSelected = false;
                    }
                }
            }
        }
        else
        {
            this.isSelected = false;
        }
    }
}