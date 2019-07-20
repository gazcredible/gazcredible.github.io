
class mcgame
{
    constructor()
    {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();
        this.score = 0;
        
        this.ground = new Ground();
        this.ground.init();
    }
    
    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1024,768);
        
        //create assets
        
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        
        this.stateMachine.addState(GameState_Attract.label(), new GameState_Attract());
        /*
        this.stateMachine.addState(GameState_StartGame.label(), new GameState_StartGame());
        this.stateMachine.addState(GameState_WaveIntro.label(), new GameState_WaveIntro());
        this.stateMachine.addState(GameState_Wave.label(), new GameState_Wave());
        this.stateMachine.addState(GameState_PostWave.label(), new GameState_PostWave());
        this.stateMachine.addState(GameState_GameOver.label(), new GameState_GameOver());
        */
    
        this.stateMachine.setState(GameState_Attract.label());
    }

    update()
    {
    }

    draw()
    {
        GAZCanvas.Rect(new Rect(0, 0, 1024, 768),'#000000');
        
        this.ground.draw();
    }
    
    Run()
    {
        //do oneTimeInit once
        
        GameInst.oneTimeInit();
        
        setInterval(function()
        {
            //on each frame ...
            
            /*
                GAZCanvas.update() -    this does the reactive canvas functionality
                                        and needs to be called at the beginning of each
                                        update()
             */
            GAZCanvas.update();
            
            /*
                Input.update() -    Update system inputs (mouse, keyboard).
                                    Needs to be called each frame
             */
            Input.update();
            
            GameInst.frameCount+= 1;
            
            //do state machine update
            GameInst.stateMachine.update();
            
            //clear screen for drawing
            let letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            //do state machine draw
            GameInst.stateMachine.draw();
    
            //draw the letterbox over the screen to hide any overdraw
            GAZCanvas.drawLetterbox(letterboxColour);
        },17);
    }
}

GameInst = new mcgame();