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

    constructor(location, active)
    {
        if(active == undefined)
        {
            active = true;
        }

        super();


        this.position.set(location);
        this.active = active;
        this.collider = new RectangleCollider(silo.width(),silo.height());
        this.collider.setTransform(Matrix.CreateTranslation(this.position.x, this.position.y,0));

        this.onLevelStart(this.active);
    }

    onLevelStart(active)
    {
        super.onLevelStart(active);

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
                var p = new Vector2(pos[i].x + this.position.x, pos[i].y + this.position.y+5);
                GameInst.drawMissile(p);
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
        if(this.active == true)
        {
            GameInst.addPlayerMissile(this.position, target);

            this.missileCount--;
        }
    }

    canLaunch()
    {
        if(this.active == false)	return false;
        if(this.missileCount == 0) return false;

        return true;
    }

    getMissileCount()
    {
        if(this.active == false)	return 0;
        return this.missileCount;
    }

    removeBulletForPostWave()
    {
        this.missileCount--;
    }
}