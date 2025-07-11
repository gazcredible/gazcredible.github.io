/*jshint sub:true*/
/*jshint -W014*/
/*jshint -W078*/

function RAD_TO_DEG(x)
{
    return (x *180 ) / Math.PI;
}

function DEG_TO_RAD(x)
{
    return (x * Math.PI) / 180;
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

        if(x !==undefined)
        {
            this.x = x;
        }

        if(y !==undefined)
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

    static normal(refIn)
    {
        let result = new Vector2(refIn);

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

    static Sub(v0,v1)
    {
        let result = new Vector2();

        result.x = v0.x - v1.x;
        result.y = v0.y - v1.y;

        return result;
    }
}

//vector3
class Vector3
{
    /*
        Vector3 - Standard Vector3 class
     */

    constructor(x,y,z)
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        if(x instanceof Vector3 )
        {
            this.assign(x);
        }
        else
        {
            if (x !==undefined)
            {
                this.x = x;
            }

            if (y !==undefined)
            {
                this.y = y;
            }

            if (z !==undefined)
            {
                this.z = z;
            }
        }
    }

    assign(vec)
    {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }

    set(x,y,z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Normalize()
    {
        let length = this.length();

        this.x/= length;
        this.y/= length;
        this.z/= length;
    }

    length()
    {
        return Math.sqrt((this.x*this.x) + (this.y*this.y) + (this.z*this.z));
    }

    distanceXZ(v0)
    {
        let x = Math.abs(this.x - v0.x);
        let z = Math.abs(this.z - v0.z);

        return Math.sqrt((x*x) + (z*z));
    }

    static Normal(refIn)
    {
        let result = new Vector3(refIn);

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

    static Sub(v0,v1)
    {
        let result = new Vector3();

        result.x = v0.x - v1.x;
        result.y = v0.y - v1.y;
        result.z = v0.z - v1.z;

        return result;
    }

    static Dot(v0,v1)
    {
        return (v0.x * v1.x) + (v0.y * v1.y) + (v0.z * v1.z);
    }

    toString()
    {
        return ""+this.x.toFixed(2)
            + ":" + this.y.toFixed(2)
            + ":" + this.z.toFixed(2)
            ;
    }
}

//vector4
class Vector4
{
    /*
        Vector4 - Standard Vector4 class
     */
    constructor(x,y,z,w)
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;

        if(x !== undefined)
        {
            this.x = x;
        }

        if(y !== undefined)
        {
            this.y = y;
        }

        if(z !== undefined)
        {
            this.z = z;
        }

        if(w !== undefined)
        {
            this.w = w;
        }
    }

    set(x,y,z,w)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    clone(v4)
    {
        this.set(v4.x,v4.y,v4.z,v4.w);
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
        let m = new Matrix();

        if( x instanceof Vector3)
        {
            m.m[12] = x.x;
            m.m[13] = x.y;
            m.m[14] = x.z;
        }
        else
        {
            m.m[12] = x;
            m.m[13] = y;
            m.m[14] = z;
        }
        return m;
    }

    static CreateScale(x, y, z)
    {
        let m = new Matrix();

        m.m[0] = x;
        m.m[5] = y;
        m.m[10] = z;

        return m;
    }

    static CreateRotationX(angle)
    {
        let m = new Matrix();

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        m.m[5] = cos; m.m[6] = sin;
        m.m[9] = -sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationY(angle)
    {
        let m = new Matrix();

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        m.m[0] = cos; m.m[2] = -sin;
        m.m[8] = sin; m.m[10] = cos;

        return m;
    }

    static CreateRotationZ(angle)
    {
        let m = new Matrix();

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        m.m[0] = cos; m.m[1] = sin;
        m.m[4] = -sin; m.m[5] = cos;

        return m;
    }

    TransformVector2(v0)
    {
        let result = new Vector2();

        result.x = (v0.x * this.m[0]) + (v0.y * this.m[4]) + this.m[12];
        result.y = (v0.x * this.m[1]) + (v0.y * this.m[5])+ this.m[13];

        return result;
    }

    TransformVector3(v0)
    {
        let result = new Vector3();

        result.x = ((v0.x * this.m[0]) + (v0.y * this.m[4]) + (v0.z * this.m[8])) + this.m[12];
        result.y = ((v0.x * this.m[1]) + (v0.y * this.m[5]) + (v0.z * this.m[9])) + this.m[13];
        result.z = ((v0.x * this.m[2]) + (v0.y * this.m[6]) + (v0.z * this.m[10])) + this.m[14];

        return result;
    }

    TransformVector4(v0)
    {
        let result = new Vector4();

        result.x = (v0.x * this.m[0]) + (v0.y * this.m[4]) + (v0.z * this.m[8]) + (v0.w *this.m[12]);
        result.y = (v0.x * this.m[1]) + (v0.y * this.m[5]) + (v0.z * this.m[9]) + (v0.w *this.m[13]);
        result.z = (v0.x * this.m[2]) + (v0.y * this.m[6]) + (v0.z * this.m[10]) + (v0.w *this.m[14]);
        result.w = (v0.x * this.m[3]) + (v0.y * this.m[7]) + (v0.z * this.m[11]) + (v0.w *this.m[15]);

        return result;
    }

    transpose(dst)
    {
        dst = dst || new Matrix();

        dst.m[ 0] = this.m[0];
        dst.m[ 1] = this.m[4];
        dst.m[ 2] = this.m[8];
        dst.m[ 3] = this.m[12];
        dst.m[ 4] = this.m[1];
        dst.m[ 5] = this.m[5];
        dst.m[ 6] = this.m[9];
        dst.m[ 7] = this.m[13];
        dst.m[ 8] = this.m[2];
        dst.m[ 9] = this.m[6];
        dst.m[10] = this.m[10];
        dst.m[11] = this.m[14];
        dst.m[12] = this.m[3];
        dst.m[13] = this.m[7];
        dst.m[14] = this.m[11];
        dst.m[15] = this.m[15];

        return dst;
    }

    inverse(dst)
    {
        dst = dst || new Matrix();

        var m00 = this.m[0 * 4 + 0];
        var m01 = this.m[0 * 4 + 1];
        var m02 = this.m[0 * 4 + 2];
        var m03 = this.m[0 * 4 + 3];
        var m10 = this.m[1 * 4 + 0];
        var m11 = this.m[1 * 4 + 1];
        var m12 = this.m[1 * 4 + 2];
        var m13 = this.m[1 * 4 + 3];
        var m20 = this.m[2 * 4 + 0];
        var m21 = this.m[2 * 4 + 1];
        var m22 = this.m[2 * 4 + 2];
        var m23 = this.m[2 * 4 + 3];
        var m30 = this.m[3 * 4 + 0];
        var m31 = this.m[3 * 4 + 1];
        var m32 = this.m[3 * 4 + 2];
        var m33 = this.m[3 * 4 + 3];

        var tmp_0  = m22 * m33;
        var tmp_1  = m32 * m23;
        var tmp_2  = m12 * m33;
        var tmp_3  = m32 * m13;
        var tmp_4  = m12 * m23;
        var tmp_5  = m22 * m13;
        var tmp_6  = m02 * m33;
        var tmp_7  = m32 * m03;
        var tmp_8  = m02 * m23;
        var tmp_9  = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;

        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        dst.m[0] = d * t0;
        dst.m[1] = d * t1;
        dst.m[2] = d * t2;
        dst.m[3] = d * t3;
        dst.m[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
        dst.m[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
        dst.m[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
        dst.m[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
        dst.m[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
        dst.m[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
        dst.m[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
        dst.m[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
        dst.m[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
        dst.m[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
        dst.m[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
        dst.m[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

        return dst;
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

        let zaxis = Vector3.Normal(Vector3.Sub(Eye, At));
        let xaxis = Vector3.Normal(Vector3.Cross(Up, zaxis));
        let yaxis = Vector3.Cross(zaxis, xaxis);

        m.m[0] = xaxis.x; m.m[1] = yaxis.x; m.m[2] = zaxis.x; m.m[3] = 0;
        m.m[4] = xaxis.y; m.m[5] = yaxis.y; m.m[6] = zaxis.y; m.m[7] = 0;
        m.m[8] = xaxis.z; m.m[9] = yaxis.z; m.m[10] = zaxis.z; m.m[11] = 0;
        m.m[12] = -Vector3.Dot(xaxis, Eye); m.m[13] = -Vector3.Dot(yaxis, Eye); m.m[14] = -Vector3.Dot(zaxis, Eye); m.m[15] = 1.0;

        return m;
    }


    static CreatePerspectiveFieldOfView(fov_as_rad, aspectratio, nearPlane, farPlane)
    {
        let m = new Matrix();

        let f = 1.0 / Math.tan(fov_as_rad / 2.0);

        m.m[0]  = f / aspectratio;   m.m[1]  = 0.0;  m.m[2]  = 0.0;                                             m.m[3]  =  0.0;
        m.m[4]  = 0.0;               m.m[5]  = f;    m.m[6]  = 0.0;                                             m.m[7]  =  0.0;
        m.m[8]  = 0.0;               m.m[9]  = 0.0;  m.m[10] = -(farPlane / (farPlane-nearPlane));              m.m[11] = -1.0;
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

    toString()
    {
        return this.m[0].toFixed(3) +":" + this.m[1].toFixed(3)+":" + this.m[2].toFixed(3) +":" + this.m[3].toFixed(3)
        + "\n" + this.m[4].toFixed(3) +":" + this.m[5].toFixed(3)+":" + this.m[6].toFixed(3) +":" + this.m[7].toFixed(3)
            + "\n" + this.m[8].toFixed(3) +":" + this.m[9].toFixed(3)+":" + this.m[10].toFixed(3) +":" + this.m[11].toFixed(3)
            + "\n" + this.m[12].toFixed(3) +":" + this.m[13].toFixed(3)+":" + this.m[14].toFixed(3) +":" + this.m[15].toFixed(3);
    }
}

//rect
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

        if(x !==undefined)
        {
            this.x = x;
        }

        if(y !==undefined)
        {
            this.y = y;
        }

        if(w !==undefined)
        {
            this.w = w;
        }

        if(h !==undefined)
        {
            this.h = h;
        }
    }

    clone(r)
    {
        this.set(r.x,r.y,r.w,r.h);
    }

    set(x,y,w,h)
    {
        if(x !==undefined)
        {
            this.x = x;
        }

        if(y !==undefined)
        {
            this.y = y;
        }

        if(w !==undefined)
        {
            this.w = w;
        }

        if(h !==undefined)
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

class Colour
{
    constructor(r,g,b,a=1.0)
    {
        if(r instanceof (Colour) == true)
        {
            this.r = r.r;
            this.g = r.g;
            this.b = r.b;
            this.a = r.a;
        }
        else
        {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        this.set();
    }

    set()
    {
        this.hex = this.to_HEX();
    }

    to_HEX()
    {

        let hr = Math.floor(this.r * 255).toString(16);
        let hg = Math.floor(this.g * 255).toString(16);
        let hb = Math.floor(this.b * 255).toString(16);
        let ha = Math.floor(this.a * 255).toString(16);

        if (hr.length === 1)
            hr = "0" + hr;
        if (hg.length === 1)
            hg = "0" + hg;
        if (hb.length === 1)
            hb = "0" + hb;

        if (ha.length === 1)
            ha = "0" + ha;

        return "#" + hr + hg + hb;// + ha;
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

//keycodes
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

        if(GAZCanvas.referenceScreenSize.w > 0)
        {
            let screenRect = new Rect();
            screenRect.set(0, 0, GAZCanvas.referenceScreenSize.w, GAZCanvas.referenceScreenSize.h);
            screenRect = GAZCanvas.toScreenSpace(screenRect);

            if (screenRect.isInMe(rawMousePos) === true)
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

        return rawMousePos;
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

let Input = new InputClass();

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
        let canvas = document.getElementById("text");
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

    Circle(centre,radius,inColour)
    {
        this.ctx().beginPath();
        this.ctx().fillStyle = inColour;
        this.ctx().arc(centre.x, centre.y, radius, 0, 2 * Math.PI);
        this.ctx().fill();
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

        if(inJustification == undefined)
        {
            inJustification = "left";
        }
        this.ctx().textAlign = inJustification;
        this.ctx().fillStyle = inColour;

        let lines = inString.split('\n');

        if(inJustification == 'center')
        {
            inPos.y += (inSize/4);
        }

        for (let i = 0; i<lines.length; i++)
        {
            this.ctx().fillText(lines[i], inPos.x, inPos.y + (i * inSize));
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
        if((image !==null) && (image.width >0))
        {
            if(uvRect == undefined)
            {
                this.ctx().drawImage(image,Math.floor(inRect.x),Math.floor(inRect.y),Math.floor(inRect.w),Math.floor(inRect.h) );
            }
            else
            {
                try
                {
                    this.ctx().drawImage(image,uvRect.x,uvRect.y,uvRect.w,uvRect.h,inRect.x,inRect.y,inRect.w,inRect.h);
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

let Canvas = new baseCanvas();

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

    update()
    {
        this.currentScreenSize = new Size(window.innerWidth, window.innerHeight);

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
        let drawRect = new Rect();
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
        let r = new Rect();
        r.set(start.x,start.y,0,0);
        r = this.toScreenSpace(r);

        let v0 = new Vector2(r.x,r.y);


        r.set(end.x,end.y,inWidth,inWidth);
        r = this.toScreenSpace(r);

        let width = Math.min(r.w,r.h);

        let v1 = new Vector2(r.x,r.y);

        Canvas.Line(v0,v1,inColour, width);
    }

    Circle(centre,radius,inColour)
    {
        let r = new Rect();
        r.set(centre.x,centre.y,radius,0);
        r = this.toScreenSpace(r);

        Canvas.Circle( new Vector2(r.x,r.y), r.w,inColour);
    }

    /*
        Text(float inSize,string inString, vector2 inPos, string inColour, string inJustification,string font)

        This will draw text

            inJustification - 'start', 'left', 'centre', 'end', 'right'
     */
    Text(inSize,inString,inPos,inColour,inJustification,font)
    {
        let r = new Rect();

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
        let rect = this.toScreenSpace(inRect);
        Canvas.Sprite(image,rect,uvRect);
    }

    /*
        drawLetterbox(oolour)

        Draw a letterbox on canvas
            colour    - RGB colour as string
     */
    drawLetterbox(colour)
    {
        let rect = this.toScreenSpace(new Rect(0,0,this.referenceScreenSize.w,this.referenceScreenSize.h));

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

let GAZCanvas = new gazcanvas();

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
        this.states = {};
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

//==============================================================================================================================
class DebugMenuOption
{
    constructor(name, parent = undefined, dict = undefined)
    {
        this.children = [];
        this.parent = parent;
        this.name = name;
        this.currentOption = 0;
        this.dict = dict;
    }

    update(input)
    {
        if ('key' in input)
        {
            if (input['key'] === "left")
            {
                this.onLeft(input['held']);
            }

            if (input['key'] === "right")
            {
                this.onRight(input['held']);
            }

            if (input['key'] === "up")
            {
                this.onUp();
            }

            if (input['key'] === "down")
            {
                this.onDown();
            }

            if (input['key'] === "select")
            {
                return this.onSelect();
            }

            if (input['key'] === "cancel")
            {
                return this.onCancel();
            }
        }

        return this;
    }

    onUp()
    {
        if (this.currentOption > 0)
        {
            this.currentOption -= 1;
        }
    }

    onDown()
    {
        if (this.currentOption + 1 < this.children.length)
        {
            this.currentOption += 1;
        }
    }

    onLeft(held = false)
    {
        if (this.children.length > this.currentOption)
        {
            this.children[this.currentOption].onLeft(held);
        }
    }

    onRight(held = false)
    {
        if (this.children.length > this.currentOption)
        {
            this.children[this.currentOption].onRight(held);
        }
    }

    onSelect()
    {
        if (this.children.length > this.currentOption)
        {
            if (this.children[this.currentOption].children.length > 0)
            {
                return this.children[this.currentOption];
            }
            else
            {
                this.children[this.currentOption].onSelect();
            }
        }

        return this;

    }

    onCancel()
    {
        if (this.parent !==undefined)
        {
            return this.parent;
        }

        return this;
    }

    display()
    {
        let text = '';

        for (let i = 0; i < this.children.length;i++)
        {
            if (i == this.currentOption)
            {
                text += '>> ';
            }
            else
            {
                text += '   ';
            }

            text += this.children[i].getName();
            text += '\n';
        }

        return text;
    }

    add(child)
    {
        child.parent = this;
        this.children.push(child);
    }

    getName()
    {
        return this.name;
    }

    getChild(name)
    {
        for (let i = 0; this.children.length; i++)
        {
            if (this.children[i].name == name)
            {
                return this.children[i];
            }
        }

        return undefined;
    }
}

DebugMenu = new DebugMenuOption('Root Menu');

class DebugMenuOption_Float extends DebugMenuOption
{
    constructor(name, parent = undefined, dict = undefined)
    {
        super(name, parent, dict);
    }


    onLeft(held = false)
    {
        this.dict.value = Math.max(this.dict.value - this.dict.step, this.dict.min);
    }

    onRight(held = false)
    {
        this.dict.value = Math.min(this.dict.value + this.dict.step, this.dict.max);
    }

    getName()
    {
        return this.name + ":" + this.dict.value.toFixed(3);
    }
}

class DebugMenuOption_List extends DebugMenuOption_Float
{
    constructor(name, parent = undefined, dict = undefined)
    {
        super(name, parent, dict);

        if('step' in this.dict == false)
        {
            this.dict.step = 1;
        }
    }

    onLeft(held = false)
    {
        if(held === false)
        {
            this.dict.value = Math.max(this.dict.value - this.dict.step, 0);
        }
    }

    onRight(held = false)
    {
        if(held === false)
        {
            this.dict.value = Math.min(this.dict.value + this.dict.step, this.dict.list.length-1);
        }
    }

    getName()
    {
        return this.name + ":" + this.dict.list[this.dict.value];
    }

    currentLabel()
    {
        return this.dict.list[this.dict.value];
    }
}

//=====================================================================================================================
class Timer
{
    constructor()
    {
        this.values = new Float32Array(60);
        this.index = 0;

        this.startTime = 0;

    }

    Add(val)
    {
        this.values[this.index] = val;
        this.index = (this.index+1)% this.values.length;
    }

    start()
    {
        this.startTime = performance.now();
    }

    addFrame()
    {
        this.Add(performance.now() - this.startTime);
        this.start();
    }

    Get()
    {
        let sum = 0;
        for(let i=0;i<this.values.length;i++)
        {
            sum += this.values[i];
        }

        return sum /this.values.length;
    }
}

class Range
{
    constructor()
    {
        this.maxValue = Number.MIN_SAFE_INTEGER;
        this.minValue = Number.MAX_SAFE_INTEGER;
    }

    addValue(v)
    {
        if( this.maxValue < v)
            this.maxValue = v;

        if( this.minValue > v)
            this.minValue = v;
    }

    getValue(v)
    {
        return (v - this.minValue) / (this.maxValue-this.minValue);
    }
}

class AABB
{
    constructor()
    {
        this.maxVert = new Vector3(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
        this.minVert = new Vector3(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

        this.range = new Vector3(0, 0, 0);
    }

    addPoint(v0)
    {
        if (v0.x > this.maxVert.x)
            this.maxVert.x = v0.x;

        if (v0.y > this.maxVert.y)
            this.maxVert.y = v0.y;

        if (v0.z > this.maxVert.z)
            this.maxVert.z = v0.z;

        if (v0.x < this.minVert.x)
            this.minVert.x = v0.x;

        if (v0.y < this.minVert.y)
            this.minVert.y = v0.y;

        if (v0.z < this.minVert.z)
            this.minVert.z = v0.z;

        this.range.x = this.maxVert.x - this.minVert.x;
        this.range.y = this.maxVert.y - this.minVert.y;
        this.range.z = this.maxVert.z - this.minVert.z;
    }
}

class Button extends Rect
{
    constructor(label, inRect)
    {
        super(inRect.x,inRect.y,inRect.w,inRect.h);
        this.active = true;
        this.selected = false;
        this.label = label;
    }

    isInRect(pos)
    {
        if(this.active === false)
        {
            return false;
        }
        return this.isInMe(pos);
    }

    update()
    {

    }

    draw(style)
    {
        //let rect = toScreenSpace(this.rect);
        let pos = this.getCentre();
        let fontSize = GAZCanvas.toScreenSpace(new Rect(0,0,24,24) ).h;

        if(this.active === false)
        {
            GAZCanvas.Rect(this, style['inactive_bg']);
            GAZCanvas.Text(fontSize,this.label, pos, style['inactive_font'],'center');
        }
        else
        {
            if(this.selected === true)
            {
                GAZCanvas.Rect(this,style['selected_bg']);
                GAZCanvas.Text(fontSize,this.label, pos,style['selected_font'],'center');
            }
            else
            {
                if (this.isInMe(Input.mouseLogicalPos) === true)
                {
                    GAZCanvas.Rect(this, style['hover_bg']);
                    GAZCanvas.Text(fontSize,this.label, pos,style['hover_font'],'center');
                }
                else
                {
                    GAZCanvas.Rect(this, style['active_bg']);
                    GAZCanvas.Text(fontSize,this.label, pos,style['active_font'],'center');
                }
            }
        }
    }
}


class ButtonGroup
{
    constructor()
    {
        this.buttons = [];
        this.displayID = 0;
        this.style = {active_bg: '#000000', active_font:'#ffffff',
            inactive_bg: '#000000', inactive_font:'#ffffff',
            selected_bg :'#ffffff', selected_font: '#000000',
            hover_bg : '#7f7f7f', hover_font: '#ffffff'
        };
    }

    add(label, rect)
    {
        this.buttons.push( new Button(label,rect));
    }

    set_selected(id)
    {
        this.displayID = id;

        for(let i=0;i< this.buttons.length;i++)
        {
            this.buttons[i].selected = false;
        }

        this.buttons[this.displayID].selected = true;
    }

    get_selected()
    {
        return this.displayID;
    }

    update()
    {
        let newItemID = -1;
        for(let i=0;i< this.buttons.length;i++)
        {
            if(this.buttons[i].active === true)
            {
                this.buttons[i].update();

                if (Input.currentMouseState === INPUT_PRESSED)
                {
                    if (this.buttons[i].isInRect(Input.mouseLogicalPos) === true)
                    {
                        newItemID = i;
                    }
                }
            }
        }

        if(newItemID !== -1)
        {
            this.set_selected(newItemID);
        }
    }

    draw()
    {
        for(let i=0;i< this.buttons.length;i++)
        {
            this.buttons[i].draw(this.style);
        }
    }

}

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