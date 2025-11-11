class GLDebugRenderer
{
    constructor()
    {
        this.program;
        this.positionLocation;
        this.colourLocation;
        this.colorLocation;
        this.matrixLoc;
        
        this.vertBuffer;
        this.vertexIndex = 0;
        this.positionBuffer;
    }
    
    Init(gl,vertCount)
    {
        this.vertBuffer = new Float32Array(vertCount*7);
        var vsSource = `
            attribute vec4 position;
            attribute vec4 colour;
            uniform mat4 matrix;
        
            varying vec4 f_colour;
            void main()
            {
                gl_Position = matrix * position;
                f_colour = colour;
            }`;
        
        var psSource = `
            precision mediump float;
            varying vec4 f_colour;
        
            void main()
            {
                gl_FragColor = f_colour;
            }`;
        
        var vs = compileShader(gl,vsSource,gl.VERTEX_SHADER);
        var ps = compileShader(gl,psSource,gl.FRAGMENT_SHADER);
        
        this.program = createProgram(gl,vs,ps);
        
        // look up where the vertex data needs to go.
        this.positionLocation = gl.getAttribLocation(this.program, "position");
        this.colourLocation = gl.getAttribLocation(this.program, "colour");
        
        // lookup uniforms
        this.colorLocation = gl.getUniformLocation(this.program, "color");
        this.matrixLoc = gl.getUniformLocation(this.program, "matrix");
        
        // Create a buffer to put positions in
        this.positionBuffer = gl.createBuffer();
        
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    }
    
    OnStartDrawing()
    {
        this.vertexIndex = 0;
    }
    
    addVert(x, y, z, r, g, b, a)
    {
        this.vertBuffer[(this.vertexIndex*7)+0] = x;
        this.vertBuffer[(this.vertexIndex*7)+1] = y;
        this.vertBuffer[(this.vertexIndex*7)+2] = z;
        
        this.vertBuffer[(this.vertexIndex*7)+3] = r;
        this.vertBuffer[(this.vertexIndex*7)+4] = g;
        this.vertBuffer[(this.vertexIndex*7)+5] = b;
        this.vertBuffer[(this.vertexIndex*7)+6] = a;
        
        this.vertexIndex++;
    }
    
    addLine(v0,v1,col,thickness)
    {
        var pos2D = [];
        var diff = new Vector2(v1.x - v0.x,v1.y - v0.y);
        var length = diff.length();
        
        var angle = Math.atan2(diff.y, diff.x);
    
        pos2D.push(new Vector2(0, -thickness / 2.0));
        pos2D.push(new Vector2(length, -thickness / 2.0));
        pos2D.push(new Vector2(0, thickness / 2.0));
        pos2D.push(new Vector2(length, thickness / 2.0));
    
        var m = Matrix.CreateRotationZ(angle);
    
        for (var i = 0; i < 4; i++)
        {
            pos2D[i] = m.TransformVector2(pos2D[i]);
            pos2D[i].x += v0.x;
            pos2D[i].y += v0.y;
        }
    
        this.addTri(pos2D[0], pos2D[1], pos2D[2], col);
        this.addTri(pos2D[1], pos2D[3], pos2D[2], col);
    }
    
    addTri(a,b,c, col)
    {
        this.addVert(a.x, a.y, 0, col.r,col.g,col.b,col.a)
        this.addVert(b.x, b.y, 0, col.r,col.g,col.b,col.a)
        this.addVert(c.x, c.y, 0, col.r,col.g,col.b,col.a)
    }
    
    
    addRect(x,y,w,h,col)
    {
        
        this.addVert(x,y,0,col.r,col.g,col.b,col.a);
        this.addVert(x+w,y,0,col.r,col.g,col.b,col.a);
        this.addVert(x,y+h,0,col.r,col.g,col.b,col.a);
        
        this.addVert(x+w,y,0,col.r,col.g,col.b,col.a);
        this.addVert(x+w,y+h,0,col.r,col.g,col.b,col.a);
        this.addVert(x,y+h,0,col.r,col.g,col.b,col.a);
    }
    
    Draw(gl, matrix, primCount, primType)
    {
        gl.useProgram(this.program);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.colourLocation);
        
        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertBuffer, gl.STATIC_DRAW);
        
        gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT,false,(3+4)*4,0);
        gl.vertexAttribPointer(this.colourLocation,4,gl.FLOAT,false,(3+4)*4,3*4)
        // set the color
        //gl.uniform4f(colorLocation, 0,1,1, 1);
        
        gl.uniformMatrix4fv(this.matrixLoc,false, matrix.m);
        
        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        gl.drawArrays(primType, 0, this.vertexIndex);
    }
}

var glDebugRenderer = new GLDebugRenderer();
