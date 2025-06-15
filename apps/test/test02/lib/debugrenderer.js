class DebugRenderer
{
    constructor()
    {
        this.program;
        this.positionLocation;
        this.colourLocation;
        this.colorLocation;
        this.matrixLoc;

        this.srcVerts;
        this.vertexIndex = 0;
        this.vertBuffer;

        this.srcIndices;
        this.indexBuffer;

        this.indexIndex = 0;
    }

    Init(gl,vertCount)
    {
        this.srcVerts = new Float32Array(vertCount*7);
        this.srcIndices = new Int32Array(vertCount *6);

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

        // Create a buffer to put vertices in
        this.vertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        var uints_for_indices = gl.getExtension("OES_element_index_uint");
    }

    OnStartDrawing()
    {
        this.vertexIndex = 0;
        this.indexIndex  = 0;
    }

    AddVert(x,y,z,r,g,b,a)
    {
        let index = (this.vertexIndex*7);

        this.srcVerts[index+0] = x;
        this.srcVerts[index+1] = y;
        this.srcVerts[index+2] = z;

        this.srcVerts[index+3] = r;
        this.srcVerts[index+4] = g;
        this.srcVerts[index+5] = b;
        this.srcVerts[index+6] = a;

        this.vertexIndex++;

    }

    AddRect(x,y,w,h,col=[1,0,0,1])
    {

        if(true) {
            let a = [0, 1, 2, 1, 3, 2];

            for (let i = 0; i < a.length; i++) {
                this.srcIndices[this.indexIndex] = this.vertexIndex + a[i];
                this.indexIndex++;
            }

            this.AddVert(x, y, 0, col[0], col[1], col[2], col[3])
            this.AddVert(x + w, y, 0, col[0], col[1], col[2], col[3])
            this.AddVert(x, y + h, 0, col[0], col[1], col[2], col[3])

            //this.AddVert(x+w,y,0,col[0],col[1],col[2],col[3])
            this.AddVert(x + w, y + h, 0, col[0], col[1], col[2], col[3])
            //this.AddVert(x,y+h,0,col[0],col[1],col[2],col[3])
        }
        else
        {
/*
            this.srcIndices[this.indexIndex] = this.vertexIndex; this.indexIndex++;
            this.AddVert(x, y, 0,col[0], col[1], col[2], col[3])
            this.srcIndices[this.indexIndex] = this.vertexIndex; this.indexIndex++;
            this.AddVert(x + w, y, 0, col[0], col[1], col[2], col[3])
            this.srcIndices[this.indexIndex] = this.vertexIndex; this.indexIndex++;
            this.AddVert(x, y + h, 0, col[0], col[1], col[2], col[3])
*/
            this.srcIndices[this.indexIndex] = this.vertexIndex; this.indexIndex++;
            this.AddVert(x+w,y,0,col[0],col[1],col[2],col[3])
            this.srcIndices[this.indexIndex] = this.vertexIndex; this.indexIndex++;
            this.AddVert(x + w, y + h, 0, col[0], col[1], col[2], col[3])
            this.srcIndices[this.indexIndex] = this.vertexIndex; this.indexIndex++;
            this.AddVert(x,y+h,0,col[0],col[1],col[2],col[3])

        }
    }

    Draw(gl, matrix, primCount, primType)
    {
        gl.useProgram(this.program);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.colourLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.srcVerts, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.srcIndices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT,false,(3+4)*4,0);
        gl.vertexAttribPointer(this.colourLocation,4,gl.FLOAT,false,(3+4)*4,3*4)
        // set the color
        //gl.uniform4f(colorLocation, 0,1,1, 1);

        gl.uniformMatrix4fv(this.matrixLoc,false, matrix.m);

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        //gl.drawArrays(primType, 0, this.vertexIndex);
        gl.drawElements(primType,this.indexIndex,gl.UNSIGNED_INT,0);
    }
}