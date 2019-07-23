class GameObject extends ColliderBase
{
    constructor()
    {
        super();
        this.active = false;
        this.velocity = new Vector2();
    }
    
    /*
        empty functions for derived classes to implement.
        I could add throw 'Undefined function' as the implementation for these functions if I wanted
        to ensure that they would have real implementations in the derived classes
     */
    init()
    {
    
    }
    
    update()
    {
    }
    
    draw()
    {
    
    }
    
}