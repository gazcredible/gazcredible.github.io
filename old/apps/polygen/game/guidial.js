/*
    GUIDial -   The round dial controls
    
    This class uses Canvas arcs to create circle segments for drawing dials.
    Again, like the guibuttontext class, it has references to drummachineinst, but these could be removed. Also, it could
    use function callbacks for its text printing (as mentioned in drummachine.js) to make it more re-usable
 */
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
        
        if(inRange!==undefined)
        {
            this.range = inRange;
        }

        this.text = undefined;
    }
    
    update()
    {
        let rect = GAZCanvas.toScreenSpace(new Rect(this.centre.x, this.centre.y, this.radius, this.radius));

        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(rect.x, rect.y, rect.w, 0, 2 * Math.PI);
        ctx.lineTo(rect.x, rect.y);
        ctx.fillStyle = drummachineInst.itemDarkBGCol;
        ctx.closePath();
        ctx.fill();

        let start = 2 * Math.PI * 0.3;
        let end = start + (2 * Math.PI * 0.9);

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

        if(this.text !== undefined)
        {
            GAZCanvas.Text(rect.w / 2, this.text, this.centre, '#000000', 'center', drummachineInst.textStyle);
        }
        else
        {
            GAZCanvas.Text(rect.w / 2, this.value.toFixed(2), this.centre, '#000000', 'center', drummachineInst.textStyle);
        }
        
        if (Input.mouseLogicalPos !== undefined)
        {
            if (Input.currentMouseState === INPUT_PRESSED)
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
                    if (Input.currentMouseState === INPUT_HELD)
                    {
                        //held
                        let rect = GAZCanvas.toScreenSpace(new Rect(0,0,this.range,this.range));
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
    
                    if (Input.currentMouseState === INPUT_NOT_PRESSED)
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