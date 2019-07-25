class City extends GameObject
{
    constructor(Location,valid)
    {
        super();

        this.position = Location;

        this.active = valid;

        if(this.active == true)
        {
            this.collider = new RectCollider(City.width(),City.height());
            this.collider.setTransform(Matrix.CreateTranslation(Location.x + City.width()/2, Location.y+ City.height()/2,0));
        }
    }

    onExplode()
    {
        //GameAudio.Get().ExplodeObject(this);
        super.OnExplode();
    }

    draw()
    {
        if(this.active == true)
        {
            if(this.drawCollisions == true)
            {
                super.Draw();
            }

            GameInst.drawCity(this.position);
        }
    }



    static width()
    {
        return 50;
    }

    static height()
    {
        return 21;
    }
}
