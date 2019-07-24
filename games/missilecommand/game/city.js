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

            let rects =
            [
                new Rect(0,6,6,15),
                new Rect(12,3,13,18),
                new Rect(3,14,12,7),
                new Rect(33,0,10,21),
                new Rect(23,+11,12,10),
                new Rect(42,+14,8,7),
            ];

            let main = '#ff3377';
            let secondary = '#00ffff';

            let cols =
            [
                main,main,secondary,main,secondary,secondary
            ];

            for (let i = 0; i < rects.length; i++)
            {
                GAZCanvas.Rect(new Rect(rects[i].x + this.position.x, rects[i].y+this.position.y, rects[i].w, rects[i].h), cols[i],true,1);
            }
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
