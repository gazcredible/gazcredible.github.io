function loadFile(filePath)
{
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
    return result;
}



class Ground extends GameObject
{
    constructor()
    {
        super();
        
        this.image = new Image();
        this.image.src = "data/font.png";
        
        this.data = [];
    
        this.data.push(6);
        this.data.push(7);
        this.data.push(7);
        this.data.push(8);
        this.data.push(9);
        this.data.push(9);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(9);
        this.data.push(8);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(7);
        this.data.push(7);
        this.data.push(8);
        this.data.push(8);
        this.data.push(7);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(6);
        this.data.push(6);
        this.data.push(7);
        this.data.push(7);
        this.data.push(8);
        this.data.push(8);
    
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
    
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
    
        this.data.push(9);
        this.data.push(8);
        this.data.push(7);
        this.data.push(7);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
    
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
    
        this.data.push(7);
        this.data.push(7);
        this.data.push(8);
        this.data.push(7);
        this.data.push(7);
        this.data.push(7);
        this.data.push(7);
        this.data.push(7);
        this.data.push(7);
        this.data.push(7);
        this.data.push(8);
        this.data.push(7);
    
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
    
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
        this.data.push(5);
    
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
        this.data.push(6);
    
        this.data.push(7);
        this.data.push(8);
        this.data.push(8);
    
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(10);
        this.data.push(9);
        
        
        
        
    
        this.rand = new Random();
        this.rand.init(1234);
        this.no_of_lines = this.data.length;
    }
    
    init()
    {
        super.init();
    }
    
    update()
    {
        super.update();
    
        if(Input.getKeystate(KEYCODE_left_arrow) == 'pressed')
        {
            this.no_of_lines--;
        }
    
        if(Input.getKeystate(KEYCODE_right_arrow) == 'pressed')
        {
            this.no_of_lines++;
        }
    }
    
    
    random()
    {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
    
    getRandomColor()
    {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++)
        {
            color += letters[this.rand.getInt(0,letters.length) ];
        }
    return color;
    }
    
    draw()
    {
        this.update();
        
        super.draw();
        Canvas.ctx().imageSmoothingEnabled = false;
        GAZCanvas.Sprite(this.image, new Rect(0,0,256,256));
    
    
        Canvas.ctx().imageSmoothingEnabled = true;
        this.rand.reset();
        for(let i=0;i<this.no_of_lines;i++)
        {
            var r = new Rect();
            r.x = i*8;
            r.y = 768 - (this.data[i]*8);
            r.w = 9;
            r.h = 768 - r.y;
            
           // GAZCanvas.Rect(r,this.getRandomColor(),true,1);
           //GAZCanvas.Rect(r,'#ffff00',false,0);
            GAZCanvas.Rect(r,'#ffff00',true,1);
        }
        
        GAZCanvas.Text(24,this.no_of_lines+": "+this.data[this.no_of_lines], new Vector2(100,100),"#ffffff","left");
    }
}