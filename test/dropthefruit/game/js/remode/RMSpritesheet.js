/**
 * Created by remode on 15/01/14.
 */


var RMSpritesheet = function(inAnimationData){
    this.column = 0;
    this.currentFrame = 0;
    this.animationData = inAnimationData;
    this.animationFinished = false;
    this.loop = false;

    this.cellSize = new RMSize();
    this.animationRate = 1;

    this.init();
};

RMSpritesheet.prototype = {

    init : function(){
        this.column = this.animationData.imageData.columns;
        this.width = this.animationData.imageData.width;
        this.height = this.animationData.imageData.height;
    },

    update : function(){},

    draw : function(inPos, inImage)
    {
        var animData = this.animationData.imageData.data[this.currentFrame];

        var uvCoords = new RMRect((this.currentFrame%this.column)*this.cellSize.w
                            , Math.floor(this.currentFrame/this.column)*this.cellSize.h
            ,this.width
            ,this.height);

        gCanvas.GLSprite(inImage, new RMRect(inPos.x,inPos.y, this.width, this.height), uvCoords);

        if(this.loop === false && this.animationFinished === true)
        {
            return ;
        }

        if((gGame.controller.gamestate.lifetimeTick % this.animationRate) == 0)
        {
            this.currentFrame++;
        }

        this.currentFrame = this.currentFrame%this.animationData.imageData.data.length;//59;
//        console.log("CurrentFrame " + this.currentFrame);
        if(this.currentFrame === this.animationData.imageData.data.length - 1)
        {
            this.animationFinished = true;
        }
    },

    getFrameNumber : function(){},
    getCurrentFrame : function(){
    },
    getTextureName : function(){},

    loopAnimation : function(loopAnimation)
    {
        this.loopAnimation = loopAnimation;
    },

    isAnimationFinished : function(){
        return this.animationFinished;
    }

};