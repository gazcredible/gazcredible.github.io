class Random
{
    constructor(value)
    {
       this.seed = 0;
       this.currentValue = 0;

        this.init(value);
    }
    
    init(value)
    {
        this.seed = value;
        this.currentValue = this.seed;
    }
    
    next()
    {
        this.currentValue += this.seed;
        this.currentValue ^= 353562;
        
        return this.currentValue;
    }
    
    reset()
    {
        this.currentValue = this.seed;
    }
    
    getInt(min, max)
    {
        if (min == max) return min;
        
        var val = this.next() % 10000;
    
        return Math.floor(((val / 10000.0) * (max - min)) + min);
    }
    
    getFloat(min, max)
    {
        if (min == max) return min;
        
        var val = this.next() % 10000;
        
        return (((val / 10000.0) * (max - min)) + min);
    }
}