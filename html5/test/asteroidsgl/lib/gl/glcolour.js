class GLColour
{
    constructor(r,g,b,a)
    {
        this.r = 1;
        this.g = 1;
        this.b = 1;
        this.a = 1;
        
        if(r != undefined)
        {
            this.r = r;
        }
    
        if(g != undefined)
        {
            this.g = g;
        }
    
        if(b != undefined)
        {
            this.b = b;
        }
    
        if(a != undefined)
        {
            this.a = a;
        }
    }
}