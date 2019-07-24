
class mcgame
{
    constructor()
    {
        this.inputEventManager = 0;

        this.frameCount = 0;
        this.stateMachine = new StateMachine();
        this.score = 0;
        
        this.ground = new Ground();

        this.player = new PlayerObject();
        this.cities = [];
        this.silos = [];

        this.baddieMissileList = [];
        this.playerMissileList =[];
        this.explosionList = [];


        this.levelManager = new LevelManager();
    }
    
    oneTimeInit()
    {
        this.inputEventManager = new MCInputEventManager ();

        GAZCanvas.referenceScreenSize = new Size(1024,768);
        
        //create assets
        this.ground.onOneTimeInit();
        this.levelManager.onOneTimeInit();
        
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

        this.onStartNewGame();
    }

    onStartNewGame()
    {
        let cityLocations  =
        [
            new Vector2(156,699),
            new Vector2(261,707),
            new Vector2(356,707),
    
            new Vector2(590,699),
            new Vector2(698,698),
            new Vector2(812,707),
        ];

        this.cities = [];

        for(let i=0;i<cityLocations.length;i++)
        {
            this.cities.push(new City(cityLocations[i],true));
        }

        let siloLocations =
        [
            new Vector2(90, 685),
            new Vector2(500, 685),
            new Vector2(960, 685),
        ];

        this.silos = [];

        for(let i=0;i<siloLocations.length;i++)
        {
            this.silos.push(new silo(siloLocations[i]));
        }

        this.levelManager.onStartNewGame();
    }

    update()
    {
    }

    draw()
    {
        GAZCanvas.Rect(new Rect(0, 0, 1024, 768),'#000000');
        
        this.ground.draw();
    }

    getActiveCityCount()
    {
        var count = 0
        for(let i=0;i<this.cities.length;i++)
        {
            if(this.cities[i].active == true)
            {
                count++;
            }
        }

        return count;
    }

    addPlayerMissile(position,target)
    {
        this.playerMissileList.push(new PlayerMissile(position,target));
    }

    addBaddieMissile(position,target,speed)
    {
        this.baddieMissileList.push(new BaddieMissile(position,target, speed) );
    }
    
    Run()
    {
        //do oneTimeInit once
        
        GameInst.oneTimeInit();
        
        setInterval(function()
        {
            GAZCanvas.update();

            Input.update();
            GameInst.inputEventManager.processInput();

            GameInst.levelManager.update();

            for(let i=0;i<GameInst.baddieMissileList.length;i++)
            {
                GameInst.baddieMissileList[i].update();

                let collisions = [];

                if(GameInst.ground.collider.collides(GameInst.baddieMissileList[i].collider,collisions) == true)
                {
                    GameInst.baddieMissileList[i].active = false;
                }
            }
            
            GameInst.frameCount+= 1;
            
            //do state machine update
            GameInst.stateMachine.update();
            
            //clear screen for drawing
            let letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            //do state machine draw
            GameInst.stateMachine.draw();

            for(let i=0;i<GameInst.baddieMissileList.length;i++)
            {
                GameInst.baddieMissileList[i].draw('#ff0000');
            }

            for(let i=0;i<GameInst.silos.length;i++)
            {
                GameInst.silos[i].draw();
            }

            for(let i=0;i<GameInst.cities.length;i++)
            {
                GameInst.cities[i].draw();
            }

    
            //draw the letterbox over the screen to hide any overdraw
            GAZCanvas.drawLetterbox(letterboxColour);
        },17);
    }
}

GameInst = new mcgame();