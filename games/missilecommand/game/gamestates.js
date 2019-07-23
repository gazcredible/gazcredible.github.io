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

        this.line0 = new LineCollider();
        this.line0.initFromPoints(new Vector2(-1024,0),new Vector2(1024,0));
        this.line1 = new LineCollider();
        this.line1.initFromPoints(new Vector2(-1024,0),new Vector2(1024,0));

        this.angle = 0;
        this.speed = ((0.05) * Math.PI)/180.0;
    }
    
    
    init()
    {
        //MCGame.Get().OnStartANewGame();
    }


    DEG2RAD(a)
    {
        return (a*Math.PI)/180.0;
    }
    
    update()
    {
        super.update()
    
        if(Input.getKeystate(KEYCODE_space_bar) == 'pressed')
        {
            GameInst.stateMachine.setState(GameState_StartGame.label());
        }
        else
        {
            GameInst.update();
        }

        this.angle += this.speed;

        var mat = Matrix.Multiply(Matrix.CreateRotationZ(this.angle) , Matrix.CreateTranslation(512,768/2) );
        this.line0.setTransform(mat);

        var mat = Matrix.Multiply(Matrix.CreateRotationZ(this.angle + this.DEG2RAD(90) ) , Matrix.CreateTranslation(512,768/2));
        this.line1.setTransform(mat);
    }
    
    draw()
    {
        super.draw()
    
        GameInst.draw();

        this.line0.draw('#ff0000');
        this.line1.draw('#ff0000');

        var colliders = [];
        this.line0.collides(this.line1,colliders);

        GameInst.ground.fenceCollider.collides(this.line0,colliders);
        GameInst.ground.fenceCollider.collides(this.line1,colliders);

        for(let i=0;i<colliders.length;i++)
        {
            GAZCanvas.Rect(new Rect(colliders[i].x-2, colliders[i].y-2,4,4),'#ffffff',true,1);
        }


        
        /*
        if (Library.DebugDraw.Get().effect != null)
        {
            Library.Viewport vp = MCGame.Get().gameResolution;
            Library.Viewport sp = MCGame.Get().screenResolution;
            
            Library.DebugDraw.Get().effect.Apply();
            
            Library.DebugDraw.Get().SetFontScale((10.0f * sp.Height)/vp.Height);
            
            Library.DebugDraw.Get().debugFont.SetFG(new Library.Colour(1, 1, 1));
            Library.DebugDraw.Get().Print(new Library.Vector2(sp.Width / 2, sp.Height / 3), Library.DebugFont.Justify.Centre, "MISSILE\nCOMMAND");
            Library.DebugDraw.Get().SetFontScale(1.0f);
            
            frontEndMenu.OnDraw(new Library.Vector2(sp.Width / 2, sp.Height * 2 / 3), (sp.Height/(float)vp.Height) );
        }*/
    }
}
/*
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
        MCGame.Get().OnStartANewGame();
    }
    
    update()
    {
        MCGame.Get().SetGameState(new GameState_WaveIntro());
        return true;
    }
    
    draw()
    {
        MCGame.Get().OnDrawGame();
    }
    
     void Exit()
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
        MCGame.Get().OnLevelStart();
    }
    
    update()
    {
        MCGame.Get().inputEventManager.ProcessInput();
        
        if((frameCount > (2*30) ))
        {
            MCGame.Get().SetGameState(new GameState_Wave());
        }
        
        MCGame.Get().player.Update();
        
        return true;
    }
    
    draw()
    {
        Library.Viewport vp = MCGame.Get().gameResolution;
        
        MCGame.Get().OnDrawGame();
        
        DebugDraw.Get().SetFontScale(3 * MCGame.Get().ScaleFactor.y);
        MCGame.Get().GUIPrint(new Vector2(vp.Width / 2, vp.Height / 3) * MCGame.Get().ScaleFactor, "PLAYER 1");
        
        
        MCGame.Get().GUIPrint(new Vector2(vp.Width/2,vp.Height/2) * MCGame.Get().ScaleFactor,"" + MCGame.Get().playerStats.scoreMultiplier + " X POINTS");
        
        if(frameCount%20 > 10)
        {
            MCGame.Get().GUIPrint(new Vector2(290,600) * MCGame.Get().ScaleFactor,"DEFEND");
            MCGame.Get().GUIPrint(new Vector2(720,600) * MCGame.Get().ScaleFactor,"CITIES");
        }
    }
    
     void Exit()
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
        MCGame.Get().bDisableMissileLaunch = false;
    }
    
    update()
    {
        MCGame.Get().OnUpdateGame();
        
        if(MCGame.Get().hasWaveFinished() == true)
        {
            MCGame.Get().SetGameState(new GameState_PostWave() );
        }
        
        return true;
    }
    
    draw()
    {
        MCGame.Get().OnDrawGame();
    }
    
      void Exit()
    {
        
    }
}

class GameState_PostWave extends StateMachineState
{
enum Stage{CountMissles, CountCities,Wait};
    
    Stage currentState;
    int missileCount;
    int displayMissles;
    int cityCount;
    
    int missileBonus;
    
    int displayCities;
    int cityBonus;
    int tickRate;

    static label()
    {
        return "GameState_PostWave";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
        currentState = Stage.CountMissles;
        missileCount =0;
        missileBonus = 0;
        displayMissles = 0;
        
        displayCities = 0;
        cityBonus = 0;
        
        for(int i=0;i<3;i++)
        {
            missileCount += MCGame.Get().Silos[i].GetMissileCount();
        }
        
        cityCount = 0;
        
        for(int i=0;i<6;i++)
        {
            cityCount += MCGame.Get().Cities[i].IsValid()?1:0;
        }
        
        tickRate = 5;
        
        MCGame.Get().disableEmptySiloText = true;
    }
    
    update()
    {
        MCGame.Get().inputEventManager.ProcessInput();
        
        if((frameCount > tickRate) && (frameCount>0))
        {
            frameCount = 0;
            
            switch(currentState)
            {
                case Stage.CountMissles:
                {
                    if(missileCount > 0 )
                    {
                        displayMissles++;
                        missileBonus += 5 * MCGame.Get().playerStats.scoreMultiplier;
                        missileCount--;
                        
                        MCGame.Get().RemoveBulletForPostWave();
                        
                        GameAudio.Get().PlayMissilePostWave();
                    }
                    else
                    {
                        currentState = Stage.CountCities;
                        tickRate = 20;
                        MCGame.Get().playerStats.score += missileBonus;
                    }
                }
                    break;
                
                case Stage.CountCities:
                {
                    if(cityCount > 0)
                    {
                        displayCities++;
                        cityBonus += 100 * MCGame.Get().playerStats.scoreMultiplier;
                        cityCount--;
                        
                        GameAudio.Get().PlayCityPostWave();
                        MCGame.Get().RemoveCityForPostWave();
                    }
                    else
                    {
                        currentState = Stage.Wait;
                        tickRate = 100;
                        
                        MCGame.Get().playerStats.score += cityBonus;
                    }
                }
                    break;
                
                case Stage.Wait:
                {
                    if(MCGame.Get().IsGameOver() == true)
                    {
                        MCGame.Get().SetGameState(new GameState_GameOver());
                    }
                    else
                    {
                        MCGame.Get().OnLevelComplete();
                        MCGame.Get().SetGameState(new GameState_WaveIntro());
                    }
                }
                    break;
            }
        }
    }
    
    draw()
    {
        int x = 210;
        int y = 130;
        
        MCGame.Get().OnDrawGame();
        
        //Library.DebugDraw.Get ().Rect2D(new Library.Rectangle(x,y,520,250),new Library.Colour(1,0,0) );
        
        DebugDraw.Get().SetFontScale(3 * MCGame.Get().ScaleFactor.y);
        MCGame.Get().GUIPrint(MCGame.Get().ScalePosition(new Library.Vector2(x+282,y+10)) * MCGame.Get().ScaleFactor,"BONUS POINTS");
        
        MCGame.Get().GUIPrint(MCGame.Get().ScalePosition(new Library.Vector2(x + 40, y + 110)) * MCGame.Get().ScaleFactor, "" + missileBonus);
        MCGame.Get().GUIPrint(MCGame.Get().ScalePosition(new Library.Vector2(x + 40, y + 210)) * MCGame.Get().ScaleFactor, "" + cityBonus);
        
        for(int i=0;i<displayMissles;i++)
        {
            MCGame.Get().drawingManager.DrawMissile(MCGame.Get().ScalePosition(new Library.Vector2((x+180 + (i*10)),y+110)));
        }
        
        for(int i=0;i<displayCities;i++)
        {
            MCGame.Get().drawingManager.DrawCity(MCGame.Get().ScalePosition(new Library.Vector2(x + 180 + (i * (50 + 5)), y + 200)));
        }
        
        MCGame.Get ().OnEndDrawGame();
    }
    
    exit()
    {
        MCGame.Get().disableEmptySiloText = false;
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
    }
    
    update()
    {
        if((frameCount > (4*60) ))
        {
            MCGame.Get().SetGameState(new GameState_Attract());
        }
        return base.Update();
    }
    
    draw()
    {
        MCGame.Get().OnDrawGame();
        Library.Viewport vp = MCGame.Get().gameResolution;
        Library.Viewport sp = MCGame.Get().screenResolution;
        
        Library.DebugDraw.Get().SetFontScale((10.0f * sp.Height) / vp.Height);
        
        Library.DebugDraw.Get().debugFont.SetFG(new Library.Colour(1, 1, 1));
        Library.DebugDraw.Get().Print(new Library.Vector2(sp.Width / 2, sp.Height / 3), Library.DebugFont.Justify.Centre,"GAME\nOVER");
        Library.DebugDraw.Get().SetFontScale(1.0);
    }
}
*/