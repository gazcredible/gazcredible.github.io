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
        worldPointList = [];
        localPointList = [];
        lineList = [];
    }
    
    setTransform(mat)
    {
        lineList = [];
        
        worldPointList= [];
        
        for(let i = 0;i< localPointList.length;i+=2)
        {
            var v0 = localPointList[i];
            var v1 = localPointList[i+1];
            
            v0 = mat.Transform(v0);
            v1 = mat.Transform(v1);
            
            var line = new ParametricLine();
            line.init(v0,v1);
            lineList.push(line);
            
            worldPointList.push(v0);
            worldPointList.push(v1);
        }
    }

    collides(obj, collisionList)
    {
        var bGotCollision = false;
    
        if (obj.GetType() == typeof(ManifoldCollider))
        {
            return obj.Collides(this, collisionList);
        }
        else
        {
            var result = new Vector2();
            
            for (let isrc = 0; isrc < obj.lineList.length; isrc++)
            {
                for (let idst = 0; idst < lineList.length; idst++)
                {
                    
                
                    if (obj.lineList[isrc].GetIntercept(lineList[idst], result))
                    {
                        if (collisionList == null)
                        {
                            return true;
                        }
                    
                        collisionList.push(result);
                    
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
        var j = worldPointList.length - 1;
        var oddNodes = false;
    
        for (i = 0; i < worldPointList.length; i++)
        {
            if ((worldPointList[i].y < pos.y && worldPointList[j].y >= pos.y)
                || (worldPointList[j].y < pos.y && worldPointList[i].y >= pos.y)
            )
            {
                if (worldPointList[i].x + (pos.y - worldPointList[i].y) / (worldPointList[j].y - worldPointList[i].y) * (worldPointList[j].x - worldPointList[i].x) < pos.x)
                {
                    oddNodes = !oddNodes;
                }
            }
            j = i;
        }
        
        return oddNodes;
    }

    draw(col)
    {
        if (worldPointList.Count == 0) return;
    
        for(let i = 0;i< localPointList.length;i+=2)
        {
            var v0 = worldPointList[i];
            var v1 = worldPointList[i+1];
        
            //DebugDraw.Get().Line2D(v0,v1,col);
        }
    }
}