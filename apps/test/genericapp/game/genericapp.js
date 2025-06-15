class Genericapp
{
    constructor()
    {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();
    }
    
    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1600,900);
        
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        
        this.stateMachine.setState(GameState_Test.label());
    }
    
    Run()
    {
        GenericApp.oneTimeInit();
        setInterval(function()
        {
            GAZCanvas.update();
            
            Input.update();
    
            GenericApp.frameCount+= 1;
            GenericApp.stateMachine.update();
            
            var letterboxColour = 'rgb(32,32,32)';
            //Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            GenericApp.stateMachine.draw();
            
            //GAZCanvas.drawLetterbox(letterboxColour);
            
            GAZCanvas.Text(20, GenericApp.frameCount+":"+GenericApp.stateMachine.currentState,new Vector2(1600,20),'#ffffff','end');
            
        },17);
    }
}

GenericApp = new Genericapp();

