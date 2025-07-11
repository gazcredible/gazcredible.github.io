class Baddie extends GameAgent
{
    constructor()
    {
        super();

        this.target = undefined;
        this.velocity = new Vector2();

        this.state = '';

        this.elapsed_time = 0;
        this.traversal_start = new Vector2();
        this.traversal_dest = new Vector2();
        this.traversal_available_time = 0;
        this.traversal_elapsed_time = 0;
        this.t_value = 0;

        this.debug_text = '';
    }

    init(mapcell)
    {
        this.pathAgent = new PathAgent(this);
        this.pathAgent.use4wayList = true;

        this.logicalPosition.x = mapcell.x;
        this.logicalPosition.y = mapcell.y;

        this.canMove = false;
        this.currentTarget = undefined;

        this.route = undefined;
        this.beats_per_cell = 1; // set this to multiple of 4 IF working on measures (1 trigger per bar)

        this.state = 'goto_cover';
        //this.state = 'test_ownership_find_target';

        //can I own this this cell?
        model.setOwner(this, this.currentCell());
    }

    resetPlanning()
    {
        this.route = undefined;
        this.target = undefined;
        this.canMove = false;
    }

    setupTraversal(starting_position, target)
    {
        // this is how long to you have to get to your destination - assuming 1 measure per cell
        this.traversal_available_time = model.get_measure_time();
        // * by measures per cell so the baddie will take longer to move, i.e. have more time to move between mapcells
        this.traversal_available_time = this.traversal_available_time * this.beats_per_cell;
        this.traversal_start.set(starting_position);
        this.traversal_dest.set(target);
        this.traversal_elapsed_time = 0;

        this.traversal_distance = this.traversal_start.distance(this.traversal_dest);
    }

    atTraversalTarget()
    {
        return (this.t_value >= 1);
    }

    updateTraversal(timeElapsed)
    {
        this.traversal_elapsed_time += timeElapsed;

        this.t_value = this.traversal_elapsed_time / this.traversal_available_time;

        if(this.t_value > 1)
        {
            this.t_value = 1;
        }

        if(this.t_value< 0)
        {
            this.t_value = 0;
        }

        this.logicalPosition.x = this.traversal_start.x + ((this.traversal_dest.x - this.traversal_start.x)*this.t_value);
        this.logicalPosition.y = this.traversal_start.y + ((this.traversal_dest.y - this.traversal_start.y)*this.t_value);
    }

    update(timeElapsed)
    {
        super.update();

        this.debug_text += this.state;

        if(this.canMove === undefined)
        {
            throw 'canMove not set-up';
        }

        if(this.state === 'test_ownership_at_target')
        {
            return;
        }

        if(this.state === 'test_ownership_find_target')
        {
            if (this.canMove === true)
            {
                this.debug_text += ' can move';
                this.debug_text += (this.traversal_elapsed_time / this.traversal_available_time).toFixed(2);
                this.updateTraversal(timeElapsed);
            }
            else
            {
                this.debug_text += ' can\'t move';
                this.pathAgent.update();

                if((this.pathAgent.target === undefined) || (this.currentCell().Equals(this.pathAgent.target) === true))
                {
                    this.resetPlanning();
                }
            }

            return;
        }

        if (this.state === 'goto_cover')
        {
            if (this.canMove === true)
            {
                this.debug_text += ' can move';
                this.debug_text += (this.traversal_elapsed_time / this.traversal_available_time).toFixed(2);
                this.updateTraversal(timeElapsed);
            }
            else
            {
                this.debug_text += ' can\'t move';
                this.pathAgent.update();

                if((this.pathAgent.target === undefined) || (this.currentCell().Equals(this.pathAgent.target) === true))
                {
                    this.resetPlanning();
                }
            }

            return;
        }

        if(this.state === 'in_cover')
        {
            this.state = 'in_cover';
            return;
        }
    }

    decideWhatToDo(badman)
    {
        this.debug_text += ' decide what to do';

        if(this.state === 'test_ownership_at_target')
        {
            return;
        }

        if(this.state === 'test_ownership_find_target')
        {
            if (this.route !== undefined)
            {
                // am I at my current destination?
                //  yes - setup the next target
                //  no - erm ???

                if( this.atTraversalTarget() === true)
                {
                    if (this.route.length > 0)
                    {
                        let next_node = this.route.shift();

                        //is next_node available?
                        //if so, own it
                        if(model.canIGoHere(this, next_node) === true)
                        {
                            model.removeOwner(this, this.currentCell());
                            model.setOwner(this,next_node,this);

                            this.setupTraversal(this.logicalPosition, next_node.toVector2());

                            return;
                        }
                        else
                        {
                            //find a new route ...
                        }

                    }
                    else
                    {
                        //at final destination
                        this.route = undefined;
                        this.target = undefined;
                        this.canMove = false;

                        this.state = 'test_ownership_at_target';
                        return;
                    }
                }

                return;
            }

            if (this.target === undefined)
            {
                if (badman.get_movement_target(this) === true)
                {
                    try
                    {
                        this.pathAgent.init(this.currentCell(), this.target);
                    } catch (e)
                    {
                        console.log('');
                    }

                    if (this.pathAgent.canReachTarget() === false)
                    {
                        //still path finding
                        this.canMove = false;
                        return;
                    }
                }
            }

            if (this.target !== undefined)
            {
                //move to target
                if (this.pathAgent.canReachTarget() === true)
                {
                    this.canMove = true;
                    this.route = this.pathAgent.GetRoute();

                    if (this.route !== undefined)
                    {
                        //get rid of starting node as it's the current cell
                        this.route.shift();
                        let next_node = this.route.shift();

                        model.removeOwner(this, this.currentCell());
                        model.setOwner(this,next_node,this);

                        this.setupTraversal(this.logicalPosition,next_node.toVector2());
                    }
                    else
                    {
                        this.route = undefined;
                        this.target = undefined;
                        this.canMove = false;
                    }
                }
                else
                {
                    //do more route prep ....
                    return;
                }
            }

            return;
        }

        if(this.state === 'in_cover')
        {
            let cell = this.currentCell();
            if(model.heatmap.isVisibleToPlayer(cell) === true)
            {
                this.state = 'goto_cover';
            }

            return;
        }

        if (this.state === 'goto_cover')
        {
            if (this.route !== undefined)
            {
                // am I at my current destination?
                //  yes - setup the next target
                //  no - erm ???

                if( this.atTraversalTarget() === true)
                {
                    if (this.route.length > 0)
                    {
                        let next_node = this.route.shift();

                        //is next_node available?
                        //if so, own it
                        if(model.canIGoHere(this, next_node) === true)
                        {
                            model.removeOwner(this, this.currentCell());
                            model.setOwner(this,next_node,this);

                            this.setupTraversal(this.logicalPosition, next_node.toVector2());
                            return;
                        }
                        else
                        {
                            //find a new route ...
                            try
                            {
                                this.pathAgent.init(this.currentCell(), this.target);
                            } catch (e)
                            {
                                console.log('');
                            }

                            if (this.pathAgent.canReachTarget() === false)
                            {
                                //still path finding
                                this.canMove = false;
                                return;
                            }
                            else
                            {
                                //set-up roue
                                this.canMove = true;
                                this.route = this.pathAgent.GetRoute();

                                if (this.route !== undefined)
                                {
                                    //get rid of starting node as it's the current cell
                                    this.route.shift();
                                    let next_node = this.route.shift();

                                    if(model.canIGoHere(this, next_node) === true)
                                    {
                                        model.removeOwner(this, this.currentCell());
                                        model.setOwner(this, next_node, this);

                                        this.setupTraversal(this.logicalPosition, next_node.toVector2());
                                    }
                                }
                                else
                                {
                                    this.route = undefined;
                                    this.target = undefined;
                                    this.canMove = false;
                                }
                            }
                        }
                    }
                    else
                    {
                        //at final destination
                        this.route = undefined;
                        this.target = undefined;
                        this.canMove = false;

                        this.state = 'in_cover';
                        return;
                    }
                }

                return;
            }

            if (this.target === undefined)
            {
                if (badman.get_movement_target(this) === true)
                {
                    try
                    {
                        this.pathAgent.init(this.currentCell(), this.target);
                    } catch (e)
                    {
                        console.log('');
                    }

                    if (this.pathAgent.canReachTarget() === false)
                    {
                        //still path finding
                        this.canMove = false;
                        return;
                    }
                }
            }

            if (this.target !== undefined)
            {
                //move to target
                if (this.pathAgent.canReachTarget() === true)
                {
                    this.canMove = true;
                    this.route = this.pathAgent.GetRoute();

                    if (this.route !== undefined)
                    {
                        //get rid of starting node as it's the current cell
                        this.route.shift();
                        let next_node = this.route.shift();

                        model.removeOwner(this, this.currentCell());
                        model.setOwner(this,next_node,this);

                        this.setupTraversal(this.logicalPosition,next_node.toVector2());
                    }
                    else
                    {
                        this.route = undefined;
                        this.target = undefined;
                        this.canMove = false;
                    }
                }
                else
                {
                    //do more route prep ....
                    return;
                }
            }

            return;
        }
    }

    toString()
    {
        return 'Baddie';
    }
}
