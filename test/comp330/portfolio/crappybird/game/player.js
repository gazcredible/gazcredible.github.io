class Player extends RectCollider
{
    /*
        Player - the player
        
        The player is a RectCollider with a sprite
     */
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
        //the bird has 3 frames [0,1,2] to get the text name of the current frame, it's bird_[frame]
        //doing it here reduces the amount of copypasta
        
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
            //update the bird's animation frames very slowly
            this.birdFrame += CrappyBirdInst.speed / 10;
    
            while (this.birdFrame >= 3)
            {
                this.birdFrame -= 3;
            }
    
            //get the size of the bird based on the size of its current frame
            //and use those values for its RectCollider
            this.w = CrappyBirdInst.texturePage.metadata.lookup[this.frameName()].w;
            this.h = CrappyBirdInst.texturePage.metadata.lookup[this.frameName()].h;
    
    
            //If the bird has hit either collider in the pillar, it's dead
            if (this.collides(CrappyBirdInst.pillar.topCollider)
                || this.collides(CrappyBirdInst.pillar.bottomCollider)
            )
            {
                this.collided = true;
                CrappyBirdInst.onPlayerDeath();
            }
    
            //if the bird has hit the pillar's success collider, we get 1 point
            //and the successcollider is disavled (isActivre = false)
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
            //If the player is alive, use the space bar || mouse buttor to let the player soar / flap
            if ((Input.getKeystate(KEYCODE_space_bar) === INPUT_PRESSED)
                ||(Input.currentMouseState == INPUT_PRESSED)
            )
            {
                //flappying will give the player an upward velocity
                this.velocityY = 2.5;
                CrappyBirdInst.playSample('sound_jump');
            }
        }
    
        //velocity is reduced each frame to make the bird eventally fall
        this.velocityY -= 0.075;
    
        // this is terminal velocity testing
        if (this.velocityY < -this.maxVelocityY)
        {
            this.velocityY = -this.maxVelocityY;
        }
        
        
        this.y -= this.velocityY;
        
        if(this.y < 10)
        {
            this.y = 10;
        }
    
        //if the bird hits the floor, it's death
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