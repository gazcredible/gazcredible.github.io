class GameObject
{
    constructor()
    {
        this.collider = 0;
        this.active = true;
        this.velocity = new Vector2();
        this.position = new Vector2();
        this.oldPosition = new Vector2();

        this.drawCollisions = false;
    }
    
    /*
        empty functions for derived classes to implement.
        I could add throw 'Undefined function' as the implementation for these functions if I wanted
        to ensure that they would have real implementations in the derived classes
     */
    onOneTimeInit()
    {
    
    }

    onLevelStart(active)
    {
        this.active = active;
    }

    onExplode()
    {
        this.active = false;
    }
    
    update()
    {
    }
    
    draw()
    {
        if((this.drawCollisions == true) && (this.collider != undefined))
        {
            this.collider.draw('#ffffff');
        }
    }
    
}