class BaddieManager
{
    constructor()
    {
        this.max_baddie_count = 5;
        this.beat_delay = 10;
        this.wait_time = 0;
    }

    add_spawnpoint(spawnPoint)
    {

    }

    update()
    {
        if(model.sim_active === true)
        {
            if (model.isBeat() === true)
            {
                if(this.wait_time === 0)
                {
                    for (let i = 0; i < model.spawnpoints.length; i++)
                    {
                        if (model.baddies.length < this.max_baddie_count)
                        {
                            if (model.spawnpoints[i].IsValidCell(model.spawnpoints[i].currentCell()) === true)
                            {
                                //place new baddie
                                let baddie = new Baddie();
                                baddie.init(model.spawnpoints[i].currentCell());
                                model.addBaddie(baddie);
                            }
                        }
                    }

                    this.wait_time = this.beat_delay;
                }
                else
                {
                    this.wait_time = this.wait_time-1;
                }

                for (let i = 0; i < model.baddies.length; i++)
                {
                    model.baddies[i].decideWhatToDo(this);
                }
            }

            for (let i = 0; i < model.baddies.length; i++)
            {
                model.baddies[i].update(model.time_since_last_update());
            }
        }
    }

    get_movement_target(baddie)
    {
        //find an empty target if one exists
        let current_loc = model.get_obstacle_for_baddie(baddie);
        let target = model.get_free_obstacle_cover(baddie.currentCell() );

        if(current_loc !== undefined)
        {
            model.free_obstacle(current_loc);
        }

        if(target !== undefined)
        {
            target['owner'] = baddie;
            baddie.target = target['mapcell'].clone();
            return true;
        }
        else
        {
            baddie.target = undefined;
        }

        return false;
    }
}