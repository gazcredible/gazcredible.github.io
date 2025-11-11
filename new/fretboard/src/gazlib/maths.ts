export class Random
{
     seed  :number;
     currentValue :number;

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

        let val = this.next() % 10000;

        return Math.floor(((val / 10000.0) * (max - min)) + min);
    }

    getFloat(min, max)
    {
        if (min == max) return min;

        let val = this.next() % 10000;

        return (((val / 10000.0) * (max - min)) + min);
    }
}

//vector2
export class Vector2
{
    x :number;
    y :number;

    constructor(x?,y?)
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
        let length = this.length();

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
        let result = new Vector2(vec);

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
export class Vector3
{
    x :number;
    y :number;
    z :number;

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
        let length = this.Length();

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
        let result = vec.clone();

        result.Normalize();

        return result;
    }

    static Cross(v0,v1)
    {
        let result = new Vector3();

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
export class Vector4
{
    x :number;
    y :number;
    z :number;
    w :number;

    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
    }
}

//matrix
export class Matrix
{
    m;

    constructor()
    {
        this.m = new Float32Array(16);

        this.m[0] = this.m[5] = this.m[10] = this.m[15] = 1;
    }

    static CreateTranslation(x, y, z) :Matrix
    {
        let m = new Matrix();

        m.m[12] = x;
        m.m[13] = y;
        m.m[14] = z;

        return m;
    }

    static CreateScale(x, y, z) :Matrix
    {
        let m = new Matrix();

        m.m[0] = x;
        m.m[5] = y;
        m.m[10] = z;

        return m;
    }

    static CreateRotationX(angle) :Matrix
    {
        let m = new Matrix();

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        m.m[5] = cos; m.m[6] = sin;
        m.m[9] = -sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationY(angle)  :Matrix
    {
        let m = new Matrix();

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = -sin;
        m.m[8] = sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationZ(angle) :Matrix
    {
        let m = new Matrix();

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = sin;
        m.m[4] = -sin; m.m[5] = cos;

        return m;
    }

    TransformVector2(v0) :Vector2
    {
        let result = new Vector2();

        result.x = (v0.x * this.m[0]) + (v0.y * this.m[4]) + this.m[12];
        result.y = (v0.x * this.m[1]) + (v0.y * this.m[5])+ this.m[13];

        return result;
    }

    TransformVector3(v0)
    {
        let result = new Vector3();

        result.x = (v0.x * this.m.m[0]) + (v0.y * this.m.m[4]) + (v0.z * this.m.m[8]);
        result.y = (v0.x * this.m.m[1]) + (v0.y * this.m.m[5]) + (v0.z * this.m.m[9]);
        result.z = (v0.x * this.m.m[2]) + (v0.y * this.m.m[6]) + (v0.z * this.m.m[10]);

        return result;
    }

    TransformVector4(v0)
    {
        let result = new Vector4();

        result.x = (v0.x * this.m.m[0]) + (v0.y * this.m.m[4]) + (v0.z * this.m.m[8]) + (v0.w *this.m.m[12]);
        result.y = (v0.x * this.m.m[1]) + (v0.y * this.m.m[5]) + (v0.z * this.m.m[9]) + (v0.w *this.m.m[13]);
        result.z = (v0.x * this.m.m[2]) + (v0.y * this.m.m[6]) + (v0.z * this.m.m[10]) + (v0.w *this.m.m[14]);
        result.w = (v0.x * this.m.m[3]) + (v0.y * this.m.m[7]) + (v0.z * this.m.m[11]) + (v0.w *this.m.m[15]);

        return result;
    }

    static Multiply(src, rMat)
    {
        let result = new Matrix();

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
        let m = new Matrix();

        let zaxis = Vector3.Normal(Eye - At);
        let xaxis = Vector3.Normal(Vector3.Cross(Up, zaxis));
        let yaxis = Vector3.Cross(zaxis, xaxis);

        m.m[0] = xaxis.x; m.m[1] = yaxis.x; m.m[2] = zaxis.x; m.m[3] = 0;
        m.m[4] = xaxis.y; m.m[5] = yaxis.y; m.m[6] = zaxis.y; m.m[7] = 0;
        m.m[8] = xaxis.z; m.m[9] = yaxis.z; m.m[10] = zaxis.z; m.m[11] = 0;
        m.m[12] = -Vector3.Dot(xaxis, Eye); m.m[13] = -Vector3.Dot(yaxis, Eye); m.m[14] = -Vector3.Dot(zaxis, Eye); m.m[15] = 1.0;

        return m;
    }


    static CreatePerspectiveFieldOfView(fov, aspectratio, nearPlane, farPlane)
    {
        let m = new Matrix();

        let f = 1.0 / Math.tan(fov / 2.0);

        m.m[0]  = f / aspectratio;   m.m[1]  = 0.0;  m.m[2]  = 0.0;                                              m.m[3]  =  0.0;
        m.m[4]  = 0.0;               m.m[5]  = f;    m.m[6]  = 0.0;                                              m.m[7]  =  0.0;
        m.m[8]  = 0.0;               m.m[9]  = 0.0;  m.m[10] = -(farPlane / (farPlane-nearPlane));                m.m[11] = -1.0;
        m.m[12] = 0.0;               m.m[13] = 0.0;  m.m[14] = -(nearPlane * farPlane) / (farPlane-nearPlane);  m.m[15] =  0.0;

        return m;
    }

    static CreateOrthoOffCenter(left, right, bottom, top, nearPlane, farPlane)
    {
        let m = new Matrix();

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

export class Rect
{
    x :number;
    y :number;
    w :number;
    h :number;

    constructor(x?,y?,w?,h?)
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

export class Size
{
    w :number;
    h :number;

    constructor(inW?, inH?)
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