/**
 * Created by gareth on 26/06/2018.
 */

class Ship extends BaseObject
{
    constructor()
    {
        super();
        
        this.position = new Vector2(1600 / 2, 900 / 2);
        this.velocity = new Vector2(0, 0);
        this.angle = 0;
        //this.collider.set(this.position,15);
        this.lastShotTime = 0;
        this.invincibleTicker = 0;
        this.displayThrust = false;
        
        this.transform = new Matrix();
        this.shipModel = [new Vector2(0, 20)
            , new Vector2(10, -10)
            , new Vector2(0, -5)
            , new Vector2(-10, -10)];
    }
    
    init()
    {
        super.init();
        
        this.position = new Vector2(1600 / 2, 900 / 2);
        this.velocity = new Vector2(0, 0);
        this.angle = 0;
        this.lastShotTime = 0;
        this.invincibleTicker = 0;
        this.displayThrust = false;
    }
    
    update()
    {
        if (Input.getKeystate(KEYCODE_left_arrow) != 'not_pressed')
        {
            this.angle -= 0.1;
        }
        
        if (Input.getKeystate(KEYCODE_right_arrow) != 'not_pressed')
        {
            this.angle += 0.1;
        }
        
        
        if (Input.getKeystate(KEYCODE_z) != 'not_pressed')
        {
            if (AstGameInst.frameCount - this.lastShotTime > AstGameInst.shotInterlockTime)
            {
                
                var mshot = 1;
                var i;
                for (i = 0; i < mshot; i++)
                {
                    var b = new Bullet();
                    
                    AstGameInst.bulletList.push(b);
                    
                    var a = this.angle + (i - (mshot / 2)) * 0.1;
                    
                    var m = Matrix.CreateRotationZ(a);
                    
                    var bulletPos = m.TransformVector2(new Vector2(0, 20));
                    bulletPos.x += this.position.x;
                    bulletPos.y += this.position.y;
                    
                    b.init(bulletPos, a);
                }
                
                this.lastShotTime = AstGameInst.frameCount;
            }
        }
        
        var thrust = new Vector2(0, 0);
        var thrusting = false;
        
        
        if (Input.getKeystate(KEYCODE_up_arrow) != 'not_pressed')
        {
            var m = Matrix.CreateRotationZ(this.angle);
            thrust = m.TransformVector2(new Vector2(0, 0.25));
            
            thrusting = true;
        }
        else
        {
            thrusting = false;
        }
        
        this.velocity.x += thrust.x;
        this.velocity.y += thrust.y;
        
        var drag = new Vector2();
        drag.x = this.velocity.x / -100.0;
        drag.y = this.velocity.y / -100.0;
        
        this.velocity.x += drag.x;
        this.velocity.y += drag.y;
        
        if (this.velocity.length() > 3)
        {
            this.velocity.normalize();
            this.velocity.x *= 3;
            this.velocity.y *= 3;
        }
        else
        {
            if (this.velocity.length() < 0.2)
            {
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }
        
        if ((this.position.x + this.velocity.x) < 0)
        {
            this.position.x += 1600;
        }
        
        if ((this.position.x + this.velocity.x) > 1600)
        {
            this.position.x -= 1600;
        }
        
        if ((this.position.y + this.velocity.y) < 0)
        {
            this.position.y += 900;
        }
        
        if ((this.position.y + this.velocity.y) > 900)
        {
            this.position.y -= 900;
        }
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        this.displayThrust = ((thrusting == true) && (AstGameInst.frameCount % 5) == 1);
        
        if (this.isInvincible() == true)
        {
            this.invincibleTicker--;
        }
        
        super.update();
    }
    
    isInvincible()
    {
        return this.invincibleTicker > 0;
    }
    
    draw()
    {
        var drawShip = true;
        
        if (this.invincibleTicker > 0)
        {
            drawShip = (AstGameInst.frameCount % 30) > 15;
        }
        
        if (drawShip == true)
        {
            var points = this.getLineList();
            var i;
            
            for (i = 0; i < points.length; i+=2)
            {
                GAZCanvas.Line(points[i], points[(i + 1)], '#ffffff',3);
            }
            
            if (this.displayThrust == true)
            {
                var points = [new Vector2(0, -7)
                    , new Vector2(5, -11)
                    , new Vector2(0, -20)
                    , new Vector2(-5, -11)];
                
                
                for (i = 0; i < 4; i++)
                {
                    points[i] = this.transform.TransformVector2(points[i]);
                }
                
                var index = [0, 1, 1, 2, 2, 3, 3, 0];
                
                for (i = 0; i < index.length; i += 2)
                {
                    GAZCanvas.Line(points[index[i]], points[index[i + 1]], '#ffffff', 3);
                }
            }
        }
        super.draw();
    }
    
    setInvincible()
    {
        this.invincibleTicker = 180;
    }
    
    getLineList()
    {
        this.transform = Matrix.Multiply(Matrix.CreateRotationZ(this.angle), Matrix.CreateTranslation(this.position.x, this.position.y, 0));
        var points = [];
        var i;
    
        for (i = 0; i < this.shipModel.length; i++)
        {
            points.push(this.transform.TransformVector2(this.shipModel[i]));
            points.push(this.transform.TransformVector2(this.shipModel[(i+1)%this.shipModel.length]));
        }
        
        return points;
    }
}