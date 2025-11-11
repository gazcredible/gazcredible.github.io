class CircularCollider
{
    constructor()
    {
        this.position = new Vector2();
        this.radius = 0;
    }
    
    set(position, radius)
    {
        this.position.set(position);
        this.radius = radius;
    }
    
    setPosition(position)
    {
        this.position.set(position);
    }
    
    collides(collider)
    {
        return this.position.distance(collider.position) < (this.radius+collider.radius);
    }
}