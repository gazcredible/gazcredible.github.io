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
        
        this.stateMachine.addState(GameState_Portfolio.label(), new GameState_Portfolio());
        
        this.stateMachine.setState(GameState_Portfolio.label());
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
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            GenericApp.stateMachine.draw();
            
            GAZCanvas.drawLetterbox(letterboxColour);
        },16);
    }
}

GenericApp = new Genericapp();

