class TroupeManager  extends Baddie
{
    constructor()
    {
        super();

        this.baddies = [];
        this.baddieOffset = [];

        //GARETH - this is tied to the baddies
        this.logicalPosition.x = 2;
        this.logicalPosition.y = 2;

        this.direction = 'right';
        this.target = undefined;
    }

    init()
    {
        super.init(new MapCell(2,2));
        this.direction = 'right';

        this.baddieOffset = [ new Vector2(-1,-1), new Vector2(0,-1),new Vector2(1,-1)
            ,new Vector2(-1,0), new Vector2(0,0),new Vector2(1,0)
            ,new Vector2(-1,1), new Vector2(0,1),new Vector2(1,1)];

        this.baddies = [];

        for (let i=0;i< this.baddieOffset.length;i++)
        {
            let baddie = new Baddie();
            this.baddies.push(baddie);

            baddie.initWithoutOwnership( new MapCell(this.logicalPosition.x + this.baddieOffset[i].x, this.logicalPosition.y + this.baddieOffset[i].y) );
        }
    }

    addToTroupe(baddie)
    {
        this.baddies.push(baddie)
    }

    decideWhatToDo()
    {
        if (this.route !== undefined)
        {
            if( this.atTraversalTarget() === true)
            {
                if (this.route.length > 0)
                {
                    let next_node = this.route.shift();

                    if(model.canIGoHere(this, next_node) === true)
                    {
                        model.removeOwner(this, this.currentCell());
                        model.setOwner(this,next_node,this);

                        this.setupTraversal(this.logicalPosition, next_node.toVector2());

                        return;
                    }
                    else
                    {
                    }
                }
                else
                {
                    //at final destination
                    this.route = undefined;
                    this.target = undefined;
                    this.canMove = false;

                    //find new route
                    if(this.direction === 'right')
                    {
                        this.direction = 'left';
                    }
                    else
                    {
                        this.direction = 'right';
                    }

                    //drop down to find new route target ...
                }
            }
            else
            {
                return;
            }
        }

        if (this.target === undefined)
        {
            if(this.direction === 'right')
            {
                this.target = new MapCell(16, 2);
            }
            else
            {
                this.target = new MapCell(2, 2);
            }

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

        if (this.target !== undefined)
        {
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

        //if we are near the edge, switch direction
        if(this.direction === 'right')
        {
            if (this.logicalPosition.x > 16)
            {
                this.direction = 'left';
            }
        }
        else
        {
            if (this.logicalPosition.x < 2)
            {
                this.direction = 'right';
            }
        }

        if (this.direction === 'right')
        {
            //lp.x += 1
        }
        else
        {
            //if direction === 'left' -> lp.x -= 1
        }
    }

    update(timeElapsed)
    {
        if (model.sim_active === true)
        {
            if (model.isBeat() === true)
            {
                this.decideWhatToDo();
            }

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

            for(let i=0;i<this.baddies.length;i++)
            {
                this.baddies[i].logicalPosition.x = this.logicalPosition.x + this.baddieOffset[i].x;
                this.baddies[i].logicalPosition.y = this.logicalPosition.y + this.baddieOffset[i].y;
            }
        }
    }
}