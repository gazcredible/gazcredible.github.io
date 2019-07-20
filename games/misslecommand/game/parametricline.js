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
        x0 = start.x;
        y0 = start.y;
        
        x1 = end.x;
        y1 = end.y;
    }

    getIntercept(line, intercept)
    {
        intercept = new Vector2(0, 0);
        
        var a = x0;
        var c = x1 - x0;
        var d = line.x0;
        var f = line.x1 - line.x0;
        var g = y0;
        var h = y1 - y0;
        var i = line.y0;
        var j = line.y1 - line.y0;
        var k = ((j * c) - (f * h));
        
        if(Math.Abs(k) < 0.001)	return false;
        
        var t = ((j * (d - a)) + (f * (g - i))) / k;
        
        if (t > 1 || t < 0) return false;
        
        intercept.x = x0 + t * (x1 - x0);
        intercept.y = y0 + t * (y1 - y0);
        
        if (Math.Abs(line.x1 - line.x0) > 0)
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