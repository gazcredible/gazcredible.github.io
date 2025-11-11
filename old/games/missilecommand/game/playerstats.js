class PlayerStats
{
    constructor()
    {
        this.cityState = [];

        this.score = 0;
        this.scoreMultiplier=0;
        this.wave = 0;

        this.onNewGame();
    }

    onNewGame()
    {
        this.cityState = [6];

        this.cityState[0] = true;
        this.cityState[1] = true;
        this.cityState[2] = true;
        this.cityState[3] = true;
        this.cityState[4] = true;
        this.cityState[5] = true;

        this.score = 0;
        this.wave = 0;
        this.scoreMultiplier = 1;
    }

    onLevelStart()
    {

    }

    onLevelComplete()
    {
        this.wave++;
    }

    isGameOver()
    {
        for(let i=0;i<this.cityState.length;i++)
        {
            if(this.cityState[i] == true)	return false;
        }

        return true;
    }
}