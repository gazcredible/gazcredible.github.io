class Game
{
    constructor()
    {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();

        this.spritesheet = new TexturePage('assets/sprites_tp.png',sprites_tp);
        this.mazesheet = new TexturePage('assets/73389.png',maze_tp);

        this.audio_context=0;
        this.masterVolume=0;

        this.nodeMap = new NodeMap();
        this.pillMap = new PillMap();

        this.ghosts = [];
    }
    
    /*
        oneTimeInit() - One time initialisation function
        
        Sets up statemachne & audio system
     */
    oneTimeInit()
    {


        //Set the reference screen size to b 170 x192 so that the game will scale to fit the aspect of the browser
        
        GAZCanvas.referenceScreenSize = new Size(224, 248);
    
        //set up state machine and set initial state to GameState_Attract
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.setState(GameState_Test.label());

        //set up audio and load all the samples
        this.audio_context = new (window.AudioContext || window.webkitAudioContext)();
    
        this.masterVolume = this.audio_context.createGain();
        this.masterVolume.gain.value = 1.0;
        this.masterVolume.connect(this.audio_context.destination);

        this.pillMap.onNewLevel();


        for(let i=0;i<10;i++)
        {
            this.ghosts.push(new Ghost('red'));
            this.ghosts.push(new Ghost('pink'));
            this.ghosts.push(new Ghost('orange'));
            this.ghosts.push(new Ghost('cyan'));
        }
     }

    
    onAttactMode()
    {
    }
    
    /*
        onReadyToStartNewGame - Set the game up for a new game
     */
    onReadyToStartNewGame()
    {
    }
    
    onPlayerDeath()
    {
    }
    
    /*
        updateScene()
        
        Handle all the game updates and scroll the various layers at their different rates for parallax effect
     */
    updateScene()
    {
        for(let i=0;i<this.ghosts.length;i++)
        {
            this.ghosts[i].update();
        }
    }
    
    /*
        drawScene()
        
        Draw the layers of the game, bg first, then player and pillars finally with the fg
     */
    drawScene()
    {
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');

        Canvas.ctx().imageSmoothingEnabled = false;

        this.mazesheet.DrawSprite('bg',new Vector2(0,0));

        this.pillMap.draw();
        this.nodeMap.draw();

        for(let i=0;i<this.ghosts.length;i++)
        {
            this.ghosts[i].draw();
        }
    }

    /*
        Run()
        
        main game loop, called from index.html
     */
    
    Run()
    {
        GameInst.oneTimeInit();
        setInterval(function()
        {
            //Update GAZCanvas to keep the application reactive (the correct aspect ratio)
            GAZCanvas.update(60);
            
            //update input controll
            Input.update();
    
            GameInst.frameCount+= 1;
            GameInst.stateMachine.update();
            
            //draw background in letterbox colour
            let letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            //draw current game state
            GameInst.stateMachine.draw();
            
            //draw letterbox on top of everything to hide whatever needs hiding ;)
            GAZCanvas.drawLetterbox(letterboxColour);
            //want the screen rect drawn?
            //GAZCanvas.Rect(new Rect(0,0,GAZCanvas.referenceScreenSize.w,GAZCanvas.referenceScreenSize.h),'rgb(255,0,0)',false,2);
            
            GAZCanvas.Text(20, GameInst.frameCount+":"+GameInst.stateMachine.currentState,new Vector2(1600,20),'#ffffff','end');
            
        },17);
    }
}

GameInst = new Game();

