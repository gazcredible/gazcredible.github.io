class Random
{
    constructor(value)
    {
       this.seed = 0;
       this.currentValue = 0;

        this.init(value);
    }

    init(value)
    {
        this.seed = value;
        this.currentValue = this.seed;
    }

    next()
    {
        this.currentValue += this.seed;
        this.currentValue ^= 353562;

        return this.currentValue;
    }

    reset()
    {
        this.currentValue = this.seed;
    }

    getInt(min, max)
    {
        if (min == max) return min;

        var val = this.next() % 10000;

        return Math.floor(((val / 10000.0) * (max - min)) + min);
    }

    getFloat(min, max)
    {
        if (min == max) return min;

        var val = this.next() % 10000;

        return (((val / 10000.0) * (max - min)) + min);
    }
}

//vector2
class Vector2
{
    /*
        Vector2 - Standard Vector2 class
     */
    constructor(x,y)
    {
        this.x = 0;
        this.y = 0;

        if(x != undefined)
        {
            this.x = x;
        }

        if(y != undefined)
        {
            this.y = y;
        }
    }

    set(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
    }

    clone()
    {
        return new Vector2(this.x,this.y);
    }

    normalize()
    {
        var length = this.length();

        this.x/= length;
        this.y/= length;
    }

    distance(v0)
    {
        return Math.sqrt(Math.pow(this.x-v0.x,2) + Math.pow(this.y-v0.y,2));
    }
    length()
    {
        return Math.sqrt((this.x*this.x) + (this.y*this.y));
    }

    static normal(vec)
    {
        var result = new Vector2(refIn);

        result.normalize();

        return result;
    }

    static Dot(v0,v1)
    {
        return (v0.x * v1.x) + (v0.y * v1.y);
    }

    toString()
    {
        return ""+this.x.toFixed(2)+ ":" + this.y.toFixed(2);
    }
}


//vector3
class Vector3
{
    /*
        Vector3 - Standard Vector3 class
     */

    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    Set(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }

    Normalize()
    {
        var length = Length();

        this.x/= length;
        this.y/= length;
        this.z/= length;
    }

    Length()
    {
        return Math.sqrt((this.x*this.x) + (this.y*this.y) + (this.z*this.z));
    }

    static Normal(vec)
    {
        var result = new Vector3(refIn);

        result.Normalize();

        return result;
    }

    static Cross(v0,v1)
    {
        var result = new Vector3();

        result.x = v0.y * v1.z - v0.z * v1.y;
        result.y = v0.z * v1.x - v0.x * v1.z;
        result.z = v0.x * v1.y - v0.y * v1.x;

        return result;
    }

    static Dot(v0,v1)
    {
        return (v0.x * v1.x) + (v0.y * v1.y) + (v0.z * v1.z);
    }
}

//vector4
class Vector4
{
    /*
        Vector4 - Standard Vector4 class
     */
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
    }
}

//matrix
class Matrix
{
    /*
        Matrix - Standard math Matrix 4x4 class and associated methods

        This is a webgl matrix wrapper with metrix defined as Float32Array()

        Matrix functions are defined following XNA/Monogame nomenclature
        i.e. static functions that return matrix objects

        TransformVector2, TransformVector3 & TransformVector4 will transform vectors
     */
    constructor()
    {
        this.m = new Float32Array(16);

        this.m[0] = this.m[5] = this.m[10] = this.m[15] = 1;
    }

    static CreateTranslation(x, y, z)
    {
        var m = new Matrix();

        m.m[12] = x;
        m.m[13] = y;
        m.m[14] = z;

        return m;
    }

    static CreateScale(x, y, z)
    {
        var m = new Matrix();

        m.m[0] = x;
        m.m[5] = y;
        m.m[10] = z;

        return m;
    }

    static CreateRotationX(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[5] = cos; m.m[6] = sin;
        m.m[9] = -sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationY(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = -sin;
        m.m[8] = sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationZ(angle)
    {
        var m = new Matrix();

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = sin;
        m.m[4] = -sin; m.m[5] = cos;

        return m;
    }

    TransformVector2(v0)
    {
        var result = new Vector2();

        result.x = (v0.x * this.m[0]) + (v0.y * this.m[4]) + this.m[12];
        result.y = (v0.x * this.m[1]) + (v0.y * this.m[5])+ this.m[13];

        return result;
    }

    TransformVector3(v0)
    {
        var result = new Vector3();

        result.x = (v0.x * m.m[0]) + (v0.y * m.m[4]) + (v0.z * m.m[8]);
        result.y = (v0.x * m.m[1]) + (v0.y * m.m[5]) + (v0.z * m.m[9]);
        result.z = (v0.x * m.m[2]) + (v0.y * m.m[6]) + (v0.z * m.m[10]);

        return result;
    }

    TransformVector4(v0)
    {
        var result = new Vector4();

        result.x = (v0.x * m.m[0]) + (v0.y * m.m[4]) + (v0.z * m.m[8]) + (v0.w *m.m[12]);
        result.y = (v0.x * m.m[1]) + (v0.y * m.m[5]) + (v0.z * m.m[9]) + (v0.w *m.m[13]);
        result.z = (v0.x * m.m[2]) + (v0.y * m.m[6]) + (v0.z * m.m[10]) + (v0.w *m.m[14]);
        result.w = (v0.x * m.m[3]) + (v0.y * m.m[7]) + (v0.z * m.m[11]) + (v0.w *m.m[15]);

        return result;
    }

    static Multiply(src, rMat)
    {
        var result = new Matrix();

        result.m[0] = src.m[0] * rMat.m[0] + src.m[1] * rMat.m[4] + src.m[2] * rMat.m[8] + src.m[3] * rMat.m[12];
        result.m[1] = src.m[0] * rMat.m[1] + src.m[1] * rMat.m[5] + src.m[2] * rMat.m[9] + src.m[3] * rMat.m[13];
        result.m[2] = src.m[0] * rMat.m[2] + src.m[1] * rMat.m[6] + src.m[2] * rMat.m[10] + src.m[3] * rMat.m[14];
        result.m[3] = src.m[0] * rMat.m[3] + src.m[1] * rMat.m[7] + src.m[2] * rMat.m[11] + src.m[3] * rMat.m[15];

        result.m[4] = src.m[4] * rMat.m[0] + src.m[5] * rMat.m[4] + src.m[6] * rMat.m[8] + src.m[7] * rMat.m[12];
        result.m[5] = src.m[4] * rMat.m[1] + src.m[5] * rMat.m[5] + src.m[6] * rMat.m[9] + src.m[7] * rMat.m[13];
        result.m[6] = src.m[4] * rMat.m[2] + src.m[5] * rMat.m[6] + src.m[6] * rMat.m[10] + src.m[7] * rMat.m[14];
        result.m[7] = src.m[4] * rMat.m[3] + src.m[5] * rMat.m[7] + src.m[6] * rMat.m[11] + src.m[7] * rMat.m[15];

        result.m[8] = src.m[8] * rMat.m[0] + src.m[9] * rMat.m[4] + src.m[10] * rMat.m[8] + src.m[11] * rMat.m[12];
        result.m[9] = src.m[8] * rMat.m[1] + src.m[9] * rMat.m[5] + src.m[10] * rMat.m[9] + src.m[11] * rMat.m[13];
        result.m[10] = src.m[8] * rMat.m[2] + src.m[9] * rMat.m[6] + src.m[10] * rMat.m[10] + src.m[11] * rMat.m[14];
        result.m[11] = src.m[8] * rMat.m[3] + src.m[9] * rMat.m[7] + src.m[10] * rMat.m[11] + src.m[11] * rMat.m[15];

        result.m[12] = src.m[12] * rMat.m[0] + src.m[13] * rMat.m[4] + src.m[14] * rMat.m[8] + src.m[15] * rMat.m[12];
        result.m[13] = src.m[12] * rMat.m[1] + src.m[13] * rMat.m[5] + src.m[14] * rMat.m[9] + src.m[15] * rMat.m[13];
        result.m[14] = src.m[12] * rMat.m[2] + src.m[13] * rMat.m[6] + src.m[14] * rMat.m[10] + src.m[15] * rMat.m[14];
        result.m[15] = src.m[12] * rMat.m[3] + src.m[13] * rMat.m[7] + src.m[14] * rMat.m[11] + src.m[15] * rMat.m[15];

        return result;
    }

    static CreateLookAt(Eye, At, Up)
    {
        var m = new Matrix();

        var zaxis = Vector3.Normal(Eye - At);
        var xaxis = Vector3.Normal(Vector3.Cross(Up, zaxis));
        var yaxis = Vector3.Cross(zaxis, xaxis);

        m.m[0] = xaxis.x; m.m[1] = yaxis.x; m.m[2] = zaxis.x; m.m[3] = 0;
        m.m[4] = xaxis.y; m.m[5] = yaxis.y; m.m[6] = zaxis.y; m.m[7] = 0;
        m.m[8] = xaxis.z; m.m[9] = yaxis.z; m.m[10] = zaxis.z; m.m[11] = 0;
        m.m[12] = -Vector3.Dot(xaxis, Eye); m.m[13] = -Vector3.Dot(yaxis, Eye); m.m[14] = -Vector3.Dot(zaxis, Eye); m.m[15] = 1.0;

        return m;
    }


    static CreatePerspectiveFieldOfView(fov, aspectratio, nearPlane, farPlane)
    {
        var m = new Matrix();

        var f = 1.0 / Math.tan(fov / 2.0);

        m.m[0]  = f / aspectratio;   m.m[1]  = 0.0;  m.m[2]  = 0.0;                                              m.m[3]  =  0.0;
        m.m[4]  = 0.0;               m.m[5]  = f;    m.m[6]  = 0.0;                                              m.m[7]  =  0.0;
        m.m[8]  = 0.0;               m.m[9]  = 0.0;  m.m[10] = -(farPlane / (farPlane-nearPlane));                m.m[11] = -1.0;
        m.m[12] = 0.0;               m.m[13] = 0.0;  m.m[14] = -(nearPlane * farPlane) / (farPlane-nearPlane);  m.m[15] =  0.0;

        return m;
    }

    static CreateOrthoOffCenter(left, right, bottom, top, nearPlane, farPlane)
    {
        var m = new Matrix();

        m.m[0] = 2 / (right - left);
        m.m[1] = 0;
        m.m[2] = 0;
        m.m[3] = 0;

        m.m[4] = 0;
        m.m[5] = 2 / (top - bottom);
        m.m[6] = 0;
        m.m[7] = 0;

        m.m[8] = 0;
        m.m[9] = 0;
        m.m[10] = 1 / (farPlane - nearPlane);
        m.m[11] = nearPlane / (farPlane - nearPlane);

        m.m[12] = -1;
        m.m[13] = 1;
        m.m[14] = 0;
        m.m[15] = 1;

        return m;
    }
}

//rect
/**
 * Created by gareth on 04/06/2018.
 */

class Rect
{
    /*
        Rect - 2D rectangle of x,y,width & height
     */
    constructor(x,y,w,h)
    {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;

        if(x != undefined)
        {
            this.x = x;
        }

        if(y != undefined)
        {
            this.y = y;
        }

        if(w != undefined)
        {
            this.w = w;
        }

        if(h != undefined)
        {
            this.h = h;
        }
    }

    set(x,y,w,h)
    {
        if(x != undefined)
        {
            this.x = x;
        }

        if(y != undefined)
        {
            this.y = y;
        }

        if(w != undefined)
        {
            this.w = w;
        }

        if(h != undefined)
        {
            this.h = h;
        }
    }

    isInMe(inVal)
    {
        if(inVal !== undefined)
        {
            if( (inVal.x >= this.x) && (inVal.x < (this.x + this.w)) && (inVal.y >= this.y) && (inVal.y < (this.y + this.h)) )
            {
                return true;
            }
        }

        return false;
    }

    getCentre()
    {
        return new Vector2(this.x+(this.w/2),this.y+(this.h/2));
    }
}

class Size
{
    /*
        Size - Size class (width, height)
     */
    constructor(inW, inH)
    {
        if (inW !== undefined)
        {
            this.w = inW;
            this.h = inH;
        }
        else
        {
            this.w = this.h = 0;
        }
    }
}

//circularcollider
class CircularCollider
{
    /*
        Circular collider - circle based collision detection
     */
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

Matrix_Identity = new Matrix();

//rectcollider
class RectCollider extends Rect
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

class ParametricLine
{
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

        var a = this.x0;
        var c = this.x1 - this.x0;
        var d = line.x0;
        var f = line.x1 - line.x0;
        var g = this.y0;
        var h = this.y1 - this.y0;
        var i = line.y0;
        var j = line.y1 - line.y0;
        var k = ((j * c) - (f * h));

        if(Math.abs(k) < 0.001)	return false;

        var t = ((j * (d - a)) + (f * (g - i))) / k;

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

class PolyCollider extends ColliderBase
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

class LineCollider extends ColliderBase
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

class CircleCollider extends PolyCollider
{
    initCircleCollider(radius, segments)
    {
        if(segments == undefined)
        {
            segments = 32;
        }

        super.init();

        var polyList = [];

        for(let i=0;i<segments;i++)
        {
            var rad = new Vector2(radius,0);
            var rot = Matrix.CreateRotationZ(((2*Math.PI*i)/segments));

            polyList.push(rot.TransformVector2(rad));
        }

        super.initFromEdgeList(polyList);
    }
}

class FenceCollider extends ColliderBase
{
    constructor()
    {
        super();
    }

    initFromFence(fence)
    {
        super.init();

        var v1 = new Vector2();
        var v2 = new Vector2();

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

class ColliderHolder
{
    constructor(collider, xform)
    {
        this.collider = collider;
        this.transform = xform;
    }
}

class ManifoldCollider extends ColliderBase
{
    constructor()
    {
        super();
        this.colliderList = [];
    }

    addCollider(collider,transform)
    {
        colliderList.push(new ColliderHolder(collider,transform) );
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
        var bGotCollision = false;

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
            this.colliderList[i].collider.Draw(c);
        }
    }
}

class RectangleCollider extends PolyCollider
{
    constructor(width, height)
    {
        super();

        var polyList = [];
        polyList.push(new Vector2(-width/2,-height/2));
        polyList.push(new Vector2( width/2,-height/2));
        polyList.push(new Vector2( width/2, height/2));
        polyList.push(new Vector2(-width/2, height/2));

        super.initFromEdgeList(polyList);
    }
}


//keycodes
/*
    input_keycode.js - keyboard lookups for Input.getKeyState()
 */

const KEYCODE_backspace = 8;
const KEYCODE_tab     =9;
const KEYCODE_enter   =13;
const KEYCODE_shift   =16;
const KEYCODE_ctrl    =17;
const KEYCODE_alt     =18;
const KEYCODE_pause_break     =19;
const KEYCODE_caps_lock =   20;
const KEYCODE_escape  =27;
const KEYCODE_space_bar =    32;
const KEYCODE_page_up =    33;
const KEYCODE_page_down =  34;
const KEYCODE_end     =35;
const KEYCODE_home    =36;
const KEYCODE_left_arrow  =37;
const KEYCODE_up_arrow    =38;
const KEYCODE_right_arrow     =39;
const KEYCODE_down_arrow  =40;
const KEYCODE_insert  =45;
const KEYCODE_delete  =46;
const KEYCODE_0   =48;
const KEYCODE_1   =49;
const KEYCODE_2   =50;
const KEYCODE_3   =51;
const KEYCODE_4   =52;
const KEYCODE_5   =53;
const KEYCODE_6   =54;
const KEYCODE_7   =55;
const KEYCODE_8   =56;
const KEYCODE_9   =57;
const KEYCODE_a   =65;
const KEYCODE_b   =66;
const KEYCODE_c   =67;
const KEYCODE_d   =68;
const KEYCODE_e   =69;
const KEYCODE_f   =70;
const KEYCODE_g   =71;
const KEYCODE_h   =72;
const KEYCODE_i   =73;
const KEYCODE_j   =74;
const KEYCODE_k   =75;
const KEYCODE_l   =76;
const KEYCODE_m   =77;
const KEYCODE_n   =78;
const KEYCODE_o   =79;
const KEYCODE_p   =80;
const KEYCODE_q   =81;
const KEYCODE_r   =82;
const KEYCODE_s   =83;
const KEYCODE_t   =84;
const KEYCODE_u   =85;
const KEYCODE_v   =86;
const KEYCODE_w   =87;
const KEYCODE_x   =88;
const KEYCODE_y   =89;
const KEYCODE_z   =90;
const KEYCODE_left_window_key     =91;
const KEYCODE_right_window_key    =92;
const KEYCODE_select= 93;
const KEYCODE_numpad_0    =96;
const KEYCODE_numpad_1    =97;
const KEYCODE_numpad_2    =98;
const KEYCODE_numpad_3    =99;
const KEYCODE_numpad_4    =100;
const KEYCODE_numpad_5    =101;
const KEYCODE_numpad_6    =102;
const KEYCODE_numpad_7    =103;
const KEYCODE_numpad_8    =104;
const KEYCODE_numpad_9    =105;
const KEYCODE_multiply    =106;
const KEYCODE_add     =107;
const KEYCODE_subtract    =109;
const KEYCODE_decimal_point   =110;
const KEYCODE_divide  =111;
const KEYCODE_f1  =112;
const KEYCODE_f2  =113;
const KEYCODE_f3  =114;
const KEYCODE_f4  =115;
const KEYCODE_f5  =116;
const KEYCODE_f6  =117;
const KEYCODE_f7  =118;
const KEYCODE_f8  =119;
const KEYCODE_f9  =120;
const KEYCODE_f10     =121;
const KEYCODE_f11     =122;
const KEYCODE_f12     =123;
const KEYCODE_num_lock    =144;
const KEYCODE_scroll_lock     =145;
const KEYCODE_semi_colon  =186;
const KEYCODE_equals  =187;
const KEYCODE_comma   =188;
const KEYCODE_dash    =189;
const KEYCODE_period  =190;
const KEYCODE_forward_slash   =191;
const KEYCODE_grave_accent    =192;
const KEYCODE_open_bracket    =219;
const KEYCODE_back_slash  =220;
const KEYCODE_close_braket    =221;
const KEYCODE_single_quote    =222;


//input
const INPUT_NOT_PRESSED = 'not_pressed';
const INPUT_PRESSED = 'pressed';
const INPUT_HELD = 'held';
const INPUT_RELEASED = 'released';

class InputClass
{
    /*
        This is my wrapper for resolution-independent input functionality.

        It assumes GAZCanvas is defined (gazcanvas.js)

        Usage:
            Provides user input (keyboard & mouse) with resolution dependent mouse positions based on GAZCanvas
            (see GAZCanvas).

            Input devices will return INPUT_NOT_PRESSED, INPUT_PRESSED, INPUT_HELD & INPUT_RELEASED

            Mouse will return off screen when pointer is outside of GAZCanvas space

            call Input.upate() per frame

            Input.getKeystate(key) where key is defined in input_keycode.js

        see:

     */

    constructor()
    {
        this.mouseLogicalPos = new Vector2();
        this.mouseAbsolutePos = new Vector2();

        this.currentKeyState = new Array(256);
        this.oldKeyState = new Array(256);
        this.rawKeyState = new Array(256);

        for(let i=0;i<256;i++)
        {
            this.currentKeyState[i] = INPUT_NOT_PRESSED;
            this.oldKeyState[i] = this.currentKeyState[i];
            this.rawKeyState[i] = '';
        }

        this.mouseRawState = '';
        this.currentMouseState = INPUT_NOT_PRESSED;
        this.oldMouseState = this.currentMouseState;
    }

    // Callbacks for EventListeners

    onMouseMove(event)
    {
        Input.mouseLogicalPos = Input.getMousePos(event);
    }

    onMouseDown(event)
    {
        Input.mouseDown = true;
        Input.mouseLogicalPos = Input.getMousePos(event);

        Input.mouseRawState = 'down';
    }

    onTouchStart(event)
    {
        Input.mouseDown = true;
        Input.mouseLogicalPos.x  = event.touches[0].clientX;
        Input.mouseLogicalPos.y  = event.touches[0].clientY;

        Input.mouseRawState = 'down';
    }

    onTouchMove(event)
    {
        Input.mouseLogicalPos.x  = event.touches[0].clientX;
        Input.mouseLogicalPos.y  = event.touches[0].clientY;
    }

    onTouchEnd(event)
    {
        Input.mouseLogicalPos.x  = event.touches[0].clientX;
        Input.mouseLogicalPos.y  = event.touches[0].clientY;

        Input.mouseDown = false;
        Input.mouseRawState = 'up';
    }

    onMouseUp(event)
    {
        Input.mouseDown = false;
        Input.mouseLogicalPos = Input.getMousePos(event);

        Input.mouseRawState = 'up';
    }

    onKeyDown(event)
    {
        Input.rawKeyState[event.keyCode] = 'down';
    }

    onKeyUp(event)
    {
        Input.rawKeyState[event.keyCode] = 'up';
    }

    getMousePos(event)
    {
        let rawMousePos = new Vector2(event.pageX, event.pageY);

        this.mouseAbsolutePos.set(rawMousePos);

        let screenRect = new Rect();
        screenRect.set(0,0,GAZCanvas.referenceScreenSize.w,GAZCanvas.referenceScreenSize.h);
        screenRect = GAZCanvas.toScreenSpace(screenRect);

        if(screenRect.isInMe(rawMousePos) === true)
        {
            // convert screen space to renderspace
            rawMousePos.x -= screenRect.x;
            rawMousePos.y -= screenRect.y;

            rawMousePos.x /= screenRect.w;
            rawMousePos.y /= screenRect.h;

            rawMousePos.x *= GAZCanvas.referenceScreenSize.w;
            rawMousePos.y *= GAZCanvas.referenceScreenSize.h;

            return rawMousePos;
        }
        return undefined;
    }

    getKeystate(key)
    {
        return this.currentKeyState[key];
    }

    update()
    {
        if(this.mouseLogicalPos === undefined)
        {
            this.mouseDown = false;
            this.oldMouseEvent = false;

            this.currentMouseState = INPUT_NOT_PRESSED;
            this.oldMouseState = this.currentMouseState;
        }
        else
        {
            this.oldMouseEvent = this.mouseDown;
            this.oldMouseState = this.currentMouseState;

            this.currentMouseState = this._processState(this.currentMouseState, this.mouseRawState);
            this.mouseRawState = '';
        }

        for(let i=0;i<256;i++)
        {
            this.currentKeyState[i] = this._processState(this.currentKeyState[i], this.rawKeyState[i]);
            this.rawKeyState[i] = '';
        }
    }

    _processState(thing, state)
    {
        switch(thing)
        {
            case INPUT_PRESSED:
            {
                if (state === 'up')
                {
                    return INPUT_RELEASED;
                }
                else
                {
                    return INPUT_HELD;
                }
            }
                break;

            case INPUT_HELD:
            {
                if (state === 'up')
                {
                    return INPUT_RELEASED;
                }

                return INPUT_HELD;
            }
                break;

            case INPUT_RELEASED:
            {
                if (state === 'down')
                {
                    return INPUT_PRESSED;
                }

                return INPUT_NOT_PRESSED;
            }
                break;

            case INPUT_NOT_PRESSED:
            {
                if (state === 'down')
                {
                    return INPUT_PRESSED;
                }
            }
                break;
        }

        return INPUT_NOT_PRESSED;
    }
}

Input = new InputClass();

window.addEventListener('mousemove',Input.onMouseMove);
window.addEventListener('mouseup',Input.onMouseUp);
window.addEventListener('mousedown',Input.onMouseDown);

window.addEventListener('keydown',Input.onKeyDown);
window.addEventListener('keyup',Input.onKeyUp);


window.addEventListener('touchstart',Input.onTouchStart);
window.addEventListener('touchmove',Input.onTouchMove);
window.addEventListener('touchend',Input.onTouchEnd);

//canvas
class baseCanvas
{
    /*
        This is my wrapper for canvas functionality.

        It assumes the canvas component is called 'canvas' in the index.html file

        Is implemented as global Canvas object, defined at end of file

        Usage:
            Canvas.Line(...)

        see:
            https://www.w3schools.com/tags/ref_canvas.asp
     */
    constructor()
    {
    }

    // ctx() - return the 2D canvas context
    ctx()
    {
        var canvas = document.getElementById("canvas");
        return canvas.getContext("2d");
    }

    /*
        Line(vector2 start, vector2 end, string inColour, float inWidth)

        This will draw a line between start and end

        inWidth is optional
     */
    Line(start,end,inColour,inWidth)
    {
        this.ctx().beginPath();
        if(inWidth == undefined)
        {
            this.ctx().lineWidth = 1;
        }
        else
        {
            this.ctx().lineWidth = inWidth;
        }
        this.ctx().strokeStyle = inColour;
        this.ctx().moveTo(start.x,start.y);
        this.ctx().lineTo(end.x,end.y);
        this.ctx().stroke();
    }

    /*
        Text(float inSize,string inString, vector2 inPos, string inColour, string inJustification,string font)

        This will draw text in the canvas, see:
            https://www.w3schools.com/tags/canvas_filltext.asp
            https://www.w3schools.com/tags/canvas_textalign.asp

            inJustification - 'start', 'left', 'centre', 'end', 'right'
     */
    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        if(font == undefined)
        {
            this.ctx().font = inSize +"px san-serif";
        }
        else
        {
            this.ctx().font = inSize +"px "+font;//Archivo Black";
        }
        this.ctx().textAlign = inJustification;
        this.ctx().fillStyle = inColour;

        if(inJustification == 'center')
        {
            this.ctx().fillText(inString,inPos.x,inPos.y+(inSize/4));
        }
        else
        {
            this.ctx().fillText(inString,inPos.x,inPos.y);
        }
    }

    /*
        Rect(Rect inRect,string inColour, bool inFilled, float inWidth)

        Draw Rectangle
            inRect      - containing rectangle (see rect.js)
            inColour    - RGB colour as string
            inFilled    - optional bool, whether rectangle is filled our outline only
            inWidth     - optional float, thickness of outline
        see:
            https://www.w3schools.com/tags/canvas_fillrect.asp
            https://www.w3schools.com/tags/canvas_strokerect.asp
     */
    Rect(inRect,inColour, inFilled,inWidth)
    {
        if(inWidth !== undefined)
        {
            this.ctx().lineWidth = inWidth;
        }
        else
        {
            this.ctx().lineWidth = 1;
        }

        if((inFilled === undefined) || (inFilled === true))
        {
            this.ctx().fillStyle = inColour;

            this.ctx().fillRect(inRect.x, inRect.y, inRect.w, inRect.h);
        }
        else
        {
            this.ctx().strokeStyle = inColour;
            this.ctx().strokeRect(inRect.x, inRect.y, inRect.w, inRect.h);
        }
    }

    /*
        Sprite(image,inRect,uvRect)

        Draw rectangle with texture (or texture region)
            image   - Image() object
            inRect  - containing rectangle (see rect.js)
            uVRect  - (optional) texture co-ordinates in pixels
                      if ommitted, full image will be drawn
        see:
            https://www.w3schools.com/tags/canvas_drawimage.asp
     */
    Sprite(image,inRect,uvRect)
    {
        if((image != null) && (image.width >0))
        {
            if(uvRect == undefined)
            {
                this.ctx().drawImage(image
                    ,Math.floor(inRect.x)
                    ,Math.floor(inRect.y)
                    ,Math.floor(inRect.w)
                    ,Math.floor(inRect.h) );
            }
            else
            {
                try
                {
                    this.ctx().drawImage(image
                        ,uvRect.x,uvRect.y,uvRect.w,uvRect.h
                        ,inRect.x,inRect.y,inRect.w,inRect.h
                    );
                }
                catch(err)
                {
                    alert(err);
                }
            }
        }
        else
        {
            if(false)
            {
                this.Rect(inRect, '#ff0000');
            }
        }
    }
}

Canvas = new baseCanvas();

//gazcanvas
class gazcanvas
{
    /*
        This is my wrapper for resolution-independent canvas functionality.

        It assumes Canvas is defined (canvas.js)

        Usage:
            Wraps Canvas class functions and adds functionality for working out largest aspect correct rectange for
            given screen and appropriate offsets to centre it in screen.

            On application start-up, set referenceScreenSize(width,height) and application drawing will be scaled to that
            aspect ratio

            call GAZCanvas.update() at the beginning of each game / application update()
            use appropriate GAZxxx() functions for drawing

        see:

     */
    constructor()
    {
        this.currentScreenSize = new Size();
        this.referenceScreenSize = new Size();
        this.offset = new Size(0,0);
        this.targetSize = new Size(0,0);
    }

    update(offset = 0)
    {
        this.currentScreenSize = new Size(window.innerWidth, window.innerHeight-offset);

        Canvas.ctx().canvas.width  = this.currentScreenSize.w;
        Canvas.ctx().canvas.height = this.currentScreenSize.h;

        this.targetSize = new Size(0,0);

        this.targetSize.h = this.currentScreenSize.h;
        this.targetSize.w = (this.targetSize.h * this.referenceScreenSize.w / this.referenceScreenSize.h);

        if(this.targetSize.w > this.currentScreenSize.w)
        {
            this.targetSize.w = this.currentScreenSize.w;
            this.targetSize.h = (this.targetSize.w*this.referenceScreenSize.h) / this.referenceScreenSize.w;
        }

        this.offset.x = this.currentScreenSize.w - this.targetSize.w;
        this.offset.y = this.currentScreenSize.h - this.targetSize.h;
    }

    toScreenSpace(inRect)
    {
        var drawRect = new Rect();
        drawRect.x = ((inRect.x / this.referenceScreenSize.w) * this.targetSize.w) + this.offset.x/2;
        drawRect.y = ((inRect.y / this.referenceScreenSize.h) * this.targetSize.h) + this.offset.y/2;
        drawRect.w = (inRect.w / this.referenceScreenSize.w) * this.targetSize.w;
        drawRect.h = (inRect.h / this.referenceScreenSize.h) * this.targetSize.h;

        return drawRect;
    }

    /*
        Line(vector2 start, vector2 end, string inColour, float inWidth)

        This will draw a line between start and end

        inWidth is optional
     */

    Line(start,end,inColour, inWidth)
    {
        var r = new Rect();


        r.set(start.x,start.y,0,0);
        r = this.toScreenSpace(r);

        var v0 = new Vector2(r.x,r.y);


        r.set(end.x,end.y,inWidth,inWidth);
        r = this.toScreenSpace(r);

        var width = Math.min(r.w,r.h);

        var v1 = new Vector2(r.x,r.y);

        Canvas.Line(v0,v1,inColour, width);
    }

    /*
        Text(float inSize,string inString, vector2 inPos, string inColour, string inJustification,string font)

        This will draw text

            inJustification - 'start', 'left', 'centre', 'end', 'right'
     */
    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        var r = new Rect();

        r.set(inPos.x,inPos.y,inSize,inSize);
        r = this.toScreenSpace(r);

        Canvas.Text(r.h, inString, new Vector2(r.x,r.y),inColour,inJustification,font);
    }

    /*
        Rect(Rect inRect,string inColour, bool inFilled, float inWidth)

        Draw Rectangle
            inRect      - containing rectangle (see rect.js)
            inColour    - RGB colour as string
            inFilled    - optional bool, whether rectangle is filled our outline only
            inWidth     - optional float, thickness of outline
     */

    Rect(inRect,inColour, inFilled,inWidth)
    {
        Canvas.Rect(this.toScreenSpace(inRect), inColour,inFilled,inWidth);
    }

    /*
        Sprite(image,inRect,uvRect)

        Draw rectangle with texture (or texture region)
            image   - Image() object
            inRect  - containing rectangle (see rect.js)
            uVRect  - (optional) texture co-ordinates in pixels
                      if ommitted, full image will be drawn
     */
    Sprite(image,inRect,uvRect)
    {
        var rect = this.toScreenSpace(inRect);
        Canvas.Sprite(image,rect,uvRect);
    }

    /*
        drawLetterbox(oolour)

        Draw a letterbox on canvas
            colour    - RGB colour as string
     */
    drawLetterbox(colour)
    {
        var rect = this.toScreenSpace(new Rect(0,0,this.referenceScreenSize.w,this.referenceScreenSize.h));

        if(rect.x > 0)
        {
            //left + right letterbox

            Canvas.Rect(new Rect(0,0,rect.x,rect.h),colour);
            Canvas.Rect(new Rect(rect.x+rect.w,0,this.currentScreenSize.w-(rect.x+rect.w),rect.h),colour);

        }
        //else
        {
            //top + bottom
            Canvas.Rect(new Rect(0,0,rect.w,rect.y),colour);
            Canvas.Rect(new Rect(0,rect.h+(this.offset.y/2),rect.w,this.currentScreenSize.h - rect.h+(this.offset.y/2)),colour);
        }
    }

}

GAZCanvas = new gazcanvas();

//statemachine
/*
    StateMachine -  class for standard state machine with init(), update(), draw() & exit() functions
                    Uses StatemachineState as base class for all states
 */
class StateMachineState
{
    constructor()
    {
        this.frameCount = 0;
    }

    init()
    {
        this.frameCount = 0;
    }

    update()
    {
        this.frameCount++;
    }

    draw()
    {

    }

    exit()
    {

    }
}
class StateMachine
{
    constructor()
    {
        this.states = {}
        this.currentState ="";
        this.desiredState ="";
    }

    /*
        addState(string name, StateMachineState state)

        Add new state to this.states{}, state machine dictionary

        Will fail if name in use already
     */
    addState(name, state)
    {
        this.states[name] = state;
    }

    /*
        setState(string name)

        Request state change at next Statemachine.Update() call

        Will fail if name is not in this.states,  i.e. undefined state
     */

    setState(name)
    {
        this.desiredState = name;
    }

    /*
        update() -  Do logical update on state machine
                    Will do state transition if desired state has been set
    */
    update()
    {
        if(this.desiredState !== "")
        {
            if(this.currentState !== "")
            {
                this.states[this.currentState].exit();
            }

            this.currentState = this.desiredState;
            this.desiredState = "";

            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].init();
            }
        }

        if(this.currentState !== "")
        {
            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].update();
            }
        }
    }

    draw()
    {
        if(this.currentState !== "")
        {
            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].draw();
            }
        }
    }
}

//texturepage

class TexturePageMetaData
{
    constructor()
    {
        this.lookup = {};
    }
}

class TexturePage
{
    constructor(filename, metadata)
    {
        this.image = new Image();
        this.image.src = filename;
        this.metadata = metadata;
    }

    /*
        DrawSprite(string name, vector2 pos)

        Draw a sprite named 'name' from the metadata at position
     */

    DrawSprite(name, pos)
    {
        this.DrawSpriteInfo(this.metadata.lookup[name], pos);
    }

    /*
        DrawSpriteInfo(Rect uvRect, Vector2 pos)

        Use uVRect info to draw sprite
     */

    DrawSpriteInfo(uvRect, pos)
    {
        GAZCanvas.Sprite(this.image, new Rect(pos.x, pos.y, uvRect.w, uvRect.h), uvRect);
    }
}

class BitmapFont
{
    constructor(bitmapfile)
    {
        this.image = new Image();
        this.image.src = bitmapfile;
        this.scaleFactor = 1.0
    }

    setScale(factor)
    {
        this.scaleFactor = factor;
    }

    measureString(stringToPrint,size)
    {
        size.x = 0;
        size.y = 8 *this.scaleFactor;

        for(let i = 0; i < stringToPrint.length;i++)
        {
            switch(stringToPrint[i])
            {
                case ' ':
                size.x += 8 * this.scaleFactor;
                break;

                case '\n':
                return;

                default:
                    size.x +=8 * this.scaleFactor;
                break;
            }
        }
    }

    applyJustificationOffset(just, size, Offset)
    {
        switch(just)
        {
            case 'left':
                Offset.x = 0;
                Offset.y = 0;
                break;
            case 'right':
                Offset.x -= size.x;
                break;

            case 'centre':
                Offset.x -= size.x/2;
                break;

            case 'centreXY':
                Offset.x -= size.x/2;
                Offset.y -= size.y/2;
                break;
            default:
                Offset.x = 0;
                Offset.y = 0;
                break;
        }
    }


    print(position, text,justify)
    {
        var offset = new Vector2();
        var size = new Vector2();
        var i=0;

        this.measureString(text,size);
        this.applyJustificationOffset(justify,size,offset);

        Canvas.ctx().imageSmoothingEnabled = false;

        for(let ch = 0; ch < text.length;ch++)
        {
            switch(text[ch])
            {
                case ' ':
                    offset.x += 8 * this.scaleFactor;
                    break;

                case '\n':
                {
                    offset.x = 0;
                    position.y+= 10  * this.scaleFactor;

                    this.measureString(text.substring(ch+1),size);
                    this.applyJustificationOffset(justify,size,offset);
                }
                    break;


                default:
                    let charIndex = text.charCodeAt(ch);

                    GAZCanvas.Sprite(this.image
                        ,new Rect(position.x+offset.x,position.y+offset.y, 8*this.scaleFactor, 8*this.scaleFactor)
                        ,new Rect(Math.floor(charIndex % 16)*8, Math.floor(charIndex / 16)*8, 8,7.5)
                    );

                    offset.x +=8 * this.scaleFactor;
                    break;
            }
        }

        Canvas.ctx().imageSmoothingEnabled = true;
    }
}