class Command
{
    execute()
    {

    }

    hasCompleted()
    {
        return false;
    }

    reset()
    {
    }

    static rand = new Random(1234);
}

class WaitCommand extends Command // wait for a number of ticks
{
    constructor(ticksToWait)
    {
        super();

        this.tickCount = 0;
        this.waitTime=0;

        this.reset();
        this.waitTime = ticksToWait;
    }

    execute()
    {
        this.tickCount++;
    }

    hasCompleted()
    {
        return (this.tickCount >= this.waitTime);
    }

    reset()
    {
        this.tickCount = 0;
    }
};

class ResetRandomCommand extends Command
{
    constructor()
    {
        super();
    }

    execute()
    {
        Command.rand.reset();
    }

    hasCompleted()
    {
        return true;
    }

    reset()
    {
    }
}

class LaunchMissileCommand extends Command
{
    constructor(count,delay)
    {
        super();
        this.missileCount = 0;
        this.tickDelay = 0;
        this.ticks = 0;
        this.currentMissiles = 0;

        this.missileCount = count;
        this.tickDelay = delay;

        this.reset();
    }

    execute()
    {
        if(this.ticks == this.tickDelay)
        {
            var start = new Vector2();
            var target = new Vector2();

            start.x = 50 + Command.rand.getInt(0,900);
            start.y = 20;

            if(Command.rand.getInt(0,100) > (10*GameInst.playerStats.scoreMultiplier) )
            //if(false)
            {
                target.x  = 25 + Command.rand.getInt(0,900);
                target.y = 768;
            }
            else
            {
                // go for a silo or city
                var targetIndex = Command.rand.getInt(0,9);

                if(targetIndex < 3)
                {
                    target.set(GameInst.silos[targetIndex].position);

                    var r = Command.rand.getInt(0,10);
                    var variance = r - 5;

                    target.x += variance;
                }
                else
                {
                    var targetCity = targetIndex-3;

                    while(GameInst.getActiveCityCount() > 0 && GameInst.cities[targetCity].active == false)
                    {
                        targetCity++;
                        targetCity %= 6;
                    }

                    target.set(GameInst.cities[targetCity].position); // TL corner
                    target.x += City.width()/2;
                    target.y += City.height()/2;
                }
            }

            var speed = 2.0 * GameInst.playerStats.scoreMultiplier/2.0;

            GameInst.addBaddieMissile(start,target,speed);

            this.ticks = 0;
            this.currentMissiles--;
        }
        else
        {
            this.ticks++;
        }
    }

    hasCompleted()
    {
        return (this.currentMissiles == 0);
    }

    reset()
    {
        this.ticks = 0;
        this.currentMissiles = this.missileCount;
    }
}

class IncreaseMultiplerCommand extends Command
{
    constructor()
    {
        super();
    }

    execute()
    {
        GameInst.increaseMultipler=true;
    }

    hasCompleted()
    {
        return true;
    }

}


class Level
{
    constructor()
    {
        this.commandList = [];
        this.commandIndex = 0;
    }

    addCommand(cmd)
    {
        this.commandList.push(cmd);
    }

    startlevel()
    {
        this.commandIndex = 0;
    }

    processCommand()
    {
        if(this.isLevelComplete() == false)
        {
            this.commandList[this.commandIndex].execute();

            if(this.commandList[this.commandIndex].hasCompleted() == true)
            {
                this.commandList[this.commandIndex].reset();

                this.commandIndex++;
            }
        }
    }

    isLevelComplete()
    {
        return this.commandIndex >= this.commandList.length;
    }
}

class LevelManager
{
    constructor()
    {
        this.levelList = [];
        this.levelIndex = 0;
    }

    onStartNewGame()
    {
        this.levelIndex = 0;
    }

    onOneTimeInit()
    {
        var level;

        if(true)
        {
            level = new Level();
            level.addCommand(new ResetRandomCommand());
            level.addCommand(new WaitCommand(20));
            level.addCommand(new LaunchMissileCommand(3,20));
            level.addCommand(new WaitCommand(120));
            level.addCommand(new LaunchMissileCommand(5,40));
            this.levelList.push(level);
        }

        if(true)
        {
            level = new Level();
            level.addCommand(new WaitCommand(10));
            level.addCommand(new LaunchMissileCommand(3,20));
            level.addCommand(new WaitCommand(60));
            level.addCommand(new LaunchMissileCommand(3,20));
            level.addCommand(new WaitCommand(60));
            level.addCommand(new LaunchMissileCommand(4,40));
            level.addCommand(new IncreaseMultiplerCommand());
            this.levelList.push(level);
        }

        if(true)
        {
            level = new Level();
            level.addCommand(new WaitCommand(60));
            level.addCommand(new LaunchMissileCommand(10,10));
            level.addCommand(new WaitCommand(60));
            level.addCommand(new LaunchMissileCommand(5,40));
            level.addCommand(new LaunchMissileCommand(5,40));
            this.levelList.push(level);
        }

        if(true)
        {
            level = new Level();
            level.addCommand(new WaitCommand(30));
            level.addCommand(new LaunchMissileCommand(3,20));
            level.addCommand(new WaitCommand(30));
            level.addCommand(new LaunchMissileCommand(3,20));
            level.addCommand(new WaitCommand(60));
            level.addCommand(new LaunchMissileCommand(3,20));
            level.addCommand(new WaitCommand(60));
            level.addCommand(new LaunchMissileCommand(3,20));
            level.addCommand(new WaitCommand(30));
            level.addCommand(new LaunchMissileCommand(3,20));
            level.addCommand(new WaitCommand(60));
            level.addCommand(new LaunchMissileCommand(9,10));
            level.addCommand(new IncreaseMultiplerCommand());
            this.levelList.push(level);
        }
    }

    update()
    {
        this.levelList[this.levelIndex].processCommand();
    }

    onStartNewGame()
    {
        this.levelIndex = 0;
    }

    startLevel()
    {
        if(this.isCurrentLevelComplete() == true)
        {
            this.levelIndex++;

            if(this.levelIndex >= this.levelList.length)
            {
                this.levelIndex = 0;
            }
        }

        this.levelList[this.levelIndex].startlevel();
    }

    isCurrentLevelComplete()
    {
        return this.levelList[this.levelIndex].isLevelComplete();
    }
}

