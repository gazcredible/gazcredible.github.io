var TransferFunction = function()
{

};

TransferFunction.prototype.get = function(inParam)
{
    return -1;
};

TransferFunction.prototype.draw=function(inRect,inColour)
{
    for(var i=0;i<inRect.w;i++)
    {
        var val = this.get(i/inRect.w);

        gCanvas.GLLine(inRect.x+i,inRect.y+inRect.h
                      ,inRect.x+i
                      ,inRect.y + inRect.h - (val*inRect.h)
                      , inColour);
    }
};


var SinTransferFunction = function()
{
    this.scale = 1;
};

SinTransferFunction.prototype = new TransferFunction();
SinTransferFunction.prototype.constructor = SinTransferFunction;


SinTransferFunction.prototype.get = function(inParam)
{
    var v = this.scale*(inParam - Math.floor(inParam));

    return Math.sin( v * (2*Math.PI));
};

var RampDownTransferFunction = function()
{
    this.maxRange = 1.0;
    this.minValue = 0.001;

};

RampDownTransferFunction.prototype = new TransferFunction();
RampDownTransferFunction.prototype.constructor = RampDownTransferFunction;


RampDownTransferFunction.prototype.get = function(inParam)
{
    var v = 1*(inParam - Math.floor(inParam));

    if(v > this.maxRange) return this.minValue;

    return 1-(v/this.maxRange);
};


var PowerCos = function()
{
    this.power = 1;
    this.minValue = 0.001;
};

PowerCos.prototype = new TransferFunction();
PowerCos.prototype.constructor = PowerCos;


PowerCos.prototype.get = function(inParam)
{
    var v = (inParam - Math.floor(inParam));

    return Math.max(this.minValue,Math.pow(Math.cos( (v) * (Math.PI/2)),this.power));
};
