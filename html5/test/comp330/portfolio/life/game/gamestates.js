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
        
        this.width = Math.floor(1600/4);
        this.height = Math.floor(900/4);
        
        this.frames = new Array(2);
        this.frames[0] = new Array(this.width);
        this.frames[1] = new Array(this.width);
        
        for(let i=0;i< this.width;i++)
        {
            this.frames[0][i] = new Array(this.height);
            this.frames[1][i] = new Array(this.height);
        }
    
        for(let x=0;x< this.width;x++)
        {
            for(let y=0;y< this.height;y++)
            {
                this.frames[0][x][y] = false;
                this.frames[1][x][y] = false;
    
                this.frames[0][x][y] = (Math.random() > 0.5);
            }
        }
        
        
        this.source = 0;
    }
    
    init()
    {
        super.init()
    }
    
    getCount(inX,inY)
    {
        var count = 0;
    
        for (var x = -1; x < 2; x++)
        {
            for (var y = -1; y < 2; y++)
            {
                if ((((inX + x) >= 0) && ((inX + x) < this.width))
                    && (((inY + y) >= 0) && ((inY + y) < this.height))
                    && (!((x == 0) && (y == 0)))
                )
                {
                    count += this.frames[this.source][inX + x][inY + y] == true ? 1 : 0;
                }
            }
        }
        
        return count;
    }
    
    update()
    {
        var count = this.getCount(2, 1);
        
        
        //if(Input.getKeystate(KEYCODE_space_bar) == INPUT_PRESSED)
        {
            var dest = (this.source == 0) ? 1 : 0;
    
    
            for (var x = 0; x < this.width; x++)
            {
                for (var y = 0; y < this.height; y++)
                {
                    var count = this.getCount(x, y);
                    this.frames[dest][x][y] = false;
            

                    if (this.frames[this.source][x][y] == true)
                    {
                        count = this.getCount(x, y);
                        
                        if ((count == 2) || (count == 3))
                        {
                            this.frames[dest][x][y] = true;
                        }
                    }
                    else
                    {
                        if (count == 3)
                        {
                            this.frames[dest][x][y] = true;
                        }
                    }
                }
            }
    
            if (this.source == 0)
            {
                this.source = 1;
            }
            else
            {
                this.source = 0;
            }
        }
    }
    
    draw()
    {
        super.draw();
    
        GAZCanvas.Rect(new Rect(0,0,1600,900),'#000000');
    
        for (var x = 0; x < this.width; x++)
        {
            for (var y = 0; y < this.height; y++)
            {
                if(this.frames[this.source][x][y] == true)
                {
                    var w = 1600/this.width;
                    var h = 900/this.height;
                    
                    GAZCanvas.Rect(new Rect(x *w, y *h, w-1, h-1),'#ffffff');
                }
            }
        }
        
        
    }
}