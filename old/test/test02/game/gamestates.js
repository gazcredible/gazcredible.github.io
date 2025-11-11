//*********************************************************************************************************************
//
//*********************************************************************************************************************
class GameState_Test extends StateMachineState
{
    static label()
    {
        return "GameState_Test";
    }

    constructor()
    {
        super();

        this.angle = 0;
    }

    init()
    {
        super.init()
    }

    update()
    {
        super.update();

        for(let i=0;i< DemoGameInst.things.length;i++)
        {
            DemoGameInst.things[i].Update();
        }
    }

    draw()
    {
        super.draw();

        var gl = DemoGameInst.gl;
        var drender = DemoGameInst.debugRenderer;

        gl.canvas.width = window.innerWidth;
        gl.canvas.height = window.innerHeight;


        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clearColor(0,0,0,1);

        drender.OnStartDrawing();

        for(let x=0;x< 13;x++)
        {
            for(let y=0;y<8;y++)
            {
                drender.AddRect( x*64,y*64, 32,32, [1,0,0,1]);
            }
        }

        let things = DemoGameInst.things;
        let len = things.length;

        for(let i=0;i< len;i++)
        {
            drender.AddRect( things[i].x, things[i].y
                ,16
                ,16
                ,things[i].colour)
        }

        //let m = matrix.CreateOrthoOffCenter(0,DemoGameInst.gl.canvas.width,DemoGameInst.gl.canvas.height,0,1,32000);
        let m = matrix.CreateOrthoOffCenter(0,800,480,0,1,32000);

        gl.disable(DemoGameInst.gl.CULL_FACE);

        DemoGameInst.debugRenderer.Draw(gl,m,6,gl.TRIANGLES);
        this.angle += 0.01;
    }
}