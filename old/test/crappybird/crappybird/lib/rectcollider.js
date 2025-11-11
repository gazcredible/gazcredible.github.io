class RectCollider extends Rect
{
    constructor()
    {
        super();
    }
    
    setPosition(position)
    {
        this.x = position.x;
        this.y = position.y;
    }
    
    collides(collider)
    {
        if (this.x >= (collider.x + collider.w)) return false;
        if (this.y >= (collider.y + collider.h)) return false;
        if ((this.x + this.w) <= collider.x) return false;
        if ((this.y + this.h) <= collider.y) return false;
    
        return true;
    }
}