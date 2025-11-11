import {Matrix, Rect, Vector2} from "./maths.ts";

export class CircularCollider
{
    position :Vector2;
    radius :number;

    constructor()
    {
        this.position = new Vector2();
        this.radius = 0;
    }

    set(position, radius)
    {
        this.setPosition(position);
        this.radius = radius;
    }

    setPosition(position)
    {
        this.position.set(position);
    }

    /*
        collides(CircularCollider) tests collider for overlap (intersection)
     */
    collides(collider)
    {
        return this.position.distance(collider.position) < (this.radius+collider.radius);
    }
}

let Matrix_Identity = new Matrix();

//rectcollider
export class RectCollider extends Rect
{
    /*
        RectCollider - AABB 2D rectangle
     */
    constructor()
    {
        super();
    }

    setPosition(position)
    {
        this.x = position.x;
        this.y = position.y;
    }

    /*
        collides(RectCollider collider)

        Does this collide with RectCollider?
    */
    collides(collider)
    {
        if (this.x >= (collider.x + collider.w)) return false;
        if (this.y >= (collider.y + collider.h)) return false;
        if ((this.x + this.w) <= collider.x) return false;
        if ((this.y + this.h) <= collider.y) return false;

        return true;
    }
}

export class ParametricLine
{
    x0;
    x1;
    y0;
    y1;

    constructor()
    {
        this.x0=0;
        this.x1=0;
        this.y0=0;
        this.y1=0;
    }

    init(start, end)
    {
        this.x0 = start.x;
        this.y0 = start.y;

        this.x1 = end.x;
        this.y1 = end.y;
    }

    getIntercept(line, intercept)
    {
        if ((line.x0 < Math.min(this.x0,this.x1)) && (line.x1 < Math.min(this.x0,this.x1))) return false;
        if ((line.x0 > Math.max(this.x0, this.x1)) && (line.x1 > Math.max(this.x0, this.x1))) return false;

        if ((line.y0 < Math.min(this.y0, this.y1)) && (line.y1 < Math.min(this.y0, this.y1))) return false;
        if ((line.y0 > Math.max(this.y0, this.y1)) && (line.y1 > Math.max(this.y0, this.y1))) return false;

        intercept.x = 0;
        intercept.y = 0;

        let a = this.x0;
        let c = this.x1 - this.x0;
        let d = line.x0;
        let f = line.x1 - line.x0;
        let g = this.y0;
        let h = this.y1 - this.y0;
        let i = line.y0;
        let j = line.y1 - line.y0;
        let k = ((j * c) - (f * h));

        if(Math.abs(k) < 0.001)	return false;

        let t = ((j * (d - a)) + (f * (g - i))) / k;

        if (t > 1 || t < 0) return false;

        intercept.x = this.x0 + t * (this.x1 - this.x0);
        intercept.y = this.y0 + t * (this.y1 - this.y0);

        if (Math.abs(line.x1 - line.x0) > 0)
        {
            t = (intercept.x - line.x0) / (line.x1 - line.x0);
        }
        else
        {
            t = (intercept.y - line.y0) / (line.y1 - line.y0);
        }

        if (t > 1 || t < 0) return false;

        return true;
    }
}

export class ColliderBase
{
    worldPointList;
    localPointList;
    lineList;

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
            let v0 = this.localPointList[i];
            let v1 = this.localPointList[i+1];

            v0 = mat.TransformVector2(v0);
            v1 = mat.TransformVector2(v1);

            let line = new ParametricLine();
            line.init(v0,v1);
            this.lineList.push(line);

            this.worldPointList.push(v0);
            this.worldPointList.push(v1);
        }
    }

    collides(obj, collisionList)
    {
        let bGotCollision = false;

        //console.log(obj.constructor.name );

        if (obj.constructor.name == ManifoldCollider.constructor.name)
        {
            return obj.Collides(this, collisionList);
        }
        else
        {
            let result = new Vector2(-1,-1);

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
        let i = 0;
        let j = this.worldPointList.length - 1;
        let oddNodes = false;

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

    draw(canvas, col,thickness)
    {
        if(thickness == undefined)
        {
            thickness = 1;
        }

        if (this.worldPointList.Count == 0) return;

        for(let i = 0;i< this.localPointList.length;i+=2)
        {
            let v0 = this.worldPointList[i];
            let v1 = this.worldPointList[i+1];

            canvas.Line(v0,v1,col,thickness);
        }
    }
}

export class PolyCollider extends ColliderBase
{

    constructor()
    {
        super();
    }

    initFromEdgeList(edgeList)
    {
        super.init();

        for(let i=0;i<edgeList.length;i++)
        {
            this.localPointList.push(edgeList[i]);
            this.localPointList.push(edgeList[(i+1)%edgeList.length]);
        }
    }
}

export class LineCollider extends ColliderBase
{
    constructor()
    {
        super();

    }

    initFromPoints(v0,v1)
    {
        super.init ();

        this.localPointList.push(v0);
        this.localPointList.push(v1);

        this.setTransform(Matrix_Identity);
    }
}

export class CircleCollider extends PolyCollider
{
    initCircleCollider(radius, segments)
    {
        if(segments == undefined)
        {
            segments = 32;
        }

        super.init();

        let polyList = [];

        for(let i=0;i<segments;i++)
        {
            let rad = new Vector2(radius,0);
            let rot = Matrix.CreateRotationZ(((2*Math.PI*i)/segments));

            polyList.push(rot.TransformVector2(rad));
        }

        super.initFromEdgeList(polyList);
    }
}

export class FenceCollider extends ColliderBase
{
    constructor()
    {
        super();
    }

    initFromFence(fence)
    {
        super.init();

        let v1 = new Vector2();
        let v2 = new Vector2();

        v1 = fence[0];

        for(let i=1;i<fence.length;i++)
        {
            v2 = fence[i];
            this.localPointList.push(v1);
            this.localPointList.push(v2);

            v1 = v2;
        }

        this.setTransform(Matrix_Identity);
    }

    isPointInMe(pos)
    {
        return false;
    }
}

export class ColliderHolder
{
    collider;
    transform;

    constructor(collider, xform)
    {
        this.collider = collider;
        this.transform = xform;
    }
}

export class ManifoldCollider extends ColliderBase
{
    colliderList;

    constructor()
    {
        super();
        this.colliderList = [];
    }

    addCollider(collider,transform)
    {
        this.colliderList.push(new ColliderHolder(collider,transform) );
    }


    setTransform(mat)
    {
        for(let i=0;i< this.colliderList;i++)
        {
            this.colliderList[i].collider.setTransform(this.colliderList[i] * mat);
        }
    }

    collides(obj, collisionList)
    {
        let bGotCollision = false;

        for(let i=0;i< this.colliderList;i++)
        {
            if (this.colliderList[i].collider.Collides(obj, collisionList) == true)
            {
                bGotCollision = true;
            }

            if ((collisionList == null) && (bGotCollision == true))
            {
                return true;
            }
        }

        return bGotCollision;
    }

    isPointInMe(pos)
    {
        for(let i=0;i< this.colliderList;i++)
        {
            if (this.colliderList[i].collider.isPointInMe(pos) == true) return true;
        }

        return false;
    }

    Draw(col)
    {
        for(let i=0;i< this.colliderList;i++)
        {
            this.colliderList[i].collider.Draw(col);
        }
    }
}

export class RectangleCollider extends PolyCollider
{
    constructor(width, height)
    {
        super();

        let polyList = [];
        polyList.push(new Vector2(-width/2,-height/2));
        polyList.push(new Vector2( width/2,-height/2));
        polyList.push(new Vector2( width/2, height/2));
        polyList.push(new Vector2(-width/2, height/2));

        super.initFromEdgeList(polyList);
    }
}