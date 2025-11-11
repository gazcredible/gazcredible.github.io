/**
 * Created by gareth on 07/06/2018.
 */
function compileShader(gl, shaderSource, shaderType)
{
    // Create the shader object
    let shader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        // Something went wrong during compilation; get the error
        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    // create a program.
    let program = gl.createProgram();

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        // something went wrong with the link
        throw ("program filed to link:" + gl.getProgramInfoLog (program));
    }

    return program;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = function()
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height))
        {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else
        {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

class GeomPrim
{
    constructor()
    {
    }
}

class LinePrim extends GeomPrim
{
    constructor(v0, v1, col)
    {
        super();
        this.v0 = new Vector3(v0);
        this.v1 = new Vector3(v1);
        this.col = new Colour(col);
    }
}

class TriPrim extends GeomPrim
{
    constructor(v0, v1, v2, col)
    {
        super();
        this.v0 = new Vector3(v0);
        this.v1 = new Vector3(v1);
        this.v2 = new Vector3(v2);

        this.col = new Colour(col);
    }
}


//class for creating geometry and organising into gl.rendering
class Drawable
{
    constructor()
    {
        this.vertBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        this.vertCount = 0;
        this.indexCount = 0;
        this.primType = 0;
        this.verts = undefined;

        this.srcIndices = undefined;


    }

    commit(verts, vertcount, prim)
    {
        this.vertCount = vertcount;
        this.primType = prim;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    }

    draw(shaderinst)
    {
        if(this.vertCount > 0)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
            gl.vertexAttribPointer(shaderinst.positionLocation, 3, gl.FLOAT, false, (3 + 4) * 4, 0);
            gl.vertexAttribPointer(shaderinst.colourLocation, 4, gl.FLOAT, false, (3 + 4) * 4, 3 * 4)

            gl.drawArrays(this.primType, 0, this.vertCount);
        }
    }
}

class VertexBuffer_POS_UV0 extends Drawable
{
    constructor()
    {
        super();

        this.reset();
    }

    addVert(x,y,z, u,v)
    {
        this.posList[(this.vertCount*3) +0] = x;
        this.posList[(this.vertCount*3) +1] = y;
        this.posList[(this.vertCount*3) +2] = z;

        this.uvList[(this.vertCount*2)+0] = u;
        this.uvList[(this.vertCount*2)+1] = v;

        this.vertCount += 1;
    }

    reset()
    {
        this.posList = [];
        this.uvList  = [];
        this.vertCount = 0;
    }

    commit()
    {
        let verts = new Float32Array(this.vertCount * (3+2) );

        for(let i=0;i<this.vertCount;i++)
        {
            verts[(i*5)+0] = this.posList[(i*3) +0];
            verts[(i*5)+1] = this.posList[(i*3) +1];
            verts[(i*5)+2] = this.posList[(i*3) +2];

            verts[(i*5)+3] = this.uvList[(i*2)+0];
            verts[(i*5)+4] = this.uvList[(i*2)+1];
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    }

    draw(primtype, shaderinst)
    {
        if (this.vertCount > 0)
        {
            shaderinst.apply();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
            gl.vertexAttribPointer(shaderinst.positionLocation, 3, gl.FLOAT, false, (3 + 2) * 4, 0);
            gl.vertexAttribPointer(shaderinst.uv0Location, 2, gl.FLOAT, false, (3 + 2) * 4, 3 * 4)

            gl.drawArrays(primtype, 0, this.vertCount);
        }
    }
}

class VertexBuffer_POS_UV0_COL extends Drawable
{
    constructor()
    {
        super();

        this.posList = [];
        this.uvList  = [];
        this.colList  = [];
        this.vertCount = 0;

        this.srcIndices = [];

        this.reset();
        this.stride = 3 + 2 + 4;
    }

    addVert(x,y,z, u,v,r,g,b,a)
    {
        this.posList[(this.vertCount*3) +0] = x;
        this.posList[(this.vertCount*3) +1] = y;
        this.posList[(this.vertCount*3) +2] = z;

        this.uvList[(this.vertCount*2)+0] = u;
        this.uvList[(this.vertCount*2)+1] = v;

        this.colList[(this.vertCount*4)+0] = r;
        this.colList[(this.vertCount*4)+1] = g;
        this.colList[(this.vertCount*4)+2] = b;
        this.colList[(this.vertCount*4)+3] = a;


        this.vertCount += 1;
    }

    addIndex(i)
    {
        this.srcIndices.push(i);
    }

    reset()
    {
        this.posList = [];
        this.uvList  = [];
        this.colList  = [];
        this.vertCount = 0;

        this.srcIndices = [];
    }

    commit()
    {
        let verts = new Float32Array(this.vertCount * this.stride );

        for(let i=0;i<this.vertCount;i++)
        {
            verts[(i*this.stride)+0] = this.posList[(i*3) +0];
            verts[(i*this.stride)+1] = this.posList[(i*3) +1];
            verts[(i*this.stride)+2] = this.posList[(i*3) +2];

            verts[(i*this.stride)+3] = this.uvList[(i*2)+0];
            verts[(i*this.stride)+4] = this.uvList[(i*2)+1];

            verts[(i*this.stride)+5] = this.colList[(i*4)+0];
            verts[(i*this.stride)+6] = this.colList[(i*4)+1];
            verts[(i*this.stride)+7] = this.colList[(i*4)+2];
            verts[(i*this.stride)+8] = this.colList[(i*4)+3];
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        if(this.srcIndices.length > 0)
        {
            let indices = new Uint16Array(this.srcIndices.length);

            for (let i = 0; i < this.srcIndices.length; i++)
            {
                indices[i] = this.srcIndices[i];
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        }

        this.posList = [];
        this.uvList  = [];
        this.colList  = [];
    }

    drawArrays(primtype, shaderinst)
    {
        try
        {
            if (this.vertCount > 0)
            {
                shaderinst.apply();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);

                gl.vertexAttribPointer(shaderinst.positionLocation, 3, gl.FLOAT, false, this.stride * 4, 0);
                gl.vertexAttribPointer(shaderinst.uv0Location, 2, gl.FLOAT, false, this.stride * 4, 3 * 4)
                gl.vertexAttribPointer(shaderinst.colLocation, 4, gl.FLOAT, false, this.stride * 4, (3 + 2) * 4)


                gl.drawArrays(primtype, 0, this.vertCount);
            }
        }catch(err)
        {
            console.log(err);
        }
    }

    drawElements(primtype, shaderinst)
    {
        if ((this.vertCount > 0) && (this.srcIndices.length > 0))
        {
            shaderinst.apply();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
            gl.vertexAttribPointer(shaderinst.positionLocation, 3, gl.FLOAT, false, this.stride * 4, 0);
            gl.vertexAttribPointer(shaderinst.uv0Location, 2, gl.FLOAT, false, this.stride * 4, 3 * 4)
            gl.vertexAttribPointer(shaderinst.colLocation, 4, gl.FLOAT, false, this.stride * 4, (3 + 2) * 4)

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            gl.drawElements(primtype, this.srcIndices.length, gl.UNSIGNED_SHORT, 0);
        }
    }
}

class Packetbuffer
{
    constructor()
    {
        this.lineList = [];
        this.triList = [];
        this.drawList = [];
    }

    addLine(v0,  v1, col)
    {
        this.lineList.push( new LinePrim(v0,v1,col));
    }

    addCube(transform,length, width,height, col)
    {
        let v0 = new Vector3(0,-height/2,-width/2);
        let v1 = new Vector3(length,-height/2,-width/2);
        let v2 = new Vector3(0,-height/2, width/2);
        let v3 = new Vector3(length,-height/2,width/2);

        v0 = transform.TransformVector3(v0);
        v1 = transform.TransformVector3(v1);
        v2 = transform.TransformVector3(v2);
        v3 = transform.TransformVector3(v3);

        let v10 = new Vector3(0,height/2,-width/2);
        let v11 = new Vector3(length,height/2,-width/2);
        let v12 = new Vector3(0,height/2, width/2);
        let v13 = new Vector3(length,height/2,width/2);

        v10 = transform.TransformVector3(v10);
        v11 = transform.TransformVector3(v11);
        v12 = transform.TransformVector3(v12);
        v13 = transform.TransformVector3(v13);



        this.triList.push(new TriPrim(v0, v1, v2, col));
        this.triList.push(new TriPrim(v1, v3, v2, col));

        this.triList.push(new TriPrim(v10, v11, v12, col));
        this.triList.push(new TriPrim(v11, v13, v12, col));

        this.triList.push(new TriPrim(v12, v13, v3, col));
        this.triList.push(new TriPrim(v12, v3, v2, col));

        this.triList.push(new TriPrim(v11, v10, v1, col));
        this.triList.push(new TriPrim(v10, v0, v1, col));
    }

    addCylinder(v0,radius,height,step_count,cols)
    {
        let v1 = new Vector3();
        let v2 = new Vector3();

        let v10 = new Vector3();
        let v11 = new Vector3();
        let v12 = new Vector3();

        for(let i=0;i<step_count;i++)
        {
            v1.x = v0.x + (radius * Math.cos(DEG_TO_RAD(i*360)/step_count));
            v1.y = v0.y;
            v1.z = v0.z + (radius * Math.sin(DEG_TO_RAD(i*360)/step_count));

            v2.x = v0.x + (radius * Math.cos(DEG_TO_RAD((i+1)*360)/step_count));
            v2.y = v0.y;
            v2.z = v0.z + (radius * Math.sin(DEG_TO_RAD((i+1)*360)/step_count));

            this.triList.push(new TriPrim(v0, v1, v2, cols[i%cols.length]));

            v10.assign(v0);
            v10.y += height;
            v11.assign(v1);
            v11.y += height;
            v12.assign(v2);
            v12.y += height;

            this.triList.push(new TriPrim(v10, v11, v12, cols[i%cols.length]));

            this.triList.push(new TriPrim(v1, v11, v12, cols[i%cols.length]));
            this.triList.push(new TriPrim(v1, v2, v12, cols[i%cols.length]));
        }
    }

    commit()
    {
        if(this.lineList.length > 0)
        {
            let inst = new Drawable();
            this.drawList.push(inst);

            //go through all the lines to get a count
            let vertCount = this.lineList.length * 2;

            let srcVerts = new Float32Array(vertCount * 7);

            for (let i = 0; i < this.lineList.length; i++)
            {
                let index = (i * 7 * 2);

                srcVerts[index + 0] = this.lineList[i].v0.x;
                srcVerts[index + 1] = this.lineList[i].v0.y;
                srcVerts[index + 2] = this.lineList[i].v0.z;

                srcVerts[index + 3] = this.lineList[i].col.r;
                srcVerts[index + 4] = this.lineList[i].col.g;
                srcVerts[index + 5] = this.lineList[i].col.b;
                srcVerts[index + 6] = this.lineList[i].col.a;

                srcVerts[index + 7] = this.lineList[i].v1.x;
                srcVerts[index + 8] = this.lineList[i].v1.y;
                srcVerts[index + 9] = this.lineList[i].v1.z;

                srcVerts[index + 10] = this.lineList[i].col.r;
                srcVerts[index + 11] = this.lineList[i].col.g;
                srcVerts[index + 12] = this.lineList[i].col.b;
                srcVerts[index + 13] = this.lineList[i].col.a;
            }
            this.lineList = [];
            inst.commit(srcVerts, vertCount, gl.LINES);
            srcVerts = undefined;
        }

        if(this.triList.length > 0)
        {
            let inst = new Drawable();
            this.drawList.push(inst);

            //go through all the lines to get a count
            let vertCount = this.triList.length * 3;

            let srcVerts = new Float32Array(vertCount * 7);

            for (let i = 0; i < this.triList.length; i++)
            {
                let index = (i * 7 * 3);

                srcVerts[index + 0] = this.triList[i].v0.x;
                srcVerts[index + 1] = this.triList[i].v0.y;
                srcVerts[index + 2] = this.triList[i].v0.z;

                srcVerts[index + 3] = this.triList[i].col.r;
                srcVerts[index + 4] = this.triList[i].col.g;
                srcVerts[index + 5] = this.triList[i].col.b;
                srcVerts[index + 6] = this.triList[i].col.a;

                srcVerts[index + 7] = this.triList[i].v1.x;
                srcVerts[index + 8] = this.triList[i].v1.y;
                srcVerts[index + 9] = this.triList[i].v1.z;

                srcVerts[index + 10] = this.triList[i].col.r;
                srcVerts[index + 11] = this.triList[i].col.g;
                srcVerts[index + 12] = this.triList[i].col.b;
                srcVerts[index + 13] = this.triList[i].col.a;


                srcVerts[index + 14] = this.triList[i].v2.x;
                srcVerts[index + 15] = this.triList[i].v2.y;
                srcVerts[index + 16] = this.triList[i].v2.z;

                srcVerts[index + 17] = this.triList[i].col.r;
                srcVerts[index + 18] = this.triList[i].col.g;
                srcVerts[index + 19] = this.triList[i].col.b;
                srcVerts[index + 20] = this.triList[i].col.a;
            }
            this.triList = [];

            inst.commit(srcVerts, vertCount, gl.TRIANGLES);
            srcVerts = undefined;
        }

        //this.lineList.clear();
        //this.triList.clear();
    }

    draw(shaderinst)
    {
        for(let i=0;i< this.drawList.length;i++)
        {
            this.drawList[i].draw(shaderinst);
        }
    }
}

class ShaderInst
{
    constructor()
    {
    }

    build()
    {

    }

    apply()
    {

    }
}

class DebugShader extends ShaderInst
{
    constructor()
    {
        super();

        let vsSource = `
            attribute vec4 position;
            attribute vec4 colour;
            uniform mat4 matrix;
        
            varying vec4 f_colour;
            void main()
            {
                gl_Position = matrix * position;
                f_colour = colour;
            }`;

        let psSource = `
            precision mediump float;
            varying vec4 f_colour;
        
            void main()
            {
                gl_FragColor = f_colour;
            }`;

        let vs = compileShader(gl,vsSource,gl.VERTEX_SHADER);
        let ps = compileShader(gl,psSource,gl.FRAGMENT_SHADER);

        this.program = createProgram(gl,vs,ps);

        // look up where the vertex data needs to go.
        this.positionLocation = gl.getAttribLocation(this.program, "position");
        this.colourLocation = gl.getAttribLocation(this.program, "colour");

        // lookup uniforms
        this.matrixLoc = gl.getUniformLocation(this.program, "matrix");

        this.projection = new Matrix();
    }

    apply()
    {
        gl.useProgram(this.program);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.colourLocation);
        gl.uniformMatrix4fv(this.matrixLoc,false, this.projection.m);
    }
}

let debugshader;

class POS_UV0_Shader extends ShaderInst
{
    constructor()
    {
        super();

        let vsSource = `
            attribute vec4 position;
            attribute vec2 uv0;
            uniform mat4 matrix;
            
            varying highp vec2 fUV0;
                    
            void main()
            {
                gl_Position = matrix * position;
                fUV0 =uv0; 
            }`;

        let psSource = `
            precision mediump float;
            varying highp vec2 fUV0;

            uniform sampler2D uSampler;
        
            void main()
            {
                gl_FragColor = texture2D(uSampler, fUV0);
            }`;

        let vs = compileShader(gl,vsSource,gl.VERTEX_SHADER);
        let ps = compileShader(gl,psSource,gl.FRAGMENT_SHADER);

        this.program = createProgram(gl,vs,ps);

        // look up where the vertex data needs to go.
        this.positionLocation = gl.getAttribLocation(this.program, "position");
        this.uv0Location = gl.getAttribLocation(this.program, "uv0");

        // lookup uniforms
        this.colorLocation = gl.getUniformLocation(this.program, "color");
        this.matrixLoc = gl.getUniformLocation(this.program, "matrix");
        this.textureLoc = gl.getUniformLocation(this.program, 'uSampler'),

            this.projection = new Matrix();
        this.texture = undefined;
    }

    apply()
    {
        gl.useProgram(this.program);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.uv0Location);
        gl.uniformMatrix4fv(this.matrixLoc,false, this.projection.m);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.textureLoc, 0);
    }
}

class POS_UV0_COL_Shader extends ShaderInst
{
    constructor()
    {
        super();

        let vsSource = `
            attribute vec4 position;
            attribute vec2 uv0;
            attribute vec4 col;
            uniform mat4 matrix;
            uniform bool vertex_colour_enabled;            
            uniform vec4 diffuse_colour;
            
            varying highp vec2 fUV0;
            varying highp vec4 fCOL0;            
                    
            void main()
            {
                gl_Position = matrix * position;
                fUV0 =uv0; 
                
                if (vertex_colour_enabled == true)
                    fCOL0 = col;
                else
                    fCOL0 = diffuse_colour;                                    
            }`;

        let psSource = `
            precision mediump float;
            varying highp vec2 fUV0;
            varying highp vec4 fCOL0;
            
            uniform sampler2D uSampler;
            uniform bool texture_enabled;
            uniform bool alpha_test_enabled;
            uniform float alpha_test_value;
        
            void main()
            {
                if (texture_enabled == true)
                {
                    vec4 col = texture2D(uSampler, fUV0);
                    
                    if(alpha_test_enabled == true)
                    {         
                        if(col.a < alpha_test_value)   
                            discard;                                                                                                      
                    }
                    
                    gl_FragColor = col * fCOL0;
                }
                else
                {
                    gl_FragColor = fCOL0;
                }                
            }`;

        let vs = compileShader(gl,vsSource,gl.VERTEX_SHADER);
        let ps = compileShader(gl,psSource,gl.FRAGMENT_SHADER);

        this.program = createProgram(gl,vs,ps);

        // look up where the vertex data needs to go.
        this.positionLocation = gl.getAttribLocation(this.program, "position");
        this.uv0Location = gl.getAttribLocation(this.program, "uv0");
        this.colLocation = gl.getAttribLocation(this.program, "col");

        // lookup uniforms
        this.colorLocation = gl.getUniformLocation(this.program, "color");
        this.matrixLoc = gl.getUniformLocation(this.program, "matrix");
        this.textureLoc = gl.getUniformLocation(this.program, 'uSampler');
        this.texture_enabledLoc = gl.getUniformLocation(this.program, 'texture_enabled');
        this.vertexcol_enabledLoc = gl.getUniformLocation(this.program, 'vertex_colour_enabled');
        this.diffuse_colourLoc = gl.getUniformLocation(this.program, 'diffuse_colour');

        this.alpha_test_enabledLoc = gl.getUniformLocation(this.program, 'alpha_test_enabled');
        this.alpha_test_valueLoc = gl.getUniformLocation(this.program, 'alpha_test_value');

        this.projection = new Matrix();
        this.texture = undefined;
        this.texture_enabled = true;
        this.vertex_colour_enabled = true;
        this.diffuse_colour = new Vector4(1,1,1,1);

        this.alpha_test = false;
        this.alpha_test_value = 0;
    }

    apply()
    {
        gl.useProgram(this.program);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.uv0Location);
        gl.enableVertexAttribArray(this.colLocation);
        gl.uniformMatrix4fv(this.matrixLoc,false, this.projection.m);

        if(this.texture_enabled === true)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
        }

        gl.uniform1i(this.textureLoc, 0);
        gl.uniform1i(this.texture_enabledLoc, this.texture_enabled);

        gl.uniform1i(this.vertexcol_enabledLoc, this.vertex_colour_enabled);
        gl.uniform4f(this.diffuse_colourLoc,this.diffuse_colour.x,this.diffuse_colour.y,this.diffuse_colour.z,this.diffuse_colour.w);

        gl.uniform1i(this.alpha_test_enabledLoc, this.alpha_test);
        gl.uniform1f(this.alpha_test_valueLoc, this.alpha_test_value);
    }
}

let pos_uv0_col_shader;

function webgl_init()
{
    simple_shader = new POS_UV0_COL_Shader();
}