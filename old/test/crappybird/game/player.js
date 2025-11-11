class Player extends RectCollider
{
    constructor()
    {
        super();
        this.birdFrame = 0;
        
        this.x = 30;
        this.y = 256/2;
        this.velocityY = 0;
        
        this.collided = false;
        this.maxVelocityY = 1.25;
        this.isDead =false;
    }
    
    frameName()
    {
        return 'bird_'+Math.floor(this.birdFrame);
    }
    
    init()
    {
        this.birdFrame = 0;
    
        this.x = 30;
        this.y = 256/2;
        this.velocityY = 0;
    
        this.collided = false;
        this.maxVelocityY = 1.25;
        this.isDead =false;
    }
    
    update()
    {
        if(this.collided == false)
        {
            this.birdFrame += CrappyBirdInst.speed / 10;
    
            while (this.birdFrame >= 3)
            {
                this.birdFrame -= 3;
            }
    
            this.w = CrappyBirdInst.texturePage.metadata.lookup[this.frameName()].w;
            this.h = CrappyBirdInst.texturePage.metadata.lookup[this.frameName()].h;
    
    
            if (this.collides(CrappyBirdInst.pillar.topCollider)
                || this.collides(CrappyBirdInst.pillar.bottomCollider)
            )
            {
                this.collided = true;
                CrappyBirdInst.onPlayerDeath();
            }
    
            if (this.collides(CrappyBirdInst.pillar.successCollider)
                && (CrappyBirdInst.pillar.isActive === true)
            )
            {
                CrappyBirdInst.pillar.isActive = false;
                CrappyBirdInst.score++;
                CrappyBirdInst.playSample('sound_hit');
            }
        }
        
        if (this.collided == false)
        {
            if ((Input.getKeystate(KEYCODE_space_bar) === INPUT_PRESSED)
                ||(Input.currentMouseState == INPUT_PRESSED)
            )
            {
                //give the bird a boost up
                this.velocityY = 2.5;
                CrappyBirdInst.playSample('sound_jump');
            }
        }
    
        this.velocityY -= 0.075;
    
        if (this.velocityY < -this.maxVelocityY)
        {
            this.velocityY = -this.maxVelocityY;
        }
        
        
        this.y -= this.velocityY;
    
        if(CrappyBirdInst.player.collides(CrappyBirdInst.floor) == true)
        {
            CrappyBirdInst.onPlayerDeath();
        }
    }
    
    drawInReadyMode()
    {
        this.birdFrame = 1;
        CrappyBirdInst.texturePage.DrawSprite(this.frameName(),new Vector2(this.x,this.y) );
    }
    
    draw()
    {
        CrappyBirdInst.texturePage.DrawSprite(this.frameName(),new Vector2(this.x,this.y) );
    
        if(CrappyBirdInst.debugDraw == true)
        {
            if (this.collided == true)
            {
                GAZCanvas.Rect(this, 'rgb(255,255,0)', false, 5);
            }
            else
            {
                GAZCanvas.Rect(this, 'rgb(255,0,0)', false, 5);
            }
        }
    }
}