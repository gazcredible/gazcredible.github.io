var myFunction = function()
{
    this.sinfn = new SinTransferFunction();
    this.rampfn = new RampDownTransferFunction();
};

myFunction.prototype = new TransferFunction();
myFunction.prototype.constructor = myFunction;


myFunction.prototype.get = function(inParam)
{
    var v = (inParam - Math.floor(inParam));

    var sinVal = Math.sin( (4*v) * (2*Math.PI));


    var rampVal = 1 - (v/0.8);

    if(v > 0.75) return 0.001;

    return sinVal * rampVal;
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


var TFDemo = function()
{

    this.sinFunction = new SinTransferFunction();
    this.sinFunction.scale = 1.25;

    this.rampDownFunction = new RampDownTransferFunction();
    this.rampDownFunction.maxRange = 0.75;

    this.transfer = new myFunction();
    this.transfer2 = new PowerCos();
    this.transfer2.power = 50;
    this.transfer2.minValue = 0.1;
};


TFDemo.prototype = new RMGamemode();
TFDemo.prototype.constructor = TFDemo;


TFDemo.prototype.init = function()
{
    gCanvas.setGLReferenceScreen(800,600);
};

TFDemo.prototype.update = function()
{
};


TFDemo.prototype.draw = function()
{
    this.sinFunction.draw(new RMRect(350,100,400,200),'#00ff00');
    this.rampDownFunction.draw(new RMRect(100,100,200,200),'#ff0000');


    this.transfer.draw(new RMRect(100,300,400,200),'#ffff00');

    this.transfer2.draw(new RMRect(800,200,400,100),'#ff00ff');
};

TFDemo.prototype.exit = function()
{

};