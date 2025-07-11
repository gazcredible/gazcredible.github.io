class CrappyBird
{
    /*
        CrappyBird
            Main crappybird class, handles everythign apart from gamestate definitions (gamestates.js), player (player.js) & pillar (pillar.js)
     */
    
    constructor()
    {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();
        this.texturePage = new TexturePage("assets/crappy_tp.png", crappy_tp);
        this.player = new Player();
    
        this.speed = 1;
        this.pillar = new Pillar();
        this.score = 0;
    
        this.fgScrollX = 0;
        this.bgScrollX = 0;
        
        this.isInProgress = false;
        this.floor = new RectCollider();
        this.floor.x = 0;
        this.floor.y = 200;
        this.floor.w = 144;
        this.floor.h = 10;
        
        this.bestScore = 0;
        
        this.debugDraw = false;
    
        this.audio_context=0;
        this.masterVolume=0;
    
        this.bufferLookup = {};
    }
    
    /*
        oneTimeInit() - One time initialisation function
        
        Sets up statemachne & audio system
     */
    oneTimeInit()
    {
        //Set the reference screen size to b 144x256 so that the game will scale to fit the aspect of the browser
        
        GAZCanvas.referenceScreenSize = new Size(144, 256);
    
        //set up state machine and set initial state to GameState_Attract
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.addState(GameState_Attract.label(), new GameState_Attract());
        this.stateMachine.addState(GameState_Ready.label(), new GameState_Ready());
        this.stateMachine.addState(GameState_Play.label(), new GameState_Play());
        this.stateMachine.addState(GameState_Death.label(), new GameState_Death());
        this.stateMachine.addState(GameState_GameOver.label(), new GameState_GameOver());
        this.stateMachine.setState(GameState_Attract.label());
    
        //set up audio and load all the samples
        this.audio_context = new (window.AudioContext || window.webkitAudioContext)();
    
        this.masterVolume = this.audio_context.createGain();
        this.masterVolume.gain.value = 1.0;
        this.masterVolume.connect(this.audio_context.destination);
    
        let sampleLabels = ["sound_coin", "sound_explode", "sound_hit","sound_jump","sound_shoot"];
        
        //load each sample and get them to use the function callback on successful load
        for(let i=0;i<sampleLabels.length;i++)
        {
            this.loadSample('assets/audio/'+sampleLabels[i]+".wav",sampleLabels[i],function(buffer,name)
            {
                //add sample data to bufferLookup as a dictionary entry of name -> buffer
                CrappyBirdInst.bufferLookup[name] = buffer;
            });
        }
    }
    
    //loadSample - this handles the local get for sample files
    loadSample(url, name, callback)
    {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function()
        {
            let audioData = request.response;
            CrappyBirdInst.audio_context.decodeAudioData(audioData, function(buffer)
            {
                callback(buffer,name);
            });
        };
        request.send();
    }
    
    /*
        playSample(string name)
        
        Play a sample on demand using 'name' as a look up into the bufferLookup
     */
    playSample(name)
    {
        if(name in this.bufferLookup)
        {
            let player = this.audio_context.createBufferSource();
            player.buffer = this.bufferLookup[name];
            player.loop = false;
            player.connect(this.masterVolume);
            player.start(this.audio_context.currentTime);
        }
    }
    
    onAttactMode()
    {
        this.isInProgress = false;
    }
    
    /*
        onReadyToStartNewGame - Set the game up for a new game
     */
    onReadyToStartNewGame()
    {
        this.pillar.init();
        this.player.init();
    
        this.fgScrollX = 0;
        this.bgScrollX = 0;
        this.speed = 1;
        this.score = 0;
        this.isInProgress = true;
        this.player.isDead = false;
    }
    
    onPlayerDeath()
    {
        this.player.isDead = true;
        this.stateMachine.setState(GameState_Death.label());
        this.playSample('sound_explode');
    }
    
    /*
        updateScene()
        
        Handle all the game updates and scroll the various layers at their different rates for parallax effect
     */
    updateScene()
    {
        if(this.player.isDead === false)
        {
            this.fgScrollX += this.speed;
            this.bgScrollX += this.speed * 0.33;
    
            if (this.fgScrollX > 154)
            {
                this.fgScrollX -= 154;
            }
    
            if (this.bgScrollX > 144)
            {
                this.bgScrollX -= 144;
            }
    
            this.pillar.update(this.speed * 0.75);
    
            //recycle pillar
            if (this.pillar.isFinished() === true)
            {
                this.pillar.init();
            }
        }
        
        this.player.update();
    }
    
    /*
        drawScene()
        
        Draw the layers of the game, bg first, then player and pillars finally with the fg
     */
    drawScene()
    {
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');
    
        //draw the bg with wrapping offset to give the impression of scrolling / moving
        CrappyBirdInst.texturePage.DrawSprite('bg',new Vector2(-this.bgScrollX,0));
        CrappyBirdInst.texturePage.DrawSprite('bg',new Vector2(144-this.bgScrollX-1,0));
    
        if(this.isInProgress === true)
        {
            CrappyBirdInst.pillar.draw();
            CrappyBirdInst.player.draw();
        }
    
        //draw the fg with wrapping offset to give the impression of scrolling / moving
        CrappyBirdInst.texturePage.DrawSprite('fg',new Vector2(-this.fgScrollX,200));
        CrappyBirdInst.texturePage.DrawSprite('fg',new Vector2(154-this.fgScrollX-1,200));
    
        if(this.isInProgress === true)
        {
            let str = this.score.toString();
    
            let pos = new Vector2((144 / 2 - (str.length * 7.5) / 2), 20);
    
            for (let i = 0; i < str.length; i++)
            {
                this.texturePage.DrawSprite('big_' + str[i], pos);
                pos.x += this.texturePage.metadata.lookup['big_' + i].w + 1;
            }
        }
    
        if(CrappyBirdInst.debugDraw === true)
        {
            GAZCanvas.Rect(this.floor, 'rgb(255,0,0)', false, 5);
        }
    }
    
    drawSmallNumbers(inPosition, value)
    {
        let str = value.toString();
    
        let pos = inPosition.clone();
    
        for (let i = 0; i < str.length; i++)
        {
            let info = this.texturePage.metadata.lookup['small_' + str[i] ];
            this.texturePage.DrawSpriteInfo(info, pos);
            pos.x += info.w + 1;
        }
    }
    
    drawBigNumbers(inPosition, value)
    {
        let str = value.toString();
        
        let pos = inPosition.clone();
        
        for (let i = 0; i < str.length; i++)
        {
            let info = this.texturePage.metadata.lookup['big_' + str[i] ];
            pos.x -= info.w + 1;
        }
    
        for (let i = 0; i < str.length; i++)
        {
            let info = this.texturePage.metadata.lookup['big_' + str[i] ];
            this.texturePage.DrawSpriteInfo(info, pos);
            pos.x += info.w + 1;
        }
    }
    
    /*
        Run()
        
        main game loop, called from index.html
     */
    
    Run()
    {
        CrappyBirdInst.oneTimeInit();
        setInterval(function()
        {
            //Update GAZCanvas to keep the application reactive (the correct aspect ratio)
            GAZCanvas.update();
            
            //update input controll
            Input.update();
    
            CrappyBirdInst.frameCount+= 1;
            CrappyBirdInst.stateMachine.update();
            
            //draw background in letterbox colour
            let letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            //draw current game state
            CrappyBirdInst.stateMachine.draw();
            
            //draw letterbox on top of everything to hide whatever needs hiding ;)
            GAZCanvas.drawLetterbox(letterboxColour);
            //want the screen rect drawn?
            //GAZCanvas.Rect(new Rect(0,0,GAZCanvas.referenceScreenSize.w,GAZCanvas.referenceScreenSize.h),'rgb(255,0,0)',false,2);
            
            GAZCanvas.Text(20, CrappyBirdInst.frameCount+":"+CrappyBirdInst.stateMachine.currentState,new Vector2(1600,20),'#ffffff','end');
            
        },17);
    }
}

CrappyBirdInst = new CrappyBird();

