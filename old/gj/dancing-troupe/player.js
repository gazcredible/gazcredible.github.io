class Player extends GameObject
{
    constructor()
    {
        super();
        this.size = 16;
    }

    setFromMapCell(mapcell)
    {
        super.setFromMapCell(mapcell);
    }

    update()
    {
        let new_pos = this.logicalPosition.clone();

        if(Input.getKeystate(KEYCODE_left_arrow) !== INPUT_NOT_PRESSED)
        {
            new_pos.x = this.logicalPosition.x - 0.1;
        }

        if(Input.getKeystate(KEYCODE_right_arrow) !== INPUT_NOT_PRESSED)
        {
            new_pos.x = this.logicalPosition.x + 0.1;
        }

        if(Input.getKeystate(KEYCODE_up_arrow) !== INPUT_NOT_PRESSED)
        {
            new_pos.y = this.logicalPosition.y - 0.1;
        }

        if(Input.getKeystate(KEYCODE_down_arrow) !== INPUT_NOT_PRESSED)
        {
            new_pos.y = this.logicalPosition.y + 0.1;
        }

        if((new_pos.x !== this.logicalPosition.x) || (new_pos.y !== this.logicalPosition.y))
        {
            if(model.isValidLocation(this, new MapCell(new_pos.x, new_pos.y) ) && this.canMoveTo(new_pos.x, new_pos.y)===true)
            {
                //work out the upto 4 cells the player is interacting with and take them out
                let cells = {};

                let offsets = [[0,0], [1,0], [0,1], [1,1]];
                for(let i=0;i< offsets.length;i++)
                {
                    let pos = this.logicalPosition.clone();
                    pos.x = Math.floor(pos.x + offsets[i][0]*0.9);
                    pos.y = Math.floor(pos.y + offsets[i][1]*0.9);

                    if(pos in cells == false)
                    {
                        cells[pos] = pos;
                        model.removeOwner(this, pos);
                    }
                }

                this.logicalPosition.x = new_pos.x;
                this.logicalPosition.y = new_pos.y;

                //work out the upto 4 cells the player is interacting with and add them int

                cells = {};

                for(let i=0;i< offsets.length;i++)
                {
                    let pos = this.logicalPosition.clone();
                    pos.x = Math.floor(pos.x + offsets[i][0]*0.9);
                    pos.y = Math.floor(pos.y + offsets[i][1]*0.9);

                    if(pos in cells == false)
                    {
                        cells[pos] = pos;
                        model.setOwner(this, new MapCell(pos.x,pos.y));
                    }
                }
            }
        }
    }

    canMoveTo(x,y)
    {
        //does x,y overlap any obstacles or baddies?

        let playercollider = new PolyCollider();

        let pos =  new Vector2(x,y); //this.logicalPosition.clone();
        //pos.x = Math.floor(pos.x);
        //pos.y = Math.floor(pos.y);

        let edges = [];
        edges.push(new Vector2(pos.x+0,pos.y+0));
        edges.push(new Vector2(pos.x+1,pos.y+0));
        edges.push(new Vector2(pos.x+1,pos.y+1));
        edges.push(new Vector2(pos.x+0,pos.y+1));

        playercollider.init(edges);

        for(let i=0;i< model.obstacles.length;i++)
        {
            let obscollider = new PolyCollider();
            pos =  model.obstacles[i].logicalPosition.clone();

            edges = [];
            edges.push(new Vector2(pos.x+0,pos.y+0));
            edges.push(new Vector2(pos.x+1,pos.y+0));
            edges.push(new Vector2(pos.x+1,pos.y+1));
            edges.push(new Vector2(pos.x+0,pos.y+1));

            obscollider.init(edges);

            if(playercollider.collides(obscollider) === true)
            {
                return false;
            }
        }

        return true;
    }

    toString()
    {
        return 'Player';
    }
}
