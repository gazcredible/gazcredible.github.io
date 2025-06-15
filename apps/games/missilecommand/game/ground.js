class Ground extends GameObject
{
    constructor()
    {
        super();

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

        this.no_of_lines = this.data.length;

        let fenceSourcePoints = [];

        for(let i=0;i<this.no_of_lines;i++)
        {
            var r = new Rect();
            r.x = i*8;
            r.y = 768 - (this.data[i]*8);
            r.w = 9;
            r.h = 768 - r.y;
            fenceSourcePoints.push(new Vector2(r.x,r.y));
            fenceSourcePoints.push(new Vector2(r.x+8,r.y));
        }

        /*
        fenceSourcePoints = [];
        fenceSourcePoints.push(new Vector2(0,500));
        fenceSourcePoints.push(new Vector2(1024,500));
*/

        this.collider = new FenceCollider();
        this.collider.initFromFence(fenceSourcePoints);

        this.rand = new Random();
        this.rand.init(1234);
    }
    
    onOneTimeInit()
    {
        super.onOneTimeInit();
    }
    
    update()
    {
        super.update();
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

        this.rand.reset();
        for(let i=0;i<this.no_of_lines;i++)
        {
            var r = new Rect();
            r.x = i*8;
            r.y = 768 - (this.data[i]*8);
            r.w = 9;
            r.h = 768 - r.y;

            GAZCanvas.Rect(r,'#ffff00',true,1);
        }

    }
}