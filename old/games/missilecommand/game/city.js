class City extends GameObject
{
    constructor(Location,active)
    {
        super();

        this.position = Location;

        this.active = active;

        if(this.active == true)
        {
            this.collider = new RectangleCollider(City.width(),City.height());
            this.collider.setTransform(Matrix.CreateTranslation(Location.x + City.width()/2, Location.y+ City.height()/2,0));
        }
    }

    onExplode()
    {
        //GameAudio.Get().ExplodeObject(this);
        super.onExplode();
    }

    draw()
    {
        super.draw();

        if(this.active == true)
        {
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
