var RMTextPrinter = function()
{
    this.referenceText ="";
    this.position = new RMVector2();
    this.tick = 0;
    this.tickInterval = 3;

    this.bitmapFont = new RMBitmapFont('game/data/fonts/font.bmp');
}

RMTextPrinter.prototype.init=function()
{
    this.tick = 0;
};

RMTextPrinter.prototype.update=function()
{
    this.tick++;
};

RMTextPrinter.prototype.isPrintingComplete=function()
{
    var charsToPrint = this.tick/this.tickInterval;
    return (charsToPrint > this.referenceText.length);
};

RMTextPrinter.prototype.setPrintingComplete=function()
{
    this.tick = this.tickInterval * this.referenceText.length;
};

RMTextPrinter.prototype.draw=function(inOffset)
{
    if(inOffset == undefined)
    {
        inOffset = new RMVector2();
    }

    var charsToPrint = this.tick/this.tickInterval;
    if(charsToPrint > this.referenceText.length)
    {
        charsToPrint = this.referenceText.length;
    }

    var currentPosition = this.position.clone();
    currentPosition.x += inOffset.x;
    currentPosition.y += inOffset.y;

    var currentString = "";
    for(var i=0;i<charsToPrint;i++)
    {
        var ch = this.referenceText[i];

        if(ch != "\n")
        {
            currentString += ch;
        }
        else
        {
            gCanvas.GLText(20,currentString ,currentPosition,'#ffffff','left');
            //this.bitmapFont.Text(20,currentString ,currentPosition,'#ffffff','left');
            currentPosition.y += 20*1.3;
            currentString = "";
        }
    }

    if(currentString.length > 0)
    {
        gCanvas.GLText(20,currentString ,currentPosition,'#ffffff','left');
        //this.bitmapFont.Text(20,currentString ,currentPosition,'#ffffff','left');
    }
};