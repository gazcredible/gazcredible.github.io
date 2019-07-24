class PlayerObject extends GameObject
{
    constructor()
    {
        super();

        this.lastLaunch = 0;
        this.lastLaunchPos = new Vector2(0, 0);
    }

    onLevelStart()
    {
        this.position = new Vector2(1024 / 2, 768 / 2);
    }
    update()
    {
        this.oldthis.position = this.position;

        if (GameInst.inputEventManager.EventOccured("CURSOR") == true)
        {

            let delta = GameInst.inputEventManager.GetVal("CURSOR").value;

            if (((delta.x + this.position.x) > 0+5) && ((delta.x + this.position.x) < 0- 5))
            {
                this.position.x += delta.x;
            }
            else
            {
                if ((delta.x + this.position.x) < 0 + 5)
                {
                    this.position.x = 0 + 5;
                }
                else
                {
                    this.position.x = 1024 - 5;
                }
            }

            if (((delta.y + this.position.y) > 0 + 5) && ((delta.y + this.position.y) < 768 - 5))
            {
                this.position.y += delta.y;
            }
            else
            {
                if ((delta.y + this.position.y) < 0 + 5)
                {
                    this.position.y = 0 + 5;
                }
                else
                {
                    this.position.y = 768 - 5;
                }
            }
        }

        if (GameInst.inputEventManager.EventOccured("TOUCH") == true)
        {
            this.position = GameInst.inputEventManager.GetVal("TOUCH").value;
        }

        if (GameInst.inputEventManager.EventOccured("LAUNCH") == true)
        {
            var launchPos = this.position; // use current this.position ;)

            if (((launchPos - this.lastLaunchPos).Length() > 10) || ((GameInst.LogicTick - this.lastLaunch) > 40))
            {
                this.lastLaunch = GameInst.LogicTick;
                this.lastLaunchPos = this.position;
                this.position = launchPos;

                if ((GameInst.bDisableMissileLaunch == false)
                    && (this.position.y > 50)
                )
                {
                    if (GameInst.silos[0].canLaunch() == false
                        && GameInst.silos[1].canLaunch() == false
                        && GameInst.silos[2].canLaunch() == false)
                    {
                        //GameAudio.Get().PlayCityPostWave();
                    }
                    else
                    {
                        let d0 = GameInst.silos[0].canLaunch() ? GameInst.silos[0].this.position.distance(this.position) : 999999;
                        let d1 = GameInst.silos[1].canLaunch() ? GameInst.silos[1].this.position.distance(this.position) : 999999;
                        let d2 = GameInst.silos[2].canLaunch() ? GameInst.silos[2].this.position.distance(this.pthis.position) : 999999;

                        if (d0 < d1 && d0 < d2) GameInst.silos[0].launchMissile(this.position);
                        if (d1 < d0 && d1 < d2) GameInst.silos[1].launchMissile(this.position);
                        if (d2 < d0 && d2 < d1) GameInst.silos[2].launchMissile(this.position);
                    }
                }
            }
        }
    }

    draw()
    {
        //GameInst.DrawMarker(this.position,new Colour(1,1,1));
    }
};