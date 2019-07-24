class ParametricLine
{
    constructor()
    {
        this.x0=0;
        this.x1=0;
        this.y0=0;
        this.y1=0;
    }
    
    init(start, end)
    {
        this.x0 = start.x;
        this.y0 = start.y;

        this.x1 = end.x;
        this.y1 = end.y;
    }

    getIntercept(line, intercept)
    {
        if ((line.x0 < Math.min(this.x0,this.x1)) && (line.x1 < Math.min(this.x0,this.x1))) return false;
        if ((line.x0 > Math.max(this.x0, this.x1)) && (line.x1 > Math.max(this.x0, this.x1))) return false;

        if ((line.y0 < Math.min(this.y0, this.y1)) && (line.y1 < Math.min(this.y0, this.y1))) return false;
        if ((line.y0 > Math.max(this.y0, this.y1)) && (line.y1 > Math.max(this.y0, this.y1))) return false;

        intercept.x = 0;
        intercept.y = 0;

        var a = this.x0;
        var c = this.x1 - this.x0;
        var d = line.x0;
        var f = line.x1 - line.x0;
        var g = this.y0;
        var h = this.y1 - this.y0;
        var i = line.y0;
        var j = line.y1 - line.y0;
        var k = ((j * c) - (f * h));
        
        if(Math.abs(k) < 0.001)	return false;
        
        var t = ((j * (d - a)) + (f * (g - i))) / k;
        
        if (t > 1 || t < 0) return false;
        
        intercept.x = this.x0 + t * (this.x1 - this.x0);
        intercept.y = this.y0 + t * (this.y1 - this.y0);
        
        if (Math.abs(line.x1 - line.x0) > 0)
        {
            t = (intercept.x - line.x0) / (line.x1 - line.x0);
        }
        else
        {
            t = (intercept.y - line.y0) / (line.y1 - line.y0);
        }
        
        if (t > 1 || t < 0) return false;
        
        return true;
    }
};