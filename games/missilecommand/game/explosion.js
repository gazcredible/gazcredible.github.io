class Explosion extends GameObject
{
    constructor(location, collidable, playerOwned)
    {
        super();

        this.rad = 1;
        this.dir = 5;
        this.tick = 0;

        if(collidable == true)
        {
            this.collider = new CircleCollider();
        }

        //GameAudio.Get().ExplodeObject(this);

        this.ownedByPlayer = playerOwned;
        this.position = location;
    }

    update()
    {
        if(this.collider != null)
        {
            this.collider.initCircleCollider(this.rad);
            this.collider.setTransform(Matrix.CreateTranslation(this.position.x,this.position.y,0));
        }

        if(this.tick%4 == 0)
        {
            if(this.rad > 35)
            {
                this.dir = -this.dir;
            }

            this.rad += this.dir;
        }

        this.active = (this.rad > 0);

        this.tick++;
    }
    draw()
    {
        super.draw();

        if(this.ownedByPlayer == true)
        {
            this.collider.draw(GameInst.getPlayerColour(), 2);
        }
        else
        {
            this.collider.draw(GameInst.getBaddieColour(), 2);
        }


    }
    getRadius()
    {
        return this.rad;
    }
};