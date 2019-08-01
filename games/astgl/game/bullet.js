class Bullet extends BaseObject
{
    constructor()
    {
        super();
    }
    
    init(position, direction)
    {
        this.position.set(position);
        this.active = true;
        
        var m = Matrix.CreateRotationZ(direction);
        this.velocity = m.TransformVector2(new Vector2(0,7));
        
        this.collider.set(this.position,3)
    }
    
    update()
    {
        if(this.active == false)
        {
            return;
        }
        
        if( ((this.position.x + this.velocity.x) < 0)
            ||((this.position.x + this.velocity.x) > 1600)
        )
        {
            this.active = false;
            return;
        }
        
        if( ((this.position.y + this.velocity.y) < 0)
            ||((this.position.y + this.velocity.y) > 900)
        )
        {
            this.active = false;
            return;
        }
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        super.update();
    }
    
    draw()
    {
        if(this.active == false)
        {
            return;
        }
        //GAZCanvas.Rect(new Rect(this.position.x-2,this.position.y-2,4,4),'#ffffff');
        var col = new GLColour(1,1,1,1);
        glDebugRenderer.addRect(this.position.x-2,this.position.y-2,4,4, col);
        super.draw();
    }
}
