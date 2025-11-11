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
        super.init()
    }
    
    update()
    {
        super.update()
    }
    
    draw()
    {
        super.draw()
    
        GAZCanvas.Rect(new Rect(0, 0, 1025, 768),'#000000');
        GAZCanvas.Text(32,"Hello: "+GameInst.frameCount,new Vector2(50,50),'#ffffff','left');
    
        if(Input.mouseLogicalPos !== undefined)
        {
            var modelRect = new Rect();
            modelRect.set(Input.mouseLogicalPos.x-5,Input.mouseLogicalPos.y-5,10,10);
            GAZCanvas.Rect(modelRect,"0x0000ff");
        
            var p = new Vector2();
            p.Set(Input.mouseLogicalPos);
            p.y -= 10;
            GAZCanvas.Text(12, Input.mouseLogicalPos.toString(), p, "#ffffff", 'left');
        }
    
        GAZCanvas.Text(32,"A: "+Input.getKeystate(65),new Vector2(50,150),'#ffffff','left');
    }
}


// **********************************************************************************************************************
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
        GameInst.onStartNewGame();
        GameInst.displayPlayer = false;
        GameInst.displayScore = false;
    }


    DEG2RAD(a)
    {
        return (a*Math.PI)/180.0;
    }
    
    update()
    {
        super.update()
    
        if(GameInst.inputEventManager.eventOccured("START_GAME") == true)
        {
            GameInst.stateMachine.setState(GameState_StartGame.label());
        }
    }
    
    draw()
    {
        super.draw();
    
        GameInst.onDrawGame();

        debugFont.setScale(10.0);
        debugFont.print(new Vector2(1024/ 2, 768 / 3), "MISSILE\nCOMMAND", 'centre');
        debugFont.setScale(1.0);

        if(GameInst.frameCount%30 > 15)
        {
            debugFont.setScale(2.0);
            debugFont.print(new Vector2(1024 / 2, 600), "PRESS <SPACE BAR> TO PLAY", 'centre');
            debugFont.setScale(1.0);
        }
    }
}

class GameState_StartGame extends StateMachineState
{
    static label()
    {
        return "GameState_StartGame";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
        GameInst.onStartNewGame();

        GameInst.displayPlayer = false;
        GameInst.displayScore = true;
    }
    
    update()
    {
        super.update();
        GameInst.stateMachine.setState(GameState_WaveIntro.label());
        return true;
    }
    
    draw()
    {
        GameInst.onDrawGame();
    }
    
    exit()
    {
        
    }
}

class GameState_WaveIntro extends StateMachineState
{
    static label()
    {
        return "GameState_WaveIntro";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
        GameInst.onLevelStart();
    }
    
    update()
    {
        super.update();

        if((this.frameCount > (2*30) ))
        {
            GameInst.stateMachine.setState(GameState_Wave.label());
        }
        
        GameInst.player.update();
        
        return true;
    }
    
    draw()
    {
        GameInst.onDrawGame();
        
        debugFont.setScale(3);
        debugFont.print(new Vector2(1024 / 2, 768 / 3) , "PLAYER 1",'centre');

        debugFont.print(new Vector2(1024/2,768/2),GameInst.playerStats.scoreMultiplier + " X POINTS",'centre');
        
        if(this.frameCount%20 > 10)
        {
            debugFont.print(new Vector2(290,600),"DEFEND",'centre');
            debugFont.print(new Vector2(720,600),"CITIES",'centre');
        }
    }
    
    exit()
    {
        
    }
}

class GameState_Wave extends StateMachineState
{
    static label()
    {
        return "GameState_Wave";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
        GameInst.disableMissileLaunch = false;

        GameInst.displayPlayer = true;
        GameInst.displayScore = true;
    }
    
    update()
    {
        super.update();
        GameInst.onUpdateGame();
        
        if(GameInst.waveEnded == true)
        {
            GameInst.stateMachine.setState(GameState_PostWave.label() );
        }
        
        return true;
    }
    
    draw()
    {
        GameInst.onDrawGame();
    }
    
    exit()
    {
        
    }
}

class GameState_PostWave extends StateMachineState
{
    constructor()
    {
        super();

        this.currentState = "";
        this.missileCount = 0;
        this.displayMissles = 0;
        this.cityCount = 0;
        this.missileBonus = 0;
        this.displayCities = 0;
        this.cityBonus = 0;
        this.tickRate = 0;
    }

    static label()
    {
        return "GameState_PostWave";
    }

    init()
    {
        super.init()
        this.currentState = 'Stage.CountMissles';
        this.missileCount =0;
        this.missileBonus = 0;
        this.displayMissles = 0;

        this.displayCities = 0;
        this.cityBonus = 0;
        
        for(let i=0;i<GameInst.silos.length;i++)
        {
            this.missileCount += GameInst.silos[i].missileCount;
        }
        
        this.cityCount = 0;
        
        for(let i=0;i<GameInst.cities.length;i++)
        {
            this.cityCount += GameInst.cities[i].active?1:0;
        }
        
        this.tickRate = 5;
        
        GameInst.disableEmptySiloText = true;

        GameInst.displayPlayer = false;
        GameInst.displayScore = true;
    }
    
    update()
    {
        super.update();

        if((GameInst.frameCount > this.tickRate) && (GameInst.frameCount>0))
        {
            GameInst.frameCount = 0;
            
            switch(this.currentState)
            {
                case 'Stage.CountMissles':
                {
                    if(this.missileCount > 0 )
                    {
                        this.displayMissles++;
                        this.missileBonus += 5 * GameInst.playerStats.scoreMultiplier;
                        this.missileCount--;
                        
                        GameInst.removeBulletForPostWave();
                        
                        //GameAudio.Get().PlayMissilePostWave();
                    }
                    else
                    {
                        this.currentState = 'Stage.CountCities';
                        this.tickRate = 20;
                        GameInst.playerStats.score += this.missileBonus;
                    }
                }
                    break;
                
                case 'Stage.CountCities':
                {
                    if(this.cityCount > 0)
                    {
                        this.displayCities++;
                        this.cityBonus += 100 * GameInst.playerStats.scoreMultiplier;
                        this.cityCount--;
                        
                        //GameAudio.Get().PlayCityPostWave();
                        GameInst.removeCityForPostWave();
                    }
                    else
                    {
                        this.currentState = 'Stage.Wait';
                        this.tickRate = 100;

                        GameInst.playerStats.score += this.cityBonus;
                    }
                }
                    break;
                
                case 'Stage.Wait':
                {
                    if(GameInst.isGameOver() == true)
                    {
                        GameInst.stateMachine.setState(GameState_GameOver.label());
                    }
                    else
                    {
                        GameInst.onLevelComplete();
                        GameInst.stateMachine.setState(GameState_WaveIntro.label());
                    }
                }
                    break;
            }
        }
    }
    
    draw()
    {
        let x = 210;
        let y = 130;
        
        GameInst.onDrawGame();

        debugFont.setScale(3);
        debugFont.print(new Vector2(x+282,y+10),"BONUS POINTS",'centre');

        debugFont.print(new Vector2(x + 40, y + 110), this.missileBonus.toString(),'right');
        debugFont.print(new Vector2(x + 40, y + 210), this.cityBonus.toString(),'right');
        
        for(let i=0;i<this.displayMissles;i++)
        {
            GameInst.drawMissile(new Vector2((x+180 + (i*10)),y+110));
        }
        
        for(let i=0;i<this.displayCities;i++)
        {
            GameInst.drawCity(new Vector2(x + 180 + (i * (50 + 5)), y + 200));
        }
    }
    
    exit()
    {
        GameInst.disableEmptySiloText = false;
    }
}

class GameState_GameOver extends StateMachineState
{
    static label()
    {
        return "GameState_GameOver";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
        GameInst.displayPlayer = false;
        GameInst.displayScore = true;
    }
    
    update()
    {
        super.update();
        if((this.frameCount > (4*60) ))
        {
            GameInst.stateMachine.setState(GameState_Attract.label());
        }
    }
    
    draw()
    {
        GameInst.onDrawGame();

        debugFont.setScale(10.0);
        debugFont.print(new Vector2(1024 / 2, 768 / 3),"GAME\nOVER",'centre');
        debugFont.setScale(1.0);
    }
}
