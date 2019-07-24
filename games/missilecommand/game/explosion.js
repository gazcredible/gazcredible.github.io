class Explosion extends GameObject
{
    constructor()
    {
        super();

        this.rad = 0;
        this.dir = 0;
        this.tick = 0;
    }

    onOneTimeInit(location, collidable, playerOwned)
    {
        this.Position = this.location;

        this.rad = 1;
        this.dir = 5;
        this.tick = 0;

        if(collidable == true)
        {
            this.collider = new CircleCollider();
        }

        //GameAudio.Get().ExplodeObject(this);

        this.ownedByPlayer = playerOwned;
    }

    update()
    {
        if(this.collider != null)
        {
            this.collider.init(rad);
            this.collider.setTransform(Matrix.CreateTranslation(this.position.x,this.position.y,0));
        }

        if(this.tick%4 == 0)
        {
            if(this.rad > 35)
            {
                this.dir = -vdir;
            }

            this.rad += this.dir;
        }

        this.tick++;
    }
    draw()
    {
        if(this.drawCollisions == true)
        {
            super.Draw();
        }
        else
        {
            this.collider.draw()
        }
    }
    isDead()
    {
        return this.rad < 0;//((dir < 10) & (rad < dir));
    }

    getRadius()
    {
        return this.rad;
    }
};