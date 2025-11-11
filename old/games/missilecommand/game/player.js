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
        this.oldposition = this.position;

        if (GameInst.inputEventManager.eventOccured("CURSOR") == true)
        {
            let pos = GameInst.inputEventManager.getVal("CURSOR").value;

            this.position = pos.clone();
        }

        if (GameInst.inputEventManager.eventOccured("TOUCH") == true)
        {
            this.position = GameInst.inputEventManager.getVal("TOUCH").value;
        }

        if (GameInst.inputEventManager.eventOccured("LAUNCH") == true)
        {
            var launchPos = this.position; // use current this.position ;)

            if ((launchPos.distance(this.lastLaunchPos)> 10)
               || ((GameInst.tickCount - this.lastLaunch) > 40)
            )
            {
                this.lastLaunch = GameInst.tickCount;
                this.lastLaunchPos = this.position;
                this.position = launchPos;

                if ((GameInst.disableMissileLaunch == false)
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
                        let d0 = GameInst.silos[0].canLaunch() ? GameInst.silos[0].position.distance(this.position) : 999999;
                        let d1 = GameInst.silos[1].canLaunch() ? GameInst.silos[1].position.distance(this.position) : 999999;
                        let d2 = GameInst.silos[2].canLaunch() ? GameInst.silos[2].position.distance(this.position) : 999999;

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
        GameInst.drawPlayerMarker(this.position,'#ffffff');
    }
};