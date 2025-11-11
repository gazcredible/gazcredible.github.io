class BaseObject
{
    constructor()
    {
        this.active = false;
        this.position = new Vector2();
        this.velocity = new Vector2();
        this.collider = new CircularCollider();
    }
    
    init()
    {
    
    }
    
    update()
    {
        this.collider.setPosition(this.position);
    }
    
    draw()
    {
    
    }
    
    getLineList()
    {
    
    }
}
