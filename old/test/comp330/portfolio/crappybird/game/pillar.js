class Pillar
{
    /*
        Pillar - Flappy obstacles
        
        The pillar consists of a top and bottom part of Mario tubes, with associated colliders: top & bottom collider
        that are used to see if the player has hit the tubes and a successcollider to see if the player has made it
        though the gap successfully.
        
        Once the successCollider triggers, isActive is set to false to stop multiple successes
     */
    constructor()
    {
        this.posX =0;
        this.topCollider = new RectCollider();
        this.bottomCollider = new RectCollider();
        this.successCollider = new RectCollider();
        this.isActive = false;
    }
    
    init()
    {
        /*
            Work out a valid random position and gap for the pillar as its tube parts
         */
        
        var failed = false;
        do
        {
            this.posX = 144;
            this.posY = 25 + (Math.random() * 75);
            this.height = 50 + (Math.random() * 25);
    
            failed = false;
    
            var pipe_top_bit = 20;
            
            if( ( (this.posY - (this.height/2)) < pipe_top_bit)
              ||( (this.posY + (this.height/2)) <(CrappyBirdInst.texturePage.metadata.lookup['pipe_up'].h-pipe_top_bit) )
              ||( (this.posY + (this.height/2)) > 200 - pipe_top_bit)
            )
            {
                failed = true;
            }
            
            
        }while(failed);
    
        //set up colliders based on posY and width
        this.topCollider.x = this.posX;
        this.topCollider.y= this.posY-(this.height/2) - CrappyBirdInst.texturePage.metadata.lookup['pipe_down'].h;
        this.topCollider.w= CrappyBirdInst.texturePage.metadata.lookup['pipe_down'].w;
        this.topCollider.h= CrappyBirdInst.texturePage.metadata.lookup['pipe_down'].h;
    
        this.bottomCollider.x = this.posX;
        this.bottomCollider.y = this.posY+(this.height/2);
        this.bottomCollider.w= CrappyBirdInst.texturePage.metadata.lookup['pipe_up'].w;
        this.bottomCollider.h= CrappyBirdInst.texturePage.metadata.lookup['pipe_up'].h;
    
        this.successCollider.x = this.posX+CrappyBirdInst.texturePage.metadata.lookup['pipe_up'].w/2;
        this.successCollider.y = this.posY-(this.height/2);
        this.successCollider.w = 10;
        this.successCollider.h = this.height;
    
        this.isActive = true;
    }
    
    update(speed)
    {
        this.posX -= speed;
        
        this.topCollider.x = this.posX;
        this.bottomCollider.x = this.posX;
        this.successCollider.x = this.posX+CrappyBirdInst.texturePage.metadata.lookup['pipe_up'].w/2;
    }
    
    draw()
    {
        CrappyBirdInst.texturePage.DrawSprite('pipe_down',new Vector2(this.posX,this.posY-(this.height/2) - CrappyBirdInst.texturePage.metadata.lookup['pipe_down'].h));
        CrappyBirdInst.texturePage.DrawSprite('pipe_up',new Vector2(this.posX,this.posY+(this.height/2)));
    
        if(CrappyBirdInst.debugDraw == true)
        {
            GAZCanvas.Rect(this.topCollider, 'rgb(255,0,0)', false, 5);
            GAZCanvas.Rect(this.bottomCollider, 'rgb(255,0,0)', false, 5);
            GAZCanvas.Rect(this.successCollider, 'rgb(0,0,255)', false, 5);
        }
    }
    
    isFinished()
    {
        //the pilar is 'finished' once it is off the left hand side of the screen by its width
        //(i.e.) it's invsible
        
        return this.posX < -26;
    }
}