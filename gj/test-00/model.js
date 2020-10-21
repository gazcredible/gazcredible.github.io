class IVector2
{
    constructor(x,y)
    {
        if(x === undefined)
        {
            this.x = 0;
            this.y = 0;
        }
        else
        {
            this.x = x;
            this.y = y;
        }
    }

    Equals(target)
    {
        return ((this.x === target.x) && (this.y === target.y));
    }

    clone(source)
    {
        this.x = source.x;
        this.y = source.y;
    }
}

class MapCell extends IVector2
{
    constructor(x,y)
    {
        super();
        this.x = x;
        this.y = y;
        this.owner = -1;
    }

    toString()
    {
        return ''+ this.x +':'+this.y;
    }
}


let MapCell_Size = 64;
let offset = new IVector2(32,32);

function logical_to_drawing_postion(x,y)
{
    return [offset.x +(x*MapCell_Size),offset.y+(y*MapCell_Size)];
}

function logical_to_drawing_postion_from_mapcell(mapcell)
{
    return logical_to_drawing_postion(mapcell.x,mapcell.y);
}

class NavGrid
{
    constructor()
    {
    }

    init(width, height)
    {
        this.grid = new Array()

        for(let y = 0; y < height;y++)
        {
            let row = new Array();

            this.grid.push(row);

            for(let x = 0;x < width;x++)
            {
                row.push(new MapCell(x,y));
            }
        }
    }

    draw()
    {
        for(let y=0;y<this.grid.length; y++)
        {
            for(let x=0;x < this.grid[y].length;x++)
            {
                let pos = logical_to_drawing_postion(x,y);
                let rect =  new Rect(pos[0],pos[1],MapCell_Size-1,MapCell_Size-1)

                if(this.grid[y][x].owner === -1)
                {
                    GAZCanvas.Rect(rect, '#ffffff', false, 1);
                }
                else
                {
                    GAZCanvas.Rect(rect, '#7f0000', true, 1);
                }
                GAZCanvas.Text(12, this.getCell(x,y).toString(), rect.getCentre(),'#ffffff','centre');
            }
        }

        for(let y=0;y<this.grid.length; y+=2)
        {
            for(let x=0;x < this.grid[y].length;x+=2)
            {
                let pos = logical_to_drawing_postion(x,y);
                let rect =  new Rect(pos[0],pos[1],MapCell_Size*2-1,MapCell_Size*2-1)
                GAZCanvas.Rect(rect,'#0000ff',false,1);
            }
        }
    }

    getCell(x,y)
    {
        return this.grid[y][x];
    }

}

let global_ID = 1;

class GameObject
{
    constructor(model)
    {
        this.model = model;
        this.logicalPosition = new Vector2(0,0);
        this.ID = global_ID;
        global_ID += 1;
    }

    update()
    {

    }

    draw()
    {
    }

    IsValidCell(cell)
    {
        if(cell.x < 0)  return false;
        if(cell.y < 0)  return false;

        if(cell.x > 19)  return false;
        if(cell.y > 11)  return false;

        for(let i=0;i< this.model.obstacles.length;i++)
        {
            if(cell.Equals(this.model.obstacles[i].currentCell()) === true)
            {
                return false;
            }
        }

        return true;
    }

    IsValidTransition(start, target)
    {
        if(this.IsValidCell(target) === true)
        {
            return true;
        }

        return false;
    }

    setFromMapCell(mapcell)
    {
        this.logicalPosition.x = mapcell.x;
        this.logicalPosition.y = mapcell.y;

        this.model.setOwner(this,mapcell);
    }

    currentCell()
    {
        return new MapCell( Math.floor(this.logicalPosition.x), Math.floor(this.logicalPosition.y));
    }
}

class GameObstacle extends GameObject
{
    constructor(model)
    {
        super(model);
    }

    setFromMapCell(mapcell)
    {
        super.setFromMapCell(mapcell);
    }

    draw()
    {
        super.draw()
        let pos = logical_to_drawing_postion_from_mapcell(this.currentCell());
        let rect =  new Rect(pos[0]+2,pos[1]+2,MapCell_Size-4,MapCell_Size-4)
        GAZCanvas.Rect(rect,'#ffff00',true);
    }
}

class GameAgent extends GameObject
{
    constructor(model)
    {
        super(model);
        //TBD
        this.pathAgent = new PathAgent(this);
        this.pathAgent.use4wayList = true;
        this.pathAgent.Init(this.currentCell(), new MapCell(19,11));
    }

    update()
    {
        super.update();
        this.pathAgent.update();
    }

    draw()
    {
        super.draw()
        let baddie_size = 16;
        let pos = logical_to_drawing_postion(this.logicalPosition.x,this.logicalPosition.y);

        pos[0] += ((MapCell_Size-baddie_size)/2);
        pos[1] += ((MapCell_Size-baddie_size)/2);

        let rect =  new Rect(pos[0],pos[1],baddie_size,baddie_size)
        GAZCanvas.Rect(rect,'#ff0000',true);

        let route = this.pathAgent.GetRoute();

        if(route !== undefined)
        {
            for(let i=0;i< route.length-1;i++)
            {
                let pos0 = logical_to_drawing_postion(route[i].x,route[i].y);

                pos0[0] += ((MapCell_Size)/2);
                pos0[1] += ((MapCell_Size)/2);

                let pos1 = logical_to_drawing_postion(route[i+1].x,route[i+1].y);

                pos1[0] += ((MapCell_Size)/2);
                pos1[1] += ((MapCell_Size)/2);

                GAZCanvas.Line(new Vector2(pos0[0], pos0[1]),new Vector2(pos1[0], pos1[1]),'#ff0000',2);
            }
        }
    }

    IsValidCell(cell)
    {
        if(cell.x < 0)  return false;
        if(cell.y < 0)  return false;

        if(cell.x > 19)  return false;
        if(cell.y > 11)  return false;

        return super.IsValidCell(cell);
    }

    IsValidTransition(start, target)
    {
        if(this.IsValidCell(target) === true)
        {
            return true;
        }

        return false;
    }

}

class Player extends GameObject
{
    constructor(model)
    {
        super(model);
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

        //if((new_pos.x !== this.logicalPosition.x) || (new_pos.y !== this.logicalPosition.y))
        {
            console.log(''+ new_pos.x +':'+new_pos.y);
            if(this.model.isValidLocation(new_pos.x, new_pos.y) && this.canMoveTo(new_pos.x, new_pos.y)===true)
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
                        this.model.removeOwner(this, pos);
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
                        this.model.setOwner(this, pos);
                    }
                }
            }
        }
    }

    draw()
    {
        super.draw()
        //let pos = logical_to_drawing_postion_from_mapcell(this.currentCell());
        let pos = logical_to_drawing_postion_from_mapcell(this.logicalPosition);
        let rect =  new Rect(pos[0]+8,pos[1]+8,MapCell_Size-16,MapCell_Size-16)
        GAZCanvas.Rect(rect,'#ffff00',true);
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

        for(let i=0;i< this.model.obstacles.length;i++)
        {
            this.model.obstacles[i].logicalPosition.clone();

            let obscollider = new PolyCollider();

            pos =  this.model.obstacles[i].logicalPosition.clone();

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
}

class Model
{
    constructor()
    {
        this.navgrid = new NavGrid();
        this.obstacles = [];
        this.baddies = [];
        this.player = undefined;
    }

    init()
    {
        this.navgrid.init(20,12);

        this.obstacles = [];

        if(true)
        {
            let cover = [[6,3],
                 [14,3],
                [14,8],[6,8]
             ];

            for (let i = 0; i < cover.length; i++)
            {
                let obstacle = new GameObstacle(this);

                obstacle.setFromMapCell(new MapCell(cover[i][0], cover[i][1]));
                this.obstacles.push(obstacle);
            }
        }

        this.baddies = [];

        let baddie = new GameAgent(this);
        baddie.setFromMapCell(new MapCell(0,0));
        this.baddies.push(baddie);

        this.player = new Player(this);
        this.player.setFromMapCell(new MapCell(10,6));
    }

    update()
    {
        for(let i=0;i< this.baddies.length;i++)
        {
            this.baddies[i].update();
        }

        for(let i=0;i< this.obstacles.length;i++)
        {
            this.obstacles[i].update();
        }

        this.player.update();
    }

    draw()
    {
        this.navgrid.draw();
        for(let i=0;i< this.baddies.length;i++)
        {
            this.baddies[i].draw();
        }

        for(let i=0;i< this.obstacles.length;i++)
        {
            //this.obstacles[i].draw();
        }

        this.player.draw();

        let ob = [];

        for(let i=0;i< this.obstacles.length;i++)
        {
            let pc = new PolyCollider();

            let pos =  this.obstacles[i].logicalPosition.clone();

            let edges = [];
            edges.push(new Vector2(pos.x,pos.y));
            edges.push(new Vector2(pos.x+1,pos.y));
            edges.push(new Vector2(pos.x+1,pos.y+1));
            edges.push(new Vector2(pos.x,pos.y+1));

            pc.init(edges);
            ob.push(pc);
        }

        for(let y=0;y<this.navgrid.grid.length; y++)
        {
            for(let x=0;x < this.navgrid.grid[y].length;x++)
            {
                let lc = new LineCollider();
                lc.init(x+0.5, y+0.5, this.player.logicalPosition.x+0.5, this.player.logicalPosition.y+0.5);

                let pos0 = logical_to_drawing_postion(lc.linelist[0].x0,lc.linelist[0].y0);
                let pos1 = logical_to_drawing_postion(lc.linelist[0].x1,lc.linelist[0].y1);

                let collision = false;
                for(let c=0;c<ob.length;c++)
                {
                    if(lc.collides(ob[c]))
                    {
                        collision = true;
                    }
                }

                if(collision === false)
                {
                    //GAZCanvas.Line(new Vector2(pos0[0], pos0[1]), new Vector2(pos1[0], pos1[1]),'#00ff00',2);
                }
                else
                {
                   // GAZCanvas.Line(new Vector2(pos0[0], pos0[1]), new Vector2(pos1[0], pos1[1]),'#ff0000',2);
                }


                let pos = logical_to_drawing_postion(x,y);
                let rect =  new Rect(pos[0],pos[1],MapCell_Size-1,MapCell_Size-1)
                //GAZCanvas.Text(12, collision.toString(), rect.getCentre(),'#ffffff','centre');

                if(collision === true)
                {
                    GAZCanvas.Rect(rect, '#7f0000', false, 3);
                }
            }
        }

    }

    setOwner(owner,mapcell)
    {
        if(this.navgrid.getCell(mapcell.x, mapcell.y).owner === -1)
        {
            this.navgrid.getCell(mapcell.x, mapcell.y).owner = owner.ID;
        }
    }

    removeOwner(owner,mapcell)
    {
        if(this.navgrid.getCell(mapcell.x, mapcell.y).owner === owner.ID)
        {
            this.navgrid.getCell(mapcell.x, mapcell.y).owner = -1;
        }
    }

    isValidLocation(x, y)
    {
        if(x < 0)  return false;
        if(y < 0)  return false;

        if(x > 19)  return false;
        if(y > 11)  return false;

        return true;
    }
}

/*
what do I want to do?
-space invader baddie movement
-move from cover to cover
 */
