class Game
{
    constructor()
    {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();

        this.audio_context=0;
        this.masterVolume=0;
    }

    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1600, 900);
    
        //set up state machine and set initial state to GameState_Attract
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.setState(GameState_Test.label());

        //set up audio and load all the samples
        this.audio_context = new (window.AudioContext || window.webkitAudioContext)();
    
        this.masterVolume = this.audio_context.createGain();
        this.masterVolume.gain.value = 1.0;
        this.masterVolume.connect(this.audio_context.destination);
     }

    
    onAttactMode()
    {
    }

    onReadyToStartNewGame()
    {
    }
    
    onPlayerDeath()
    {
    }

    updateScene()
    {
    }

    drawScene()
    {
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');

        Canvas.ctx().imageSmoothingEnabled = false;
    }

    Run()
    {
        GameInst.oneTimeInit();
        setInterval(function()
        {
            //Update GAZCanvas to keep the application reactive (the correct aspect ratio)
            GAZCanvas.update(60);
            
            //update input control
            Input.update();
    
            GameInst.frameCount+= 1;
            GameInst.stateMachine.update();
            
            //draw background in letterbox colour
            let letterboxColour = 'rgb(0,0,0)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            //draw current game state
            GameInst.stateMachine.draw();
            
            //draw letterbox on top of everything to hide whatever needs hiding ;)
            GAZCanvas.drawLetterbox(letterboxColour);
            //want the screen rect drawn?
            //GAZCanvas.Rect(new Rect(0,0,GAZCanvas.referenceScreenSize.w,GAZCanvas.referenceScreenSize.h),'rgb(255,0,0)',false,2);
            
            //GAZCanvas.Text(20, GameInst.frameCount+":"+GameInst.stateMachine.currentState,new Vector2(1600,20),'#ffffff','end');
            
        },17);
    }
}

GameInst = new Game();

