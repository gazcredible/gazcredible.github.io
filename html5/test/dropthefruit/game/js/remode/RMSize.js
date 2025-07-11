var RMSize	=	function(inW,inH)
{
    if(inW != undefined)
    {
        this.w = inW;
        this.h = inH;
    }
    else
    {
        this.w = this.h = 0;
    }
}


RMSize.prototype	={
    clone:function(){
        return new RMSize(this.w,this.h);
    },

    toString:function()
    {
        return ""+this.w+ ":" + this.h;
    }


};