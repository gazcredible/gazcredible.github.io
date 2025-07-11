class ExplosionPrim extends BaseObject
{
    constructor()
    {
        super();
        this.v0 = new Vector2();
        this.v1 = new Vector2();
        this.lifespan = 0;
        this.tick = 0;
    }
    
    init(centre, v0,v1)
    {
        this.v0 = v0;
        this.v1 = v1;
        
        
        this.position.x = this.v0.x +(this.v1.x - this.v0.x) / 2.0;
        this.position.y = this.v0.y +(this.v1.y - this.v0.y) / 2.0;
    
        this.v0.x -= this.position.x;
        this.v0.y -= this.position.y;
    
        this.v1.x -= this.position.x;
        this.v1.y -= this.position.y;
    
        this.velocity.x = this.position.x - centre.x;
        this.velocity.y = this.position.y - centre.y;
        this.velocity.normalize();
        
        var speed = 0.5 + Math.random()*2;
        this.velocity.x *= speed;
        this.velocity.y *= speed;
        
        this.lifespan = (3*60) +5*(Math.random()*60);
        this.tick = 0;
        this.active = true;
    
        this.rotation = 0;
        this.rotationStep = 5 + Math.random()*20;
        this.rotationStep = (this.rotationStep-12);
    }
    
    update()
    {
        if(this.active == false)    return;
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        this.tick++;
        
        this.active = this.tick < this.lifespan;
    
        if((this.position.x + this.velocity.x) < 0)
        {
            this.active = false;
        }
    
        if((this.position.x + this.velocity.x) > 1600)
        {
            this.active = false;
        }
    
        if((this.position.y + this.velocity.y) < 0)
        {
            this.active = false;
        }
    
        if((this.position.y + this.velocity.y) > 900)
        {
            this.active = false;
        }
        
        this.rotation += this.rotationStep;
    }
    
    draw()
    {
        var a = 1.0 - this.tick/this.lifespan;
    
        var canvas = document.getElementById("canvas");
        //var ctx = canvas.getContext("2d");
        //ctx.globalAlpha = a;
    
        var m = Matrix.Multiply( Matrix.CreateRotationZ((this.rotation*Math.PI)/180),Matrix.CreateTranslation(this.position.x,this.position.y,0) );
        
        var v0 = m.TransformVector2(this.v0);
        var v1 = m.TransformVector2(this.v1);
    
        var aa = (1.0 - (this.tick/this.lifespan));
        var col = new GLColour(aa,aa,aa,1);
        //GAZCanvas.Line(v0,v1,col,3);
    
        glDebugRenderer.addLine(v0,v1, col,3);
    
        //ctx.globalAlpha = 1.0;
    }
}
class ExplosionManager
{
    constructor()
    {
        this.objectList = [];
    }
    
    clear()
    {
        this.objectList = [];
    }
    
    add(src)
    {
        var i=0;
        
        var vertList = src.getLineList();
        
        for(i=0;i<vertList.length/2;i++)
        {
            var obj = new ExplosionPrim();
            obj.init(src.position,vertList[(i*2)+0],vertList[(i*2)+1]);
            this.objectList.push(obj);
        }
    }
    
    update()
    {
        var i=0;
        var newlist = [];
    
        for(i=0; i<this.objectList.length;i++)
        {
            this.objectList[i].update();
            
            if(this.objectList[i].active == true)
            {
                newlist.push(this.objectList[i]);
            }
        }
    
        this.objectList = newlist;
    
    }
    
    draw()
    {
        this.objectList.forEach(function(element)
        {
            element.draw();
        });
    }
    activeCount()
    {
        return 0;
    }
}
