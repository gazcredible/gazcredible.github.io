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
    }
    
    init()
    {
        super.init();
    }
    
    update()
    {
        super.update();
        GameInst.updateScene();
    }
    
    draw()
    {
        super.draw();
        
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');

        GameInst.drawScene();
    }
}

