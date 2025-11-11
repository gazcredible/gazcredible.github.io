
fourwayDirList = [new IVector2(-1, 0)
    ,new IVector2( 1, 0)
    ,new IVector2( 0,-1)
    ,new IVector2( 0, 1)
];

eightwayDirList = [new IVector2(-1, 0)
    ,new IVector2( 1, 0)
    ,new IVector2( 0,-1)
    ,new IVector2( 0, 1)
    ,new IVector2( 1, 1)
    ,new IVector2( -1, 1)
    ,new IVector2( 1, -1)
    ,new IVector2( -1, -1)
];



class PathNode
{
    constructor(parent, cell, target)
    {
        this.cellReference = new MapCell(cell.x,cell.y); //mapcell
        this.parent = undefined; //pathnode
        this.costToHere = 0.0;
        this.costToTarget = 0.0;

        this.parent = parent;

        if(this.parent !== undefined)
        {
            this.costToHere = this.parent.G() + 10;
        }

        this.costToTarget = (Math.abs(this.cellReference.x - target.x) + Math.abs(this.cellReference.y - target.y)) * 10;
    }

    G()
    {
        return this.costToHere;
    }

    H()
    {
        return this.costToTarget;
    }

    F()
    {
        return this.G() + this.H();
    }

    IsComplete()
    {
        return this.H() == 0;
    }

    toString()
    {
        return this.cellReference.toString();
    }

    Cell()
    {
        return this.cellReference;
    }
}

class PathAgent
{
    constructor(owner)
    {
        this.openList = new Array(); //new LinkedList<PathNode>();
        this.closedList = {}; //new Dictionary<MapCell,int>();

        this.owner = owner;
        this.use4wayList = false;
        //this.use4wayList = true;

        this.pathRoute = new Array();//new List<MapCell>();
        this.openList = new Array();//LinkedList<PathNode> ;
        this.closedList = {}; //Dictionary<MapCell,int>;

        this.startNode = undefined; //PathNode
        this.target = undefined; //MapCell;
        this.update_step = 20;

        this.Reset();
    }

    init(start, target)
    {

        this.update_step = 20;

        if ( (this.owner.IsValidCell(target) == false)
            ||(start.Equals(target) == true)
        )
        {
            console.log('Can\'t RF from here');
            return;
        }

        if ( (target === undefined)
            ||(start === undefined)
            ||(this.target === undefined)
            ||(this.target.Equals(target) === false)
            ||(this.pathRoute.length === 0)
            ||(this.pathRoute[0].Equals(start) === false)
        )
        {
            this.Reset(); // clear out any old routing
            this.target = target;
            this.startNode = new PathNode(undefined, start, target);

            this.closedList[this.startNode.Cell] = 0;
            this.AddNodes(this.startNode, this.target);
        }

        this.update();
    }

    Reset()
    {
        this.pathRoute = new Array();
        this.openList = new Array();
        this.closedList = {};
    }

    IsInClosedList(cell)
    {
        return cell in this.closedList;
    }

    IsInOpenList(cell)
    {
        for(let i=0;i< this.openList.length;i++)
        {
            if (this.openList[i].Cell().Equals(cell) === true)
            {
                return true;
            }
        }

        return false;
    }

    canReachTarget()
    {
        let best = this.GetBestPartialRoute();

        if (best != null)
        {
            return best.IsComplete();
        }

        return false;
    }

    ReInit(start)
    {
        if (start != this.target)
        {
            this.init(start, this.target);
        }
        else
        {
            this.pathRoute.Clear();
        }
    }



    AddNodes(current, target)
    {
        let cell = new MapCell();

        let routelist = eightwayDirList;

        if (this.use4wayList === true)
        {
            routelist = fourwayDirList;
        }

        for(let i=0;i<routelist.length;i++)
        {
            cell.x = current.Cell().x + routelist[i].x;
            cell.y = current.Cell().y + routelist[i].y;

            if (this.owner.IsValidTransition(current.Cell, cell) == true)
            {
                if (this.IsInClosedList(cell) == false)
                {
                    if (this.IsInOpenList(cell) == false)
                    {
                        // if not on open list
                        this.openList.unshift(new PathNode(current, cell, target));
                    }
                }
            }
        }
    }

    GetBestPartialRoute()
    {
        let lowestF = 999999.99;
        let best = undefined;

        for(let i=0;i< this.openList.length;i++)
        {
            if (this.openList[i].F() < lowestF)
            {
                lowestF = this.openList[i].F();
                best = this.openList[i];
            }
        }

        return best;
    }

    update()
    {
        if(this.target === undefined)
        {
            console.log('no valid target');

            return;
        }

        for (let i = 0; i < this.update_step; i++)
        {
            if (this.owner.currentCell().Equals(this.target) === false)
            {
                let best = this.GetBestPartialRoute();

                if (best !== undefined)
                {
                    if (best.H() > 0)
                    {
                        //make a new open list without best and
                        let new_openlist = [];
                        for(let entry = 0; entry < this.openList.length;entry++)
                        {
                            if( this.openList[entry] !== best)
                            {
                                new_openlist.push(this.openList[entry]);
                            }
                        }
                        if(this.openList.length === new_openlist.length)
                        {
                            throw "Didn't remove entry!";
                        }

                        this.openList = new_openlist;

                        this.closedList[best.Cell] = 0;

                        this.AddNodes(best, this.target);
                    }

                    if (best.IsComplete() === true)
                    {
                        this.pathRoute = this.GetRoute();
                        return;
                    }
                }
            }
        }
    }

    GetNextNode(currentCell)
    {
        let cell = new MapCell(-1,-1)

        let best = this.GetBestPartialRoute();

        if (best == null)
        {
            return cell;
        }

        let node = best;

        while(node.parent != null)
        {
            if (node.parent.cellReference == currentCell)
            {
                cell = node.cellReference;
                return true;
            }

            node = node.parent;
        }
        return cell;
    }

    //get array of mapcells for route
    GetRoute()
    {
        let route = [];

        if( (this.target === undefined)
            ||(this.owner.currentCell().Equals(this.target) === true)
        )
        {
            return undefined;
        }

        let best = this.GetBestPartialRoute();

        if (best === undefined) return false;

        let node = best;

        while (node != null)
        {
            let cell = node.cellReference;
            route.push(cell);
            node = node.parent;
        }

        return route.reverse();
    }
}
