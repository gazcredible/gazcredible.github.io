/**
 * Created by gareth on 25/06/2018.
 */
 
class AstGame
{
    constructor()
    {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();
        this.ship = new Ship();
        this.explosionManager = new ExplosionManager();
        this.rockList = [];
        this.bulletList = [];
        
        this.score = 0;
        this.ships = 0;
        
        this.shotInterlockTime = 30;
    }
    
    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1600,900);
        
        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.addState(GameState_Attract.label(), new GameState_Attract());
        this.stateMachine.addState(GameState_StartGame.label(), new GameState_StartGame());
        this.stateMachine.addState(GameState_CreateWave.label(), new GameState_CreateWave());
        this.stateMachine.addState(GameState_PlaceShip.label(), new GameState_PlaceShip());
        this.stateMachine.addState(GameState_Play.label(), new GameState_Play());
        this.stateMachine.addState(GameState_EndOfWave.label(), new GameState_EndOfWave());
        this.stateMachine.addState(GameState_GameOver.label(), new GameState_GameOver());
    
        this.stateMachine.setState(GameState_Attract.label());
    }
    
    createRocks()
    {
        this.rockList = [];
        var rock = new Rock();
        rock.init(new Vector2(100, 0), 'big', new Vector2(0, -1));
        this.rockList.push(rock);
    
        var rock = new Rock();
        rock.init(new Vector2(500, 0), 'big', new Vector2(0, 1));
        this.rockList.push(rock);
    
        var rock = new Rock();
        rock.init(new Vector2(1000, 0), 'big', new Vector2(0, -1));
        this.rockList.push(rock);
    
        var rock = new Rock();
        rock.init(new Vector2(1500, 0), 'big', new Vector2(0, 1));
        this.rockList.push(rock);
    }
    
    resetScore()
    {
        this.score = 0;
        this.ships = 3;
    }
    
    placeShip()
    {
        this.ship.init();
        this.ship.active = true;
        this.ship.setInvincible();
    }
    
    explodeRock(rock)
    {
        this.explosionManager.add(rock);
        rock.active = false;
        
        if(rock.size =='big')
        {
            var i;
            for(i=0;i<7;i++)
            {
                var newRock = new Rock();
                this.rockList.push(newRock);
                newRock.initFromRock(rock);
            }
            
            this.score+=10;
        }
    
        if(rock.size =='med')
        {
            var i;
            for(i=0;i<5;i++)
            {
                var newRock = new Rock();
                this.rockList.push(newRock);
                newRock.initFromRock(rock);
            }
    
            this.score+=50;
        }
    
        if(rock.size =='sml')
        {
            this.score+=100;
        }
    }

    update()
    {
        //do collisions
    
        for(i=0; i<this.rockList.length;i++)
        {
            if(this.rockList[i].active == true)
            {
                // has hit bullet?
                var bullet=0;
                for(bullet=0;bullet<this.bulletList.length;bullet++)
                {
                    if( (this.bulletList[bullet].active == true)
                      &&(this.rockList[i].active == true)
                    )
                    {
                        if(this.bulletList[bullet].collider.collides(this.rockList[i].collider) == true)
                        {
                            this.explodeRock(this.rockList[i]);
                            this.bulletList[bullet].active = false;
                        }
                    }
                }
            }
    
            if( (this.rockList[i].active == true)
                &&(this.ship.active == true)
                &&(this.ship.isInvincible() == false)
            )
            {
                if(this.ship.collider.collides(this.rockList[i].collider) == true)
                {
                    this.explodeRock(this.rockList[i]);
                    
                    this.explosionManager.add(this.ship);
                    this.ship.active = false;
                    this.ships--;
                }
            }
        }
        
        //do updates
        
        if(this.ship.active == true)
        {
            this.ship.update();
        }
        
        this.bulletList.forEach(function(element)
        {
            element.update();
        });
    
        this.rockList.forEach(function(element)
        {
            element.update();
        });
    
        var i=0;
        var newlist = [];
        
        for(i=0; i<this.bulletList.length;i++)
        {
            if(this.bulletList[i].active == true)
            {
                newlist.push(this.bulletList[i]);
            }
        }
        
        this.bulletList = newlist;
    
        newlist = [];
    
        for(i=0; i<this.rockList.length;i++)
        {
            if(this.rockList[i].active == true)
            {
                newlist.push(this.rockList[i]);
            }
        }
    
        this.rockList = newlist;
    
        this.explosionManager.update();
    }
    
    pad(num, size)
    {
        var s = num + "";
        while (s.length < size) s = " " + s;
        return s;
    }

    draw()
    {
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');
    
        this.explosionManager.draw();
    
        if(this.ship.active == true)
        {
            this.ship.draw();
        }
        
        this.rockList.forEach(function(element)
        {
            element.draw();
        });
    
        this.bulletList.forEach(function(element)
        {
            element.draw();
        });
        
        if(this.stateMachine.currentState != GameState_Attract.label())
        {
            GAZCanvas.Text(30, this.score.toLocaleString('en-gb'),new Vector2(200,30),'#ffffff','right','Archivo Black');
            GAZCanvas.Text(30, "A:"+this.ships,new Vector2(200,60),'#ffffff','right','Archivo Black');
        }
    }

    Run()
    {
        AstGameInst.oneTimeInit();
        setInterval(function()
        {
            GAZCanvas.update();
            
            Input.update();
            
            AstGameInst.frameCount+= 1;
            AstGameInst.stateMachine.update();
            
            var letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            AstGameInst.stateMachine.draw();
    
            GAZCanvas.drawLetterbox(letterboxColour);
    
            GAZCanvas.Text(20, AstGameInst.frameCount+":"+AstGameInst.stateMachine.currentState,new Vector2(1600,20),'#ffffff','end');
    
        },17);
    }
}

AstGameInst = new AstGame();