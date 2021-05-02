var RMCollider = function()
{
    this.position = new RMVector2();
    this.colour = '#ffffff';
}

RMCollider. prototype =
{
    setPosition:function(inPos)
    {
        this.position.x = inPos.x;
        this.position.y = inPos.y;
    },

    collidesWith:function(inCollider)
    {
        return false;
    },

    update:function()
    {

    },

    draw:function()
    {

    }
}

//============================================================================================
var RMCircluarCollider = function()
{
    this.colour = '#ffffff';
    this.radius = 8;
};

RMCircluarCollider.prototype = new RMCollider();
RMCircluarCollider.prototype.constructor = RMCircluarCollider;

RMCircluarCollider.prototype.init = function(inPos,inRad)
{
    this.position = inPos.clone();
    this.radius = inRad;
};

RMCircluarCollider.prototype.draw = function()
{
    gCanvas.GLStrokeCircle(this.position,this.radius,this.colour);
};

RMCircluarCollider.prototype.vsPoint = function(inPoint)
{
    var tmp = this.position.clone();
    tmp.x -= inPoint.x;
    tmp.y -= inPoint.y;
    return (tmp.length() < this.radius);
};


//============================================================================================
var RMLineCollider = function()
{
    this.colour = '#ffffff';
    this.start = new RMVector2();
    this.end = new RMVector2();

    this.grad=null;
    this.invGrad=null;
    this.midPoint = new RMVector2();
};

RMLineCollider.prototype = new RMCollider();
RMLineCollider.prototype.constructor = RMLineCollider;

RMLineCollider.prototype.init = function(inStart,inEnd)
{
    this.start = inStart.clone();
    this.end = inEnd.clone();

    this.midPoint = new RMVector2();
    this.midPoint.x = this.start.x + (this.end.x-this.start.x)/2;
    this.midPoint.y = this.start.y + (this.end.y-this.start.y)/2;

    grad = new RMVector2();
    grad.x = this.end.x-this.start.x;
    grad.y = this.end.y-this.start.y;

    if(Math.abs(grad.y) > 0)
    {
        this.invGrad = grad.clone();
        this.invGrad.x = -grad.y;
        this.invGrad.y = grad.x;

        this.invGrad.normalise();
    }
    else
    {
        this.invGrad = null;
    }
};

RMLineCollider.prototype.draw = function()
{
    gCanvas.GLLine(this.start.x,this.start.y
                  ,this.end.x,this.end.y
                  ,this.colour);

    var grad = new RMVector2();
    grad.x = this.end.x-this.start.x;
    grad.y = this.end.y-this.start.y;

    if(this.invGrad != null)
    {
        var temp = this.invGrad.clone();
        temp.x *= 20;
        temp.y *= 20;

        temp.x += this.midPoint.x;
        temp.y += this.midPoint.y;

        gCanvas.GLLine(this.midPoint.x,this.midPoint.y
            ,temp.x,temp.y
            ,this.colour);
    }
};

RMLineCollider.prototype.vsLineCollider = function(line)
{
    var intercept = new RMVector2();

    var a = this.start.x;
    var c = this.end.x - this.start.x;
    var d = line.start.x;
    var f = line.end.x - line.start.x;
    var g = this.start.y;
    var h = this.end.y - this.start.y;
    var i = line.start.y;
    var j = line.end.y - line.start.y;

    if (((j * c) - (f * h)) == 0)
    {
        return null;
    }

    var t = ((j * (d - a)) + (f * (g - i))) / ((j * c) - (f * h));

    if (t > 1 || t < 0) return null;

    intercept.x = this.start.x + t * (this.end.x - this.start.x);
    intercept.y = this.start.y + t * (this.end.y - this.start.y);

    if (Math.abs(line.end.x - line.start.x) > 0)
    {
        t = (intercept.x - line.start.x) / (line.end.x - line.start.x);
    }
    else
    {
        t = (intercept.y - line.start.y) / (line.end.y - line.start.y);
    }

    if (t > 1 || t < 0) return null;

    return intercept;
};

