class DebugRenderer
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
        this.positionLocation = gl.getAttribLocation(program, "position");
        this.colourLocation = gl.getAttribLocation(program, "colour");

        // lookup uniforms
        this.colorLocation = gl.getUniformLocation(program, "color");
        this.matrixLoc = gl.getUniformLocation(program, "matrix");

        // Create a buffer to put positions in
        this.positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    }

    OnStartDrawing()
    {
        this.vertexIndex = 0;
    }

    AddVert(x,y,z,r,g,b,a)
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

    AddRect(x,y,w,h,col=[1,0,0,1])
    {

        this.AddVert(x,y,0,col[0],col[1],col[2],col[3])
        this.AddVert(x+w,y,0,col[0],col[1],col[2],col[3])
        this.AddVert(x,y+h,0,col[0],col[1],col[2],col[3])

        this.AddVert(x+w,y,0,col[0],col[1],col[2],col[3])
        this.AddVert(x+w,y+h,0,col[0],col[1],col[2],col[3])
        this.AddVert(x,y+h,0,col[0],col[1],col[2],col[3])
    }

    Draw(gl, matrix, primCount, primType)
    {
        gl.useProgram(program);
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