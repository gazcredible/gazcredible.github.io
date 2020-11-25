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

    set(souce)
    {
        this.x = x;
        this.y = y;
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

    distance(source)
    {
        return Math.sqrt( Math.pow(this.x-source.x,2) + Math.pow(this.y - source.y,2));
    }

    toVector2()
    {
        return new Vector2(this.x, this.y);
    }
}

class MapCell extends IVector2
{
    constructor(x,y)
    {
        super();

        if(x !== undefined)
        {
            this.x = Math.floor(x);
            this.y = Math.floor(y);
        }
        else
        {
            this.x = 0;
            this.y = 0;
        }
    }

    clone()
    {
        return new MapCell(this.x,this.y);
    }

    toString()
    {
        return ''+ this.x +':'+this.y;
    }
}

let global_ID = 1;

class GameObject
{
    constructor()
    {
        this.logicalPosition = new Vector2(0,0);
        this.ID = global_ID;
        global_ID += 1;
    }

    update()
    {

    }

    IsValidCell(cell)
    {
        return model.isValidLocation(this, cell);
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

        model.setOwner(this,mapcell);
    }

    currentCell()
    {
        if(this.logicalPosition === undefined)
        {
            throw 'undefined pos!';
        }

        return new MapCell( Math.floor(this.logicalPosition.x), Math.floor(this.logicalPosition.y));
    }

    toString()
    {
        return 'GameObject';
    }
}
