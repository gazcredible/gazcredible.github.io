var DTFLevel = function()
{
    this.ripeFruitList = [];
    this.unripeFruitList = [];
    this.critterList = [];
    this.fruitType = "";
    this.backdrop = "";
}

DTFLevel.prototype.addCritter = function(inPosition, inType, inHeading)
{
    var c = new DTFCritter();
    c.position = inPosition.clone();
    c.type = inType;
    c.heading = inHeading;
    c.radius = 50;

    this.critterList.push(c);
};

DTFLevel.prototype.addFruit = function(inPosition, inRipe)
{
    var f = new DTFFruit();
    f.position = inPosition.clone();
    f.ripe = inRipe;
    f.radius = 20;

    if (this.fruitType == "orange")
    {
        f.radius = 12;
    }

    if(f.ripe == true)
    {
        this.ripeFruitList.push(f);
    }
    else
    {
        this.unripeFruitList.push(f);
    }
};


var DTFLevelScoreTable = function()
{
    this.levelScores = new Array
    (
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    );

    this.levelAccess = new Array
    (
        true,   //0
        false,  //1
        false,  //2
        false,  //3
        false,  //4
        false,  //5
        false,  //6
        false,  //7
        false,  //8
        false,  //9
        false,  //10
        false,  //11
        false,  //12
        false,  //13
        false,  //14
        false,  //15
        false,  //16
        false,  //17
        false,  //18
        false   //19
    );

    this.loadData();
}
DTFLevelScoreTable.prototype.getScore = function(inLevel)
{
    return this.levelScores[inLevel];
};

DTFLevelScoreTable.prototype.isLevelAvailable = function(inLevel)
{
    return this.levelAccess[inLevel];
};

DTFLevelScoreTable.prototype.unlockLevel = function(inLevel)
{
    this.levelAccess[inLevel] = true;
    this.writeScores();
};

DTFLevelScoreTable.prototype.setScore = function(inLevel,inScore)
{
    this.levelScores[inLevel] = inScore;
    this.writeScores();
};

DTFLevelScoreTable.prototype.writeScores = function()
{
    var d = new Date();

    var cookie = "";


    cookie += "scores," + this.levelScores.toString();
    cookie += ",access," + this.levelAccess.toString();

    d.setFullYear(d.getFullYear() + 1);

    cookie += "; expires=" +d;

    document.cookie = cookie;
}


DTFLevelScoreTable.prototype.loadData = function()
{
    if(document.cookie == "")
    {
        this.writeScores();
    }

    if(document.cookie != "")
    {
        var data = document.cookie.split(',');
        var mode = "";
        var counter = 0;

        for(var i=0;i<data.length;i++)
        {
            if(data[i] == "scores")
            {
                mode = 'scores';
                i++;
                counter = 0;
            }

            if(data[i] == "access")
            {
                mode = 'access';
                i++;
                counter = 0;
            }

            switch(mode)
            {
                case 'scores':
                    this.levelScores[counter] = parseFloat( data[i]);

                    if(this.levelScores[counter] < 21)
                    {
                        this.levelScores[counter] = 0;
                    }
                    counter++;
                    break;

                case 'access':
                    this.levelAccess[counter] = data[i]=='true'?true:false;
                    counter++;
                    break;

                default:
                    if(gDebugInfo == true)
                    {
                        alert('save data borked!');
                    }
                    break;
            }
        }
    }
};



