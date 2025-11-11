var RMBitmapFont = function(inBitmapName)
{
    this.image = new Image();
    this.image.src = inBitmapName;
}

RMBitmapFont.prototype.Text = function(inSize,inString,inPos,inColour,inAlign)
{
    var rect = new RMRect(inPos.x,inPos.y,16*2,16*2);
    var uvRect = new RMRect(0,0,16,16);
    for(var i =0;i<inString.length;i++)
    {
        var id = inString.charCodeAt(i);

        uvRect.x = (id%16)*16;
        uvRect.y = (Math.floor(id/16))*16;
        gCanvas.sprite(this.image,rect,uvRect);

        rect.x +=16*2;
    }
};