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
        this.fgScrollX = 0;
        this.bgScrollX = 0;
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update()
    
        this.fgScrollX+= CrappyBirdInst.speed;
        this.bgScrollX+= CrappyBirdInst.speed*0.33;
    
        if(this.fgScrollX > 154)
        {
            this.fgScrollX -= 154;
        }
    
        if(this.bgScrollX > 144)
        {
            this.bgScrollX -= 144;
        }
    
        CrappyBirdInst.pillar.update(CrappyBirdInst.speed *0.75);
        
        if(CrappyBirdInst.pillar.isFinished() == true)
        {
            CrappyBirdInst.pillar.init();
        }
    
        CrappyBirdInst.player.update();
    }
    
    draw()
    {
        super.draw()
        
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');
        
        CrappyBirdInst.texturePage.DrawSprite('bg',new Vector2(-this.bgScrollX,0));
        CrappyBirdInst.texturePage.DrawSprite('bg',new Vector2(144-this.bgScrollX-1,0));
    
        CrappyBirdInst.pillar.draw();
        CrappyBirdInst.player.draw();
    
        CrappyBirdInst.texturePage.DrawSprite('fg',new Vector2(-this.fgScrollX,200));
        CrappyBirdInst.texturePage.DrawSprite('fg',new Vector2(154-this.fgScrollX-1,200));
        
        let str = CrappyBirdInst.score.toString();
        
        let pos = new Vector2((144/2 - (str.length*7.5)/2),20);
    
        for (var i = 0; i < str.length; i++)
        {
            CrappyBirdInst.texturePage.DrawSprite('big_'+str[i],pos);
            pos.x +=CrappyBirdInst.texturePage.metadata.lookup['big_'+i].w + 1;
        }
        
        //GAZCanvas.Rect(new Rect(144/2,0,1,256),'rgb(255,0,0)');
    }
}

//*********************************************************************************************************************
//
//*********************************************************************************************************************
class GameState_Attract extends StateMachineState
{
    static label()
    {
        return "GameState_Attract";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
        CrappyBirdInst.onAttactMode();
    }
    
    update()
    {
        super.update();
    
        if ((Input.getKeystate(KEYCODE_space_bar) === INPUT_PRESSED)
            ||(Input.currentMouseState == INPUT_PRESSED)
        )
        {
            CrappyBirdInst.playSample('sound_coin');
            CrappyBirdInst.stateMachine.setState(GameState_Ready.label());
        }
    }
    
    draw()
    {
        super.draw()
        CrappyBirdInst.drawScene();
    
        let info =CrappyBirdInst.texturePage.metadata.lookup['logo'];
        CrappyBirdInst.texturePage.DrawSprite('logo',new Vector2(144/2 - (info.w/2),64 - (info.h/2)));
    
        if(CrappyBirdInst.frameCount%60 > 30)
        {
            info = CrappyBirdInst.texturePage.metadata.lookup['start'];
            CrappyBirdInst.texturePage.DrawSprite('start', new Vector2(144 / 2 - (info.w / 2), 128));
        }
    }
}

//*********************************************************************************************************************
//
//*********************************************************************************************************************
class GameState_Ready extends StateMachineState
{
    static label()
    {
        return "GameState_Ready";
    }
    
    constructor()
    {
        super();
        this.x = 0;
        this.y = 0;
    }
    
    init()
    {
        super.init()
        CrappyBirdInst.onReadyToStartNewGame();
    }
    
    update()
    {
        super.update();
        
        if ((Input.getKeystate(KEYCODE_space_bar) === INPUT_PRESSED)
            ||(Input.currentMouseState == INPUT_PRESSED)
        )
        {
            CrappyBirdInst.playSample('sound_coin');
            CrappyBirdInst.stateMachine.setState(GameState_Play.label());
        }
    }
    
    draw()
    {
        super.draw()
        CrappyBirdInst.drawScene();
        CrappyBirdInst.player.drawInReadyMode()
        
        let info =CrappyBirdInst.texturePage.metadata.lookup['get_ready_logo'];
        CrappyBirdInst.texturePage.DrawSpriteInfo(info,new Vector2(144/2 - (info.w/2),64 - (info.h/2)));
        
        
            info = CrappyBirdInst.texturePage.metadata.lookup['tap_to_start'];
            CrappyBirdInst.texturePage.DrawSprite('tap_to_start', new Vector2(60,126));

    }
}

//*********************************************************************************************************************
//
//*********************************************************************************************************************
class GameState_Play extends StateMachineState
{
    static label()
    {
        return "GameState_Play";
    }
    
    constructor()
    {
        super();
        this.x = 0;
        this.y = 0;
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update();
    
        CrappyBirdInst.updateScene();
    }
    
    draw()
    {
        super.draw()
        CrappyBirdInst.drawScene();
    }
}

//*********************************************************************************************************************
//
//*********************************************************************************************************************
class GameState_Death extends StateMachineState
{
    static label()
    {
        return "GameState_Death";
    }
    
    constructor()
    {
        super();
        this.x = 0;
        this.y = 0;
    }
    
    init()
    {
        super.init()
        
    }
    
    update()
    {
        super.update();
        
        CrappyBirdInst.updateScene();
        
        if(CrappyBirdInst.player.collides(CrappyBirdInst.floor) == true)
        {
            CrappyBirdInst.stateMachine.setState(GameState_GameOver.label());
        }
    }
    
    draw()
    {
        super.draw()
        CrappyBirdInst.drawScene();
    }
}

//*********************************************************************************************************************
//
//*********************************************************************************************************************
class GameState_GameOver extends StateMachineState
{
    static label()
    {
        return "GameState_GameOver";
    }
    
    constructor()
    {
        super();
        this.x = 0;
        this.y = 0;
        this.medalname = '';
    }
    
    init()
    {
        super.init()
    
        this.medalname = 'medal_'+ Math.floor(Math.random()*4);
        
        if(CrappyBirdInst.score > CrappyBirdInst.bestScore)
        {
            CrappyBirdInst.bestScore = CrappyBirdInst.score;
        }
    }
    
    update()
    {
        super.update();
        
        if(this.frameCount > 60)
        {
            if ((Input.getKeystate(KEYCODE_space_bar) === INPUT_PRESSED)
                || (Input.currentMouseState == INPUT_PRESSED)
            )
            {
                CrappyBirdInst.playSample('sound_coin');
                CrappyBirdInst.stateMachine.setState(GameState_Attract.label());
            }
        }
    }
    
    draw()
    {
        super.draw()
        CrappyBirdInst.drawScene();
        
        //draw score table
        let info =CrappyBirdInst.texturePage.metadata.lookup['game_over_logo'];
        CrappyBirdInst.texturePage.DrawSprite('game_over_logo',new Vector2(144/2 - (info.w/2),64 - (info.h/2)));
    
        info =CrappyBirdInst.texturePage.metadata.lookup['game_over_table'];
        CrappyBirdInst.texturePage.DrawSprite('game_over_table', new Vector2((144-info.w)/2,126));
    
        
    
        CrappyBirdInst.texturePage.DrawSprite(this.medalname, new Vector2(29,148));
    
        CrappyBirdInst.drawBigNumbers(new Vector2(118,142),CrappyBirdInst.score);
        CrappyBirdInst.drawBigNumbers(new Vector2(118,162),CrappyBirdInst.bestScore);
    }
}