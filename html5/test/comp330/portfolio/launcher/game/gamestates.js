//*********************************************************************************************************************
//
//*********************************************************************************************************************
class ElementInfo
{
    constructor(filename, buttonSize, launchPage)
    {
        this.image = new Image();
        this.image.src = filename;
        
        this.rect = buttonSize;
        this.launchPage = launchPage;
    }
    
    draw()
    {
        GAZCanvas.Sprite(this.image, this.rect);
    }
    
    launch()
    {
        window.location.href = this.launchPage;
    }
}


class GameState_Portfolio extends StateMachineState
{
    static label()
    {
        return "GameState_Portfolio";
    }
    
    
    constructor()
    {
        super();
    
        this.elementInfo = {};
        
        this.elementInfo['ast'] = new ElementInfo("launcher/assets/ast.png", new Rect(100,100,400,300),'asteroids-canvas');
        this.elementInfo['fb'] = new ElementInfo("launcher/assets/fb.png", new Rect(600,100,400,300),'fretboard-v2');
        this.elementInfo['cb'] = new ElementInfo("launcher/assets/cb.png", new Rect(500,450,200,400),'crappybird');
        this.elementInfo['dm'] = new ElementInfo("launcher/assets/dm.png", new Rect(1100,100,400,300),'drum machine');
        this.elementInfo['life'] = new ElementInfo("launcher/assets/life.png", new Rect(900,450,400,300),'life');
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update();
        
        if(Input.currentMouseState !== INPUT_NOT_PRESSED)
        {
            for(var key in this.elementInfo)
            {
                if(this.elementInfo[key].rect.isInMe(Input.mouseLogicalPos) == true)
                {
                    this.elementInfo[key].launch();
                }
            }
        }
    }
    
    draw()
    {
        super.draw();
    
        GAZCanvas.Rect(new Rect(0,0,1600,900),'#1f1f1f');
        
        for(var key in this.elementInfo)
        {
            this.elementInfo[key].draw();
        }
        
        if( (this.frameCount%60) > 30)
        {
            GAZCanvas.Text(64, "Click to Play!", new Vector2(875, 850), '#ffffff', 'left', 'Archivo Black');
        }
        
    }
}