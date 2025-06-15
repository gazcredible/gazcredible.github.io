var gravity = 0.2;
var maxSpeed = 10.0;
var minScreenX = 120;
var maxScreenX = 700;
var maxScreenY = 470;

var DTFObject = function()
{
    this.position = new RMVector2();
    this.velocity = new RMVector2(0,0);
    this.colour = '#ffffff';
    this.radius = 10;
    this.orientation = 0;
    this.hit = false;
    this.objectType = "base";
}

DTFObject. prototype =
{
    init:function()
    {

    },

    update:function()
    {

    },

    collidesWith:function(obj)
    {
        var tmp = this.position.clone();
        tmp.x -= obj.position.x;
        tmp.y -= obj.position.y;
        return (tmp.length() < (this.velocity.length()+this.radius + obj.radius) );
    },

    isOnScreen:function()
    {
        var radiusFudge = this.radius*2;
        var rect = new RMRect(-radiusFudge,-radiusFudge, 800 +radiusFudge, 600 + radiusFudge );

        return rect.isInMe(this.position);
    },

    onCollidesWith:function(obj)
    {
    },

    setPosition:function(inPos)
    {
        this.position = inPos.clone();
    },

    draw:function()
    {
        gCanvas.GLStrokeCircle(this.position,this.radius,this.colour);
    },

    getRandomArbitrary:function(min, max)
    {
        return Math.random() * (max - min) + min;
    },

    copy:function(dest)
    {
        dest.position = this.position.clone();
        dest.velocity = this.velocity.clone();
        dest.colour = this.colour;
        dest.radius = this.radius;
        dest.orientation = this.orientation;

    },

    updateCollisionList:function(inObjectList)
    {
    },

    updateCollision:function(inObject)
    {
    },

    beenHit:function()
    {
        return this.hit;
    }
};
//============================================================================================

var DTFBall = function()
{
    this.colour = '#ffffff';
    //this.radius = 8;
    this.radius = 5;
    this.objectType = "ball";
};

DTFBall.prototype = new DTFObject();
DTFBall.prototype.constructor = DTFBall;

DTFBall.prototype.clone=function()
{
    var out = new DTFBall;
    this.copy(out);


    return out;
};


DTFBall.prototype.init = function()
{
    this.velocity = new RMVector2(5,20);
};

DTFBall.prototype.launch = function()
{
    this.velocity = this.getTrajectory();
    this.velocity.x *=7;
    this.velocity.y *=7;
};

DTFBall.prototype.getTrajectory = function()
{
    var armRoot = gGame.model.dim1.getArmPosition();

    var trajectory = new RMVector2();
    trajectory.x = this.position.x - armRoot.x;
    trajectory.y = this.position.y - armRoot.y;
    trajectory.normalise();

    var ang = Math.atan2(trajectory.x,trajectory.y);
    ang *= 2;

    if(ang > 0)
    {
        trajectory.x = Math.tan(ang);
        trajectory.y = 1/Math.tan(ang);

        if(trajectory.x < 0)
        {
            trajectory.x *= -1;
        }
    }
    else
    {
        trajectory.x = Math.tan(ang);
        trajectory.y = -1/Math.tan(ang);

        if(trajectory.x > 0)
        {
            trajectory.x *= -1;
        }
    }
    trajectory.normalise();

    return trajectory;
};

DTFBall.prototype.updateCollisionList = function(objectList)
{
    var collider = null;
    for(var i=0;i<objectList.length;i++)
    {
        if(this.collidesWith(objectList[i]) == true)
        {
            objectList[i].onCollidesWith(this);
            collider = objectList[i];
        }
    }

    if(collider != null)
    {
        this.onCollidesWith(collider);
        collider.onCollidesWith(this);
    }
};

DTFBall.prototype.updateCollision=function(inObject)
{
    if(inObject.collidesWith(this) == true)
    {
        inObject.onCollidesWith(this);
    }
};

DTFBall.prototype.update = function(bDoCollisions)
{
    if(bDoCollisions == undefined)
    {
        bDoCollisions = true;
    }

    if(bDoCollisions == true)
    {
        if( (this.position.y < maxScreenY)
          &&( (this.position.x < minScreenX)
            ||(this.position.x > (maxScreenX-(this.radius + this.velocity.x) ) ))
          )
        {
            this.velocity.x *= -1.0;

            //stop the ball getting sucked up and down the walls
            if(Math.abs(this.velocity.x) < 0.5)
            {
                if(this.position.x < (minScreenX+10))
                {
                    this.velocity.x = 0.5;
                }
                else
                {
                    this.velocity.x = -0.5;
                }
            }

            gGame.audio.playBallCollidesWithWall();
        }

        if (this.position.y < 5)
        {
            this.velocity.y *= -1.0;
        }
    }

    var newVel = this.velocity.clone();
    newVel.y += gravity;

    if (newVel.length() < maxSpeed)
    {
        this.velocity = newVel;
    }

    this.velocity.x -= this.velocity.x / 100.0;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
};

DTFBall.prototype.onCollidesWith=function(obj)
{
    var angle = this.position.clone();
    angle.x -= obj.position.x;
    angle.y -= obj.position.y;
    angle.normalise();

    if(Math.abs(angle.x) <0.1)
    {
        if(angle.x >0)
        {
            angle.x = 0.1;
        }
        else
        {
            angle.x = -0.1;
        }
    }

    this.velocity.x = this.velocity.length() * angle.x *0.9;
    this.velocity.y = this.velocity.length() * angle.y *0.9;

    if(this.velocity.length() < 0.2)
    {
        this.velocity.normalise();
        this.velocity.x *= 0.2;
        this.velocity.y *= 0.2;
    }
};

DTFBall.prototype.onCollidesWithCircularCollider= function(inCollider)
{
    var angle = this.position.clone();
    angle.x -= inCollider.position.x;
    angle.y -= inCollider.position.y;
    angle.normalise();

    if(Math.abs(angle.x) <0.1)
    {
        if(angle.x >0)
        {
            angle.x = 0.1;
        }
        else
        {
            angle.x = -0.1;
        }
    }

    this.velocity.x = this.velocity.length() * angle.x;
    this.velocity.y = this.velocity.length() * angle.y;
};

DTFBall.prototype.onCollidesWithLineCollider= function (inCollider, inCollision)
{
    var angle = this.position.clone();
    angle.x = inCollision.x;
    angle.y -= inCollision.y;
    angle.normalise();

    if(Math.abs(angle.x) <0.1)
    {
        if(angle.x >0)
        {
            angle.x = 0.1;
        }
        else
        {
            angle.x = -0.1;
        }
    }

    this.velocity.x = this.velocity.length() * inCollider.invGrad.x;
    this.velocity.y = this.velocity.length() * inCollider.invGrad.y;
};

DTFBall.prototype.projectBall= function (inVectorList,inFrames)
{
    var tempBall = this.clone();

    inVectorList.push(tempBall.position.clone() );

    tempBall.launch();
    for(var i=0;i<inFrames;i++)
    {
        tempBall.update(false);
        inVectorList.push(tempBall.position.clone() );
    }
};


//============================================================================================
var DTFFruit = function()
{
    this.colour = '#ff00ff';
    this.radius = 7;
    this.ripe = false;
    this.hit = false;
    this.objectType = "fruit";
};

DTFFruit.prototype = new DTFObject();
DTFFruit.prototype.constructor = DTFFruit;

DTFFruit.prototype.init = function()
{
};

DTFFruit.prototype.update = function()
{
};

DTFFruit.prototype.updateDrop = function()
{
    var newVel = this.velocity.clone();
    newVel.y += gravity;

    if (newVel.length() < maxSpeed)
    {
        this.velocity = newVel;
    }

    this.velocity.x -= this.velocity.x / 100.0;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
};

DTFFruit.prototype.collidesWith=function(obj)
{
    return false;
};

DTFFruit.prototype.onCollidesWith=function(obj)
{
    if(this.hit == false)
    {
        switch(obj.objectType)
        {
            case 'ball':
                gGame.model.onFruitHit(this);
            break;

            case 'critter':
                gGame.controller.onFruitHitByCritter(this);
            break;

            default:
                alert('oops:' + obj.objectType);
            break;
        }
        this.hit = true;
    }
    else
    {
        if(this.ripe == true)
        {
            gGame.audio.playRipeFruitSubsequentHit();
        }
        else
        {
            gGame.audio.playFruitHit();
        }
    }

    //GARETH add highlighting here ....
    inst = new DTFFruitHighlight();
    inst.init(this);
    gGame.model.fruitHiglightList.push(inst);

};

DTFFruit.prototype.beenHit=function()
{
    return this.hit;
};


DTFFruit.prototype.setRipe=function(ripe)
{
    this.ripe = ripe;
};

DTFFruit.prototype.clone=function()
{
    var inst = new DTFFruit();
    inst.position = this.position.clone();
    inst.velocity = this.velocity.clone();
    inst.colour = this.colour;
    inst.radius = this.radius;
    inst.orientation = this.orientation;
    inst.ripe = this.ripe;
    inst.hit = this.hit;

    return inst;
}

//============================================================================================
var DTFScoreDisplay = function()
{
    this.score = 0;
    this.timer = 30;
};

DTFScoreDisplay.prototype = new DTFObject();
DTFScoreDisplay.prototype.constructor = DTFScoreDisplay;

DTFScoreDisplay.prototype.init = function(fruit,score)
{
    this.position = fruit.position.clone();
    this.position.y -= 20;

    this.score = score;
};

DTFScoreDisplay.prototype.update = function()
{
    this.timer--;
};

DTFScoreDisplay.prototype.isFinished = function()
{
    return !(this.timer > 0);
};

var leafTransfer = new SinTransferFunction();

//============================================================================================
var DTFLeaf = function()
{
    this.objectType = "leaf";
    this.mod = Math.floor(120 + (Math.random()*240));
    this.speed = 0.5 + Math.random();

    this.sprite = new RMSpritesheet(gleafAnim);
    this.sprite.cellSize = new RMSize(181,181);
    this.sprite.animationRate = 8;
    this.sprite.loop = true;
};

DTFLeaf.prototype = new DTFObject();
DTFLeaf.prototype.constructor = DTFLeaf;

DTFLeaf.prototype.init = function()
{
    this.position = new RMVector2();
    this.position.x = (Math.random()*600)+100;
    this.position.y = -100;
};

DTFLeaf.prototype.update = function()
{
    this.position.x += leafTransfer.get( (gGame.controller.gamestate.lifetimeTick%this.mod)/this.mod)*(this.speed*4);
    this.position.y+=this.speed;
};

DTFLeaf.prototype.draw = function()
{
    this.sprite.draw(this.position,gGame.view.leafImage);
}

DTFLeaf.prototype.isFinished = function()
{
    return this.position.y > 600;
};

//============================================================================================

var DTFBallChucker = function()
{
    this.animCharacter = null;
    this.objectType = "ball chucker";
};

DTFBallChucker.prototype = new DTFObject();
DTFBallChucker.prototype.constructor = DTFBallChucker;

DTFBallChucker.prototype.init = function()
{
    this.animCharacter = new RMAnimPlayer('dimmbro_1', 'track', new RMVector2(206,312));
    this.animCharacter.init();
    this.animCharacter.playAnimation('track',true);
    this.position = new RMVector2(385,50);

    this.animCharacter.position = this.position;

};

DTFBallChucker.prototype.update = function()
{
    //if(gamestate.lifetimeTick %4 == 0)
    {
        this.animCharacter.update();
    }
    this.animCharacter.position = this.position;

};

DTFBallChucker.prototype.getBallPosition = function()
{
    var id = 8;
    return new RMVector2(this.animCharacter.skeleton.bones[id].worldX + this.animCharacter.position.x
                        ,this.animCharacter.skeleton.bones[id].worldY + this.animCharacter.position.y
    );
};

DTFBallChucker.prototype.getArmPosition = function()
{
    var boneID = 3
    var complete = this.animCharacter.getPercentageComplete()

    /*
    if((complete >= 0.25) && (complete <= 0.70))
    {
        boneID = 2;
    }*/
    return new RMVector2(this.animCharacter.skeleton.bones[boneID].worldX + this.animCharacter.position.x
        ,this.animCharacter.skeleton.bones[boneID].worldY + this.animCharacter.position.y
    );
};

DTFBallChucker.prototype.draw = function()
{

    if(gShowColliders == true)
    {
        gCanvas.GLStrokeCircle(this.getBallPosition(),20,'#ff00ff');
    }
};

DTFBallChucker.prototype.drawBehindTree = function()
{
    this.animCharacter.drawLayer("main bod");
    this.animCharacter.drawLayer("main bod 2");
};

DTFBallChucker.prototype.drawInfrontOfTree = function()
{
//    this.animCharacter.draw();
    this.animCharacter.drawLayer("head_r");
    this.animCharacter.drawLayer("eyes_r");
    this.animCharacter.drawLayer("shoulder");
    this.animCharacter.drawLayer("arm");
    this.animCharacter.drawLayer("hand_right");
    this.animCharacter.drawLayer("hand");
};

//============================================================================================

var DTFBucketVan = function()
{
    this.animLeft = null;
    this.animRight = null;
    this.direction = 1;
    this.size= null;
    this.collider0 = null;
    this.collider1 = null;
    this.collider2 = null;

    this.midPoint = new RMVector2();
    this.bucket = new RMRect();
    this.boundingVolume = new RMRect();

    this.headCollider   = new RMCircluarCollider();
    this.vanEndCollider = new RMCircluarCollider();
    this.backLineCollider = new RMLineCollider();
    this.frontLineCollider = new RMLineCollider();
    this.frontBottomCollider = new RMLineCollider();

    this.ballTrajectory = new RMLineCollider();

    this.objectType = "bucket van";
};

DTFBucketVan.prototype = new DTFObject();
DTFBucketVan.prototype.constructor = DTFBucketVan;

DTFBucketVan.prototype.init = function()
{
    this.animLeft = new RMAnimPlayer('dimmbro2_left', 'drive_left', new RMVector2(512,256));
    this.animLeft.init();
    this.animLeft.playAnimation('drive_left',true);

    this.animRight = new RMAnimPlayer('dimmbro2_right', 'drive_right', new RMVector2(512,256));
    this.animRight.init();
    this.animRight.playAnimation('drive_right',true);

    this.position = new RMVector2(400,600-20);

    this.size = new RMRect(0,0,320,100);

    this.bucket.x = 0;
    this.bucket.y = 0;
    this.bucket.w = 120;
    this.bucket.h = 35;

    this.headCollider.init(new RMVector2(),30);
    this.vanEndCollider.init(new RMVector2(),20);

};

DTFBucketVan.prototype.update = function()
{
    var speed = 3;

    var newPositionX = this.position.x + (speed * this.direction);

    if( (newPositionX < -this.size.w)
      ||(newPositionX > 800 + (this.size.w/2))
      )
    {
        this.direction *= -1;
    }

    this.position.x += (speed * this.direction);

    if(this.direction > 0)
    {
        this.animRight.update();
        this.animRight.position = this.position;

        this.collider0 = this.animRight.getBonePos('collider_0');
        this.collider1 = this.animRight.getBonePos('collider_1');
        this.collider2 = this.animRight.getBonePos('collider_2');
    }
    else
    {
        this.animLeft.update();
        this.animLeft.position = this.position;

        this.collider0 = this.animLeft.getBonePos('collider_0');
        this.collider1 = this.animLeft.getBonePos('collider_1');
        this.collider2 = this.animLeft.getBonePos('collider_2');
    }

    this.collider0.add(this.position);
    this.collider1.add(this.position);
    this.collider2.add(this.position);

    // make a bucket

    var fudge = 35;
    if(this.collider1.x < this.collider2.x)
    {
        this.bucket.x = this.collider1.x +((this.collider2.x - this.collider1.x)/2) +10;
        this.bucket.y = this.collider1.y +((this.collider2.y - this.collider1.y)/2);

        this.boundingVolume.x = this.collider0.x - fudge;
        this.boundingVolume.y = this.collider2.y - fudge;
        this.boundingVolume.w = (this.collider2.x - this.collider0.x) +(2*fudge);
        this.boundingVolume.h = (600 - this.collider2.y) +(2*fudge);

        this.frontLineCollider.init(this.collider1, this.collider0);
        this.backLineCollider.init(new RMVector2(this.collider2.x,600),this.collider2 );
        this.frontBottomCollider.init(this.collider0,new RMVector2(this.collider0.x,600));
    }
    else
    {
        this.bucket.x = this.collider2.x +((this.collider1.x - this.collider2.x)/2) -10;
        this.bucket.y = this.collider2.y +((this.collider1.y - this.collider2.y)/2);

        this.boundingVolume.x = this.collider2.x - fudge;
        this.boundingVolume.y = this.collider2.y - fudge;
        this.boundingVolume.w = (this.collider0.x - this.collider2.x) +(2*fudge);
        this.boundingVolume.h = (600 - this.collider2.y) +(2*fudge);

        this.frontLineCollider.init(this.collider0, this.collider1);
        this.backLineCollider.init(this.collider2, new RMVector2(this.collider2.x,600));
        this.frontBottomCollider.init(new RMVector2(this.collider0.x,600),this.collider0);
    }

    this.bucket.x -= this.bucket.w/2;
    this.bucket.y -= this.bucket.h/2;

    this.headCollider.setPosition(this.collider1);
    this.vanEndCollider.setPosition(this.collider2);


};

DTFBucketVan.prototype.collidesWithBall=function(ball)
{
    if(this.isBucketBall(ball) == false)
    {
        return this.onCollidesWith(ball);
    }

    // if it's a bucket ball, this wont matter- i think
    return false;
};

DTFBucketVan.prototype.onCollidesWith=function(obj)
{
    if(gDisableVan == true) return;

    //var ballTrajectory = new RMLineCollider();
    var nextPos = obj.position.clone();

    var dir = obj.velocity.clone();
    dir.normalise();

    nextPos.x += (dir.x * obj.radius)*5;
    nextPos.y += (dir.y * obj.radius)*5;

    this.ballTrajectory.init(obj.position,nextPos);

    // is in collision box?
    if(this.boundingVolume.isInMe(obj.position) == true)
    {
        // handle ball colliding with van ...
        // collide with circle 1?
        if(this.headCollider.vsPoint(obj.position) == true)
        {
            obj.onCollidesWithCircularCollider(this.headCollider);
            gGame.audio.playBallCollidesWithVan();
            return true;
        }
        // collide with circle2 ?
        if(this.vanEndCollider.vsPoint(obj.position) == true)
        {
            obj.onCollidesWithCircularCollider(this.vanEndCollider);
            gGame.audio.playBallCollidesWithVan();
            return true;
        }

        // collide with line 0->1
        var result = this.frontLineCollider.vsLineCollider(this.ballTrajectory);
        if(result != null)
        {
            obj.onCollidesWithLineCollider(this.frontLineCollider,result);
            gGame.audio.playBallCollidesWithVan();
            return true;
        }

        // collide with line 2-> ground
        var result = this.backLineCollider.vsLineCollider(this.ballTrajectory);
        if(result != null)
        {
            obj.onCollidesWithLineCollider(this.backLineCollider,result);
            gGame.audio.playBallCollidesWithVan();
            return true;
        }
        // collide with line 0-> ground
        var result = this.frontBottomCollider.vsLineCollider(this.ballTrajectory);
        if(result != null)
        {
            obj.onCollidesWithLineCollider(this.frontBottomCollider,result);
            gGame.audio.playBallCollidesWithVan();
            return true;
        }
    }

    return false;

};

DTFBucketVan.prototype.vanCentre=function()
{
    return this.boundingVolume.getCentre();
};

DTFBucketVan.prototype.isBucketBall=function(ball)
{
    if(gDisableVan == true) return false;

    return this.bucket.isInMe(ball.position);
};

DTFBucketVan.prototype.draw = function()
{
    if(gDisableVan == true) return;

    if(this.direction > 0)
    {
        this.animRight.draw();
    }
    else
    {
        this.animLeft.draw();
    }

    if(gShowColliders == true)
    {

        /*
        gCanvas.GLStrokeCircle(this.collider0,20,'#ff00ff');
        gCanvas.GLStrokeCircle(this.collider1,40,'#ff00ff');
        gCanvas.GLStrokeCircle(this.collider2,20,'#ff00ff');
        */

        this.vanEndCollider.draw();
        this.headCollider.draw();

        this.frontLineCollider.draw();
        this.backLineCollider.draw();
        this.frontBottomCollider.draw();

        this.ballTrajectory.draw();
        /*
        gCanvas.GLLine(this.collider0.x,this.collider0.y, this.collider1.x,this.collider1.y,'#ff00ff');
        gCanvas.GLLine(this.collider0.x,this.collider0.y, this.collider0.x,600,'#ff00ff');

        gCanvas.GLLine(this.collider1.x,this.collider1.y, this.collider2.x,this.collider2.y,'#ff00ff');

        gCanvas.GLLine(this.collider2.x,this.collider2.y, this.collider2.x,600,'#ff00ff');
*/

        gCanvas.GLText(24,"0",this.collider0,'#ffffff');
        gCanvas.GLText(24,"1",this.collider1,'#ffffff');
        gCanvas.GLText(24,"2",this.collider2,'#ffffff');

        gCanvas.GLStrokeRect(this.bucket,'#ff00ff');
        gCanvas.GLStrokeCircle(this.bucket.getCentre(),10,'#ff00ff');

        gCanvas.GLStrokeRect(this.boundingVolume,'#ff00ff');
        gCanvas.GLCircle(this.vanCentre(),20,'#ff00ff');
    }
};

//============================================================================================
var DTFCritter = function()
{
    this.colour = '#ff00ff';
    this.radius = 7;
    this.objectType = "critter";

    this.type = "";
    this.heading = 0;
    this.lifetimeTick =0;
    this.lifetimeTick = this.getRandomArbitrary(0,80);
    this.hit = false;
    this.hitDirection = null;
};

DTFCritter.prototype = new DTFObject();
DTFCritter.prototype.constructor = DTFCritter;

DTFCritter.prototype.init = function()
{
};

DTFCritter.prototype.update = function()
{
    this.lifetimeTick++;
};

DTFCritter.prototype.updateDrop = function(objectList)
{
    this.velocity = this.hitDirection.clone();

    this.velocity.scaleBy(15);

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    for(var i=0;i<objectList.length;i++)
    {
        if(objectList[i].beenHit() == false)
        {
            if(this.collidesWith(objectList[i]) == true)
            {
                objectList[i].onCollidesWith(this);
            }
        }
    }
};


DTFCritter.prototype.onCollidesWith=function(obj)
{
    if(this.hit == false)
    {
        this.hit = true;
        this.hitDirection = new RMVector2();

        this.hitDirection.x = obj.position.x - this.position.x;
        this.hitDirection.y = obj.position.y - this.position.y;

/*GARETH
        this.hitDirection.x = 0 - this.position.x;
        this.hitDirection.y = 0 - this.position.y;*/
        this.hitDirection.normalise();

        gGame.model.onCritterHit(this);
    }
};

DTFCritter.prototype.clone=function()
{
    var ret = new DTFCritter();

    ret.position = this.position.clone();
    ret.velocity = this.velocity.clone();
    ret.colour = this.colour;
    ret.radius = this.radius;
    ret.orientation = this.orientation;

    ret.type = this.type;
    ret.heading = this.heading;
    ret.hit = this.hit;

    return ret;
};

DTFCritter.prototype.shouldBlink = function()
{
    return (this.lifetimeTick%60 > 50);
};
//============================================================================================

var LogoTransferFunction = function()
{
    this.scale = 1;
};

LogoTransferFunction.prototype = new TransferFunction();
LogoTransferFunction.prototype.constructor = LogoTransferFunction;


LogoTransferFunction.prototype.get = function(inParam)
{
    var v = this.scale*(inParam - Math.floor(inParam));

    return Math.cos( v * (2*Math.PI));
};

var DTFLogo = function()
{
    this.animCharacter = null;
    this.objectType = "logo";
    this.tick = 0;

    this.transferFunction = new LogoTransferFunction();

    this.velocity = 0;
};

DTFLogo.prototype = new DTFLogo();
DTFLogo.prototype.constructor = DTFLogo;

DTFLogo.prototype.init = function()
{
    this.animCharacter = new RMAnimPlayer('title', 'blink', new RMVector2(661,387));
    this.animCharacter.init();
    this.animCharacter.playAnimation('blink',true);

    this.tick = 0;

    this.velocity = gravity;


    if(gGame.view.animateAttactScreen == true)
    {
        this.position = new RMVector2(400,-600);
        gGame.view.enableAttactPlayButton = false;
    }
    else
    {
        this.position = new RMVector2(400,285);
        gGame.view.enableAttactPlayButton = true;
    }

    this.animCharacter.position = this.position;

};

DTFLogo.prototype.update = function()
{
    if(gGame.controller.gamestate.lifetimeTick %2 == 0)
    {
        this.animCharacter.update();
    }

    if(gGame.view.animateAttactScreen == true)
    {
        if(( Math.abs(this.velocity) >= gravity) || (Math.abs(this.position.y - 285) > 5))
        {
            if(this.velocity < 20)
            {
                this.velocity += gravity;
            }

            this.position.y += this.velocity;

            if(this.position.y > 285)
            {
                this.position.y -= (this.position.y - 285);

                this.velocity = -(this.velocity/2);
            }

            this.animCharacter.position = this.position;
        }
        else
        {
            gGame.view.enableAttactPlayButton = true;
            gGame.view.animateAttactScreen = false;
        }
    }
};

DTFLogo.prototype.draw = function()
{
    this.animCharacter.draw();

};

//============================================================================================

var DTFThrowButton = function()
{
    this.animCharacter = null;

    this.objectType = "throw button";

    this.currentMode = "";
    this.desiredMode = "";
};

DTFThrowButton.prototype = new DTFThrowButton();
DTFThrowButton.prototype.constructor = DTFThrowButton;

DTFThrowButton.prototype.init = function()
{
    this.idleAnim = new RMAnimPlayer('throw', 'idle', new RMVector2(189,201));
    this.idleAnim.init();
    this.idleAnim.setAnimation('idle',true);

    this.throwAnim = new RMAnimPlayer('throw', 'thrown', new RMVector2(189,201));
    this.throwAnim.init();
    this.throwAnim.setAnimation('thrown',true);

    this.position = new RMVector2(400,280);

    this.currentMode = "";
};


DTFThrowButton.prototype.update = function()
{
    if(gGame.model.mode == 'readytothrow')
    {
        this.desiredMode = "idle";
    }
    else
    {
        this.desiredMode = "thrown";
    }

    if(this.desiredMode != this.currentMode)
    {
        this.currentMode = this.desiredMode;

        if(this.currentMode == "idle")
        {
            this.idleAnim.playAnimation('idle',true);
            this.idleAnim.update();
        }
        else
        {
            this.throwAnim.playAnimation('thrown',true);
            this.throwAnim.update();
        }
    }

    if(gGame.controller.gamestate.lifetimeTick %2 == 0)
    {
        if(this.currentMode == "idle")
        {
            this.idleAnim.update();
        }
        else
        {
            this.throwAnim.update();
        }
    }
};

DTFThrowButton.prototype.setPosition = function(inPos)
{
    this.position = inPos.clone();

    this.position.x += 55;
    this.position.y += 50;
};

DTFThrowButton.prototype.draw = function()
{
    if(this.currentMode == "idle")
    {
        this.idleAnim.position = this.position.clone();
        this.idleAnim.draw();
    }
    else
    {
        this.throwAnim.update();
        this.throwAnim.position = this.position.clone();
        this.throwAnim.draw();
    }
};

DTFThrowButton.prototype.getClickRect = function()
{
    var width = 150;
    var height = 200;
    return new RMRect(this.position.x-(width/2),this.position.y-(height/2)
                     ,width,height);
}

//============================================================================================
var DTFFruitHighlight = function()
{
    this.objectType = "fruit highlight";
    this.timer = 10;
    this.ripe = false;
};

DTFFruitHighlight.prototype = new DTFObject();
DTFFruitHighlight.prototype.constructor = DTFFruitHighlight;

DTFFruitHighlight.prototype.init = function(fruit)
{
    this.position = fruit.position.clone();

    this.ripe = fruit.ripe;
};

DTFFruitHighlight.prototype.update = function()
{
    this.timer--;
};

DTFFruitHighlight.prototype.isFinished = function()
{
    return !(this.timer > 0);
};
//============================================================================================