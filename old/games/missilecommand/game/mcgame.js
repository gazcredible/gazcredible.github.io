
class mcgame
{
    constructor()
    {
        this.inputEventManager = 0;
        this.disableEmptySiloText = false;
        
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

        this.playerStats = new PlayerStats();

        this.displayScore = false;
        this.displayPlayer = false;

        this.drawRand = new Random(1234);


        this.colourTable =
        [
            '#ffff00',
            '#0000ff',
            '#00ff00',
            '#ff0000',
            '#ff00ff',
            '#00ffff',
        ];

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
        this.stateMachine.addState(GameState_StartGame.label(), new GameState_StartGame());
        this.stateMachine.addState(GameState_WaveIntro.label(), new GameState_WaveIntro());
        this.stateMachine.addState(GameState_Wave.label(), new GameState_Wave());
        this.stateMachine.addState(GameState_PostWave.label(), new GameState_PostWave());
        this.stateMachine.addState(GameState_GameOver.label(), new GameState_GameOver());

    
        this.stateMachine.setState(GameState_Attract.label());

        this.onStartNewGame();
    }

    onStartNewGame()
    {
        this.player = new PlayerObject();
        this.playerStats = new PlayerStats();

        for(let i=0;i<this.cities.length;i++)
        {
            this.cities[i].active = true;
        }


        //GameAudio.Get().OnStartNewGame();
        this.baddieMissileList = [];
        this.playerMissileList = [];
        this.explosionList = [];

        this.onLevelStart();

        this.levelManager.onStartNewGame();

        this.disableEmptySiloText = false;
    }

    onLevelStart()
    {
        for(let i=0;i<this.silos.length;i++)
        {
            this.silos[i].onLevelStart(true);
        }

        for(let i=0;i<this.cities.length;i++)
        {
            this.cities[i].onLevelStart(this.playerStats.cityState[i]);
        }

        if(this.increaseMultipler == true)
        {
            this.playerStats.scoreMultiplier++;
            this.increaseMultipler = false;
        }

        this.playerStats.onLevelStart();

        this.player.onLevelStart(true);

        this.waveEnded = false;

        this.levelManager.startLevel();
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

    addExplosion(location, collidable, playerOwned)
    {
        this.explosionList.push(new Explosion(location,collidable,playerOwned));
    }

    isGameOver()
    {
        return this.playerStats.isGameOver();
    }

    onLevelComplete()
    {
        this.playerStats.onLevelComplete();
    }

    removeBulletForPostWave()
    {
        for(let i=0;i<this.silos.length;i++)
        {
            if(this.silos[i].getMissileCount() > 0)
            {
                this.silos[i].removeBulletForPostWave();
                return;
            }
        }
    }

    removeCityForPostWave()
    {
        for(let i=0;i<this.cities.length;i++)
        {
            if(this.cities[i].active == true)
            {
                this.cities[i].active = false;
                return;
            }
        }
    }



    onUpdateGame()
    {
        this.player.update();

        this.levelManager.update();
    
        if((this.levelManager.isCurrentLevelComplete() == true) && (this.baddieMissileList.length == 0))
        {
            // end of the level
            this.bDisableMissileLaunch = true;
    
            if((this.explosionList.length == 0) && (this.playerMissileList.length == 0))
            {
                // this really is the end of the level ...
                this.waveEnded = true;
            }
        }

        for(let i = 0; i<this.silos.count;i++)
        {
            this.silos[0].update();
        }
    
        if(true)
        {
            var newList  =[];
            for(let i=0;i<this.explosionList.length;i++)
            {
                this.explosionList[i].update();

                if(this.explosionList[i].active == true)
                {
                    newList.push(this.explosionList[i]);
                }
            }

            this.explosionList = newList;
        }

        if(true)
        {
            var newList  =[];
            for(let i=0;i<this.playerMissileList.length;i++)
            {
                this.playerMissileList[i].update();

                if(this.playerMissileList[i].isAtTarget() == true)
                {
                    this.addExplosion(this.playerMissileList[i].position,true,true);
                    //GameAudio.Get().StopMissileTravel(it.Value);
                }
                else
                {
                    newList.push(this.playerMissileList[i]);
                }
            }

            this.playerMissileList = newList;
        }

        if(true)
        {
            var newList  =[];
            for(let i=0;i<this.baddieMissileList.length;i++)
            {
                this.baddieMissileList[i].update();
                let explodedAlready = false;

                for(let j=0;j<this.explosionList.length;j++)
                {
                    if(this.explosionList[j].collider.isPointInMe(this.baddieMissileList[i].position) && explodedAlready == false)
                    {
                        explodedAlready = true;

                        if(this.explosionList[j].ownedByPlayer == true) // stop the player get scores for baddie explosions
                        {
                            this.playerStats.score += 10  * this.playerStats.scoreMultiplier;
                        }
                    }
                }

                if(explodedAlready == false)
                {
                    for (let j = 0; j < this.cities.length; j++)
                    {
                        if ((this.cities[j].active == true)
                            && (explodedAlready == false)
                            && (this.baddieMissileList[i].collider.collides(this.cities[j].collider) == true)

                        )
                        {
                            this.cities[j].onExplode();
                            explodedAlready = true;
                        }
                    }
                }

                if(explodedAlready == false)
                {
                    for (let j = 0; j < this.silos.length; j++)
                    {
                        if ((this.silos[j].active == true)
                            && (explodedAlready == false)
                            && (this.baddieMissileList[i].collider.collides(this.silos[j].collider) == true)
                        )
                        {
                            this.silos[j].onExplode();
                            explodedAlready = true;
                        }
                    }
                }

                if(explodedAlready == false)
                {
                    if ((this.baddieMissileList[i].collider.collides(this.ground.collider) == true) && (explodedAlready == false))
                    {
                        explodedAlready = true;
                    }
                }

                if(explodedAlready == true)
                {
                    this.addExplosion(this.baddieMissileList[i].position,true);
                }
                else
                {
                    newList.push(this.baddieMissileList[i]);
                }
            }

            this.baddieMissileList = newList;
        }

        for(let i=0;i<this.cities.length;i++)
        {
            this.playerStats.cityState[i] = this.cities[i].active;
        }
    }
    
    onDrawGame()
    {
        //GameAudio.Get ().Update();

        this.ground.draw(this.getGroundColour());

        for(let i=0;i<this.baddieMissileList.length;i++)
        {
            this.baddieMissileList[i].draw('#ff0000');
        }

        for(let i=0;i<this.silos.length;i++)
        {
            this.silos[i].draw();
        }

        for(let i=0;i<this.cities.length;i++)
        {
            this.cities[i].draw();
        }

        for(let i=0;i<this.playerMissileList.length;i++)
        {
            this.playerMissileList[i].draw('#ff0000');
        }

        for(let i=0;i<this.explosionList.length;i++)
        {
            this.explosionList[i].draw();
        }

        if(this.displayScore == true)
        {
            debugFont.setScale(3.0);
            debugFont.print(new Vector2(150, 20), this.playerStats.score.toString(), 'right');
            debugFont.setScale(1.0);
        }

        if(this.displayPlayer == true)
        {
            this.player.draw();
        }
    }

    randomColour()
    {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++)
        {
            color += letters[this.drawRand.getInt(0,letters.length) ];
        }

        return color;
    }

    getGroundColour()
    {
        return this.colourTable[(0 + this.playerStats.wave)%this.colourTable.length];
    }

    getPlayerColour()
    {
        return this.colourTable[(1 + this.playerStats.wave)%this.colourTable.length];
    }

    getBaddieColour()
    {
        return this.colourTable[(3 + this.playerStats.wave)%this.colourTable.length];
    }

    drawPlayerMarker(position, col)
    {
        debugFont.print(position,'X','centrexy');
    }

    drawMissile(position)
    {
        GAZCanvas.Rect(new Rect(position.x,position.y,5,8),this.getPlayerColour(),true);

    }

    drawCity(position)
    {
        let rects =
            [
                new Rect(0,6,6,15),
                new Rect(12,3,13,18),
                new Rect(3,14,12,7),
                new Rect(33,0,10,21),
                new Rect(23,+11,12,10),
                new Rect(42,+14,8,7),
            ];

        let main = this.getPlayerColour();
        let secondary = this.getBaddieColour();

        let cols =
            [
                main,main,secondary,main,secondary,secondary
            ];

        for (let i = 0; i < rects.length; i++)
        {
            GAZCanvas.Rect(new Rect(rects[i].x + position.x, rects[i].y+position.y, rects[i].w, rects[i].h), cols[i],true,1);
        }

    }



    Run()
    {
        //do oneTimeInit once
        
        GameInst.oneTimeInit();
        
        setInterval(function()
        {
            GAZCanvas.update(60);

            Input.update();
            GameInst.inputEventManager.processInput();

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

debugFont = new BitmapFont("data/font.png")