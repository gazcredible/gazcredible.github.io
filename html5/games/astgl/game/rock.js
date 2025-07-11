
var bigRock = [];
var medRock = [];
var smlRock = [];
class Rock extends BaseObject
{
    constructor()
    {
        super();
        
        if(bigRock.length == 0)
        {
            //create rock geometry
            var rockAngle = 0;
    
            var i;
            var segCount = 20*4;
    
    
            for (i = 0; i < segCount; i++)
            {
                var m = Matrix.CreateRotationZ( (Math.PI*2*i)/segCount);
                bigRock.push(m.TransformVector2(new Vector2(0, (this.getMinSize('big') + (Math.random() * 20)))));
            }
    
            segCount = 16*4;
            for (i = 0; i < segCount; i++)
            {
                var m = Matrix.CreateRotationZ( (Math.PI*2*i)/segCount);
                medRock.push(m.TransformVector2(new Vector2(0, (this.getMinSize('med') + (Math.random() *  10)))));
            }
    
            segCount = 8*4;
            for (i = 0; i < segCount; i++)
            {
                var m = Matrix.CreateRotationZ( (Math.PI*2*i)/segCount);
                smlRock.push(m.TransformVector2(new Vector2(0, (this.getMinSize('sml') + (Math.random() *  5)))));
            }
        }
        
        this.size = '';
        this.angle = 0;
    }
    
    getMinSize(size)
    {
        if(size == 'big')
        {
            return 60;
        }
        
        if(size =='med')
        {
            return 20;
        }
        
        if(size == 'sml')
        {
            return 10;
        }
    }
    
    init(position, size, direction)
    {
        this.active = true;
        
        this.position.set(position);
        this.velocity.set(direction);
        this.size = size;
        this.angle = Math.random() * (Math.PI * 2);
    
        
        if(this.size == 'big')
        {
            this.collider.set(this.position,80);
        }
    
        if(this.size == 'med')
        {
            this.collider.set(this.position,30);
        }
    
        if(this.size == 'sml')
        {
            this.collider.set(this.position,15);
        }
    }
    
    getRandomPointInRock()
    {
        var pos = new Vector2();
        
        var pos = Matrix.CreateRotationZ(Math.random()*Math.PI*2).TransformVector2(new Vector2(0, 10+ Math.random() * (this.getMinSize(this.size)-10)));
        pos.x += this.position.x;
        pos.y += this.position.y;
        
        return pos;
    }
    
    initFromRock(rock)
    {
        var maxSpeed = 1;
        if(rock.size == 'big')
        {
            this.size = 'med';
            maxSpeed = 1.5;
        }
    
        if(rock.size == 'med')
        {
            this.size = 'sml';
            maxSpeed = 3;
        }
        
        this.init(rock.getRandomPointInRock(),this.size,rock.velocity);
    
        var angle = Math.random() * Math.PI*2;
        this.velocity = Matrix.CreateRotationZ(angle).TransformVector2(new Vector2((Math.random()+0.25)*maxSpeed,0));
    }
    
    
    update()
    {
        if(this.active == false)    return;
        
        this.angle += 0.01;
    
        if((this.position.x + this.velocity.x) < 0)
        {
            this.position.x += 1600;
        }
    
        if((this.position.x + this.velocity.x) > 1600)
        {
            this.position.x -= 1600;
        }
    
        if((this.position.y + this.velocity.y) < 0)
        {
            this.position.y += 900;
        }
    
        if((this.position.y + this.velocity.y) > 900)
        {
            this.position.y -= 900;
        }
    
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        super.update();
    }
    
    draw()
    {
        if(this.active == false)    return;
    
        var points = this.getLineList();
        var i;
        var col = new GLColour(1,1,1,1);
        for ( i = 0; i < points.length; i+=2)
        {
            glDebugRenderer.addLine(points[i], points[(i + 1)], col,3);
        }
        
        super.draw();
    }
    
    getLineList()
    {
        var m = Matrix.Multiply(Matrix.CreateRotationZ(this.angle),Matrix.CreateTranslation(this.position.x,this.position.y,0));
        var points = [];
        var i;
        
        if(this.size == 'big')
        {
            for (i = 0; i < bigRock.length; i++)
            {
                points.push(m.TransformVector2(bigRock[i]));
                points.push(m.TransformVector2(bigRock[(i+1)%bigRock.length]));
            }
        }
    
        if(this.size == 'med')
        {
            for (i = 0; i < medRock.length; i++)
            {
                points.push(m.TransformVector2(medRock[i]));
                points.push(m.TransformVector2(medRock[(i+1)%medRock.length]));
            }
        }
    
        if(this.size == 'sml')
        {
            for (i = 0; i < smlRock.length; i++)
            {
                points.push(m.TransformVector2(smlRock[i]));
                points.push(m.TransformVector2(smlRock[(i+1)%smlRock.length]));
            }
        }
        
        return points;
    }
}
