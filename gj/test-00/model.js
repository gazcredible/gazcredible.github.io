

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
    return [offset.x +(x*MapCell_Size),offset.y+(y*MapCell_Size),MapCell_Size-1,MapCell_Size-1];
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
                GAZCanvas.Rect(rect,'#ffffff',false,1);
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

class GameObject
{
    constructor(model)
    {
        this.model = model;
        this.logicalPosition = new Vector2(0,0);
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

class Model
{
    constructor()
    {
        this.navgrid = new NavGrid();
        this.obstacles = [];
        this.baddies = [];
    }

    init()
    {
        this.navgrid.init(20,12);

        this.obstacles = [];

        for(let x=0;x<10;x++)
        {
            let obstacle = new GameObstacle(this);

            obstacle.setFromMapCell(new MapCell(x, 5));
            this.obstacles.push(obstacle);
        }


        for(let x=7;x<20;x++)
        {
            let obstacle = new GameObstacle(this);

            obstacle.setFromMapCell(new MapCell(x, 8));
            this.obstacles.push(obstacle);
        }


        this.baddies = [];

        let baddie = new GameAgent(this);
        this.baddies.push(baddie);
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
            this.obstacles[i].draw();
        }
    }
}
