class App
{
    //1. get geom from unity
    //2.stick into webgl
    //3.render

    constructor()
    {
        this.frameCount = 0;
        this.drawTime = new Timer();


    }

    oneTimeInit()
    {
        this.vb = new VertexBuffer_POS_UV0_COL();


        this.angle = 0;
    }

    updateScene()
    {
        Input.update();

        this.angle += DEG_TO_RAD(1);
    }


    drawScene()
    {
        gl.canvas.width = window.innerWidth;
        gl.canvas.height = window.innerHeight;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0,0,1,1);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.disable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        simple_shader.texture_enabled = false;
        simple_shader.alpha_test = false;
        simple_shader.vertex_colour_enabled = true;
        simple_shader.projection = Matrix.Multiply( Matrix.CreateRotationZ(this.angle), Matrix.Multiply( Matrix.CreateTranslation(gl.canvas.width/2.0, gl.canvas.height/2.0,0), Matrix.CreateOrthoOffCenter(0, gl.canvas.width, gl.canvas.height, 0, -1, 1)));

        //https://webglfundamentals.org/webgl/lessons/webgl-3d-lighting-directional.html
        if (false)
        {
            let size = gl.canvas.height / 4.0;
            this.vb.addVert(-size, size, -1, 0, 0, 1, 1, 1, 1);
            this.vb.addVert(size, size, -1, 0, 0, 1, 1, 1, 1);
            this.vb.addVert(-size, -size, -1, 0, 0, 1, 1, 1, 1);

            this.vb.addVert(size, size, -1, 0, 0, 1, 1, 1, 1);
            this.vb.addVert(size, -size, -1, 0, 0, 1, 1, 1, 1);
            this.vb.addVert(-size, -size, -1, 0, 0, 1, 1, 1, 1);
            this.vb.commit();

            this.vb.drawArrays(gl.TRIANGLES, simple_shader);
        }
        else
        {
            this.vb.reset();

            let size = gl.canvas.height / 4.0;
            this.vb.addVert(-size, size, -1, 0, 0, 1, 0, 0, 1); //0
            this.vb.addVert( size, size, -1, 0, 0, 0, 1, 0, 1); //1

            this.vb.addVert(-size, -size, -1, 0, 0, 1, 1, 0, 1); //2
            this.vb.addVert( size, -size, -1, 0, 0, 1, 0, 1, 1); //3

            this.vb.srcIndices = [0,1,2, 1,3,2];

            this.vb.commit();
            this.vb.drawElements(gl.TRIANGLES, simple_shader);
        }
    }


    Run()
    {
        webgl_init();
        AppInst.oneTimeInit();

        setInterval(function()
        {
            AppInst.frameCount+= 1;
            AppInst.updateScene();

            AppInst.drawTime.addFrame();
            AppInst.drawScene();

        },16); //make this too small and the rendering will corrupt when moving in reverse (IDKY)
    }
}
