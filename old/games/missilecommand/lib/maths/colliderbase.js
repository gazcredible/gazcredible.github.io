class ColliderBase
{
    constructor()
    {
        this.worldPointList = [];
        this.localPointList = [];
        this.lineList = [];
    }
    
    
    init()
    {
        this.worldPointList = [];
        this.localPointList = [];
        this.lineList = [];
    }
    
    setTransform(mat)
    {
        this.lineList = [];

        this.worldPointList= [];
        
        for(let i = 0;i< this.localPointList.length-1;i+=2)
        {
            var v0 = this.localPointList[i];
            var v1 = this.localPointList[i+1];
            
            v0 = mat.TransformVector2(v0);
            v1 = mat.TransformVector2(v1);
            
            var line = new ParametricLine();
            line.init(v0,v1);
            this.lineList.push(line);

            this.worldPointList.push(v0);
            this.worldPointList.push(v1);
        }
    }

    collides(obj, collisionList)
    {
        var bGotCollision = false;

        //console.log(obj.constructor.name );

        if (obj.constructor.name == ManifoldCollider.constructor.name)
        {
            return obj.Collides(this, collisionList);
        }
        else
        {
            var result = new Vector2(-1,-1);
            
            for (let isrc = 0; isrc < obj.lineList.length; isrc++)
            {
                for (let idst = 0; idst < this.lineList.length; idst++)
                {
                    
                    if (obj.lineList[isrc].getIntercept(this.lineList[idst], result))
                    {
                        if (collisionList == null)
                        {
                            return true;
                        }
                    
                        collisionList.push(new Vector2(result.x,result.y));
                    
                        bGotCollision = true;
                    }
                }
            }
        }
        return bGotCollision;
    }

    isPointInMe(pos)
    {
        var i = 0;
        var j = this.worldPointList.length - 1;
        var oddNodes = false;
    
        for (i = 0; i < this.worldPointList.length; i++)
        {
            if ((this.worldPointList[i].y < pos.y && this.worldPointList[j].y >= pos.y)
                || (this.worldPointList[j].y < pos.y && this.worldPointList[i].y >= pos.y)
            )
            {
                if (this.worldPointList[i].x + (pos.y - this.worldPointList[i].y) / (this.worldPointList[j].y - this.worldPointList[i].y) * (this.worldPointList[j].x - this.worldPointList[i].x) < pos.x)
                {
                    oddNodes = !oddNodes;
                }
            }
            j = i;
        }
        
        return oddNodes;
    }

    draw(col,thickness)
    {
        if(thickness == undefined)
        {
            thickness = 1;
        }

        if (this.worldPointList.Count == 0) return;
    
        for(let i = 0;i< this.localPointList.length;i+=2)
        {
            var v0 = this.worldPointList[i];
            var v1 = this.worldPointList[i+1];

            GAZCanvas.Line(v0,v1,col,thickness);
        }
    }
}