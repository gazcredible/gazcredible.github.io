

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
    }

    getCell(x,y)
    {
        return this.grid[y][x];
    }

}

class GameObject
{
    constructor()
    {
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

    currentCell()
    {
        return new MapCell( Math.floor(this.logicalPosition.x), Math.floor(this.logicalPosition.y));
    }
}

class GameAgent extends GameObject
{
    constructor()
    {
        super();
        //TBD
        this.pathAgent = new PathAgent(this);
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
    }
}

class Model
{
    constructor()
    {
        this.navgrid = new NavGrid();

    }

    init()
    {
        this.navgrid.init(20,12);
        this.agent = new GameAgent();
    }

    update()
    {
        this.agent.update();
    }

    draw()
    {
        this.navgrid.draw();
        this.agent.draw();
    }
}
