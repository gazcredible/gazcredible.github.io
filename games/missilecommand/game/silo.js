class silo extends GameObject
{
    static width()
    {
        return 66;
    }

    static height()
    {
        return 20;
    }

    constructor(Location, valid)
    {
        super(Location);

        this.collider = new RectCollider(silo.width(),silo.height());
        this.collider.setTransform(Matrix.CreateTranslation(Location.x, Location.y,0));

        this.onLevelStart(valid);
    }

    onLevelStart(valid)
    {
        super.onLevelStart(valid);

        if(this.active == true)
        {
            this.missileCount = 10;
        }
        else
        {
            this.missileCount = 0;
        }

        this.bDisplayOut = false;

    }

    draw()
    {
        super.draw();


        let x = 10;
        let y = 10;

        if((this.active == true) && (this.missileCount > 0))
        {
            let pos =
            [
                new Vector2(0,0),
                new Vector2(-(1*x),y), new Vector2(x,y),
                new Vector2(-(2*x),2*y), new Vector2(0,2*y), new Vector2(2*x,2*y),
                new Vector2(-(3*x),3*y),new Vector2(-1*x,3*y),new Vector2(1*x,3*y), new Vector2(3*x,3*y),
            ];

            for(let i=0;i<this.missileCount;i++)
            {
                GameInst.drawMissile(pos[i] + this.position);
            }
        }

        if(this.bDisplayOut == true)
        {
            /*
            DebugDraw.Get().SetFontScale(2 * MCGame.Get().ScaleFactor.y);
            DebugDraw.Get().debugFont.SetFG(new Library.Colour(0,0,0));
            DebugDraw.Get().Print((new Library.Vector2(0, 2.5f * y) + Position + new Library.Vector2(1, 1)) * MCGame.Get().ScaleFactor, Library.DebugFont.Justify.CentreXY, "OUT");

            DebugDraw.Get().debugFont.SetFG(MCGame.Get().GetPlayerColour());
            DebugDraw.Get().Print((new Library.Vector2(0, 2.5f * y) + Position) * MCGame.Get().ScaleFactor, Library.DebugFont.Justify.CentreXY, "OUT");

            DebugDraw.Get().debugFont.SetFG(new Library.Colour(1,1,1));
            */
        }
    }

    update()
    {
        this.bDisplayOut = false;

        /*
        if(GameInst.disableEmptySiloText == false)
        {
            if((MCGame.Get().iFrameCount%20 >= 10) && (this.missileCount == 0))
            {
                this.bDisplayOut = true;
            }
        }*/
    }

    onExplode()
    {
        super.onExplode();
        //GameAudio.Get().ExplodeObject(this);

    }

    launchMissile(target)
    {
        GameInst.addPlayerMissile(this.position,target);

        this.missileCount--;
    }

    canLaunch()
    {
        if(this.isValid() == false)	return false;
        if(this.missileCount == 0) return false;

        return true;
    }

    getMissileCount()
    {
        if(this.isValid() == false)	return 0;
        return this.missileCount;
    }

    removeBulletForPostWave()
    {
        this.missileCount--;
    }
}