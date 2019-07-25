class MissileBase extends GameObject
{
    constructor(position, target, speed)
    {
        super();

        this.start = position.clone();
        this.target = target.clone();
        this.currentColour = 0;

        this.collider = new LineCollider();

        this.velocity.x = this.target.x - this.start.x;
        this.velocity.y = this.target.y - this.start.y;
        this.velocity.normalize();
        this.velocity.x *= speed;
        this.velocity.y *= speed;

        this.position = this.start.clone();
    }

    update()
    {
        if(this.active == false)
        {
            return;
        }

        this.oldPosition = this.position;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.collider.initFromPoints(this.start,this.position);
        this.collider.setTransform(Matrix_Identity);

        this.currentColour = '#ffffff';//MCGame.Get ().GetRandomColour();
    }

    draw(col)
    {
        if(this.active == false)
        {
            return;
        }

        if(this.drawCollisions == true)
        {
            super.draw();
        }
        else
        {
            GAZCanvas.Line(this.start,this.position,this.col,2);

            let head = new Rect(this.position.x,this.position.y,4,4);
            head.x -=2;
            head.y -=2;
            GAZCanvas.Rect(head,this.currentColour, true,1)
        }
    }
}

class BaddieMissile extends MissileBase
{
    draw()
    {
        super.draw(GameInst.getBaddieColour());
    }
}

class PlayerMissile extends MissileBase
{
    constructor(location, target)
    {
        super();
        this.start = location;
        this.target = target;

        super.setUp(15.0);

        //missileNoise = null;
        //GameAudio.Get().PlayMissileTravel(this);
    }

    update()
    {
        //GameAudio.Get().PlayMissileTravel(this);
        super.update();
    }

    draw()
    {
        super.draw('#ffffff');//MCGame.Get().GetPlayerColour());
        //MCGame.Get().DrawMarker(target,MCGame.Get().GetRandomColour());
    }

    isAtTarget()
    {
        return this.position.distance(this.target) < velocity.length();
    }
}
