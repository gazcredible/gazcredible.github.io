/**
 * Created by remode on 27/11/13.
 */


var textureLoader = function(textureDim)
{
    this.name = null;
    this.tex = null;
    this.textureDim = textureDim;
}

textureLoader.prototype =
{
    load:function(inPage,inPath)
    {
        this.tex = new Image();
        this.tex.src = this.name; //+"/skeleton.png";

        inPage.width = this.textureDim.x;//2048;
        inPage.height = this.textureDim.y;//512;
    },

    unload:function()
    {

    }
};


var RMAnimPlayer = function(inCharacter, defaultAnim, textureDim, inLoopAnim){

    this.atlas = null;
    this.skeletonData = null;

    this.state = null;
    this.skeleton = null;
    this.scale = 1;

    this.position = new RMVector2(600, 300);

    this.a = 0;
    this.characterName = inCharacter;

    this.texture = new textureLoader(textureDim);
    this.characterAnim = null;
    this.defaultAnim = defaultAnim || "Hit";
    this.loopAnim = inLoopAnim || false;

    this.invertFrame = false;
};

RMAnimPlayer.prototype = {

    init : function(){
        this.characterAnim = this.getAnimationData(this.characterName);

        this.texture.name = "game/data/anim/" + this.characterName + ".png";

        this.atlas = new spine.Atlas(this.characterAnim.AtlasData,this.texture );

        var json = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(this.atlas));
        //this.skeletonData = json.readSkeletonData(JSON.parse(assetName +".json"));
        this.skeletonData = json.readSkeletonData(this.characterAnim.Skeleton);

        spine.Bone.yDown = true;

        this.skeleton = new spine.Skeleton(this.skeletonData);
        this.skeleton.getRootBone().x = 0;
        this.skeleton.getRootBone().y = 0;
        this.skeleton.updateWorldTransform();

        var stateData = new spine.AnimationStateData(this.skeletonData);
        this.state = new spine.AnimationState(stateData);

//       stateData.setMixByName("flying", "jump", 0.2);
//       stateData.setMixByName("jump", "walk", 0.4);
      // this.state.setAnimationByName(this.defaultAnim, this.loopAnim);
    },

    getAnimationData : function(inCharacterName)
    {
        switch(inCharacterName)
        {
            case "dimmbro_1" :  return new dimmbro_1();
            case "dimmbro2_left" :  return new dimmbro2_left();
            case "dimmbro2_right" :  return new dimmbro2_right();
            case "title" :  return new title();
            case 'throw':   return new throwball();

            default: throw "Animation data not found!";
        }
    },

    playAnimation : function(inAnimName, loop){
        // Checks input values, revert to default ones if nothing is passed in
        var loopAnim = loop || false;
        var animName = inAnimName || this.defaultAnim;

        this.state.setAnimationByName(animName, loopAnim);
    },

    isComplete : function(){
        console.log("Is animation complete: " + this.state.isComplete());
        return this.state.isComplete();
    },

    setAnimation : function(inAnimName){
      this.state.setAnimationByName(inAnimName, false);
    },

    update: function(){

        for(var i=0;i<  1;i++)
        {
            this.state.update(16/1000);
            this.state.apply(this.skeleton);
            this.skeleton.updateWorldTransform();
        }

        this.a += 0.1;
    },
    draw : function()
    {
        var drawOrder = this.skeleton.drawOrder;
        var vertices = [];

        for (var i = 0; i < drawOrder.length; i++)
        {
            var slot = drawOrder[i];
            var attachment = slot.attachment;

            if (!(attachment instanceof spine.RegionAttachment)) continue;

            attachment.computeVertices(this.skeleton.x, this.skeleton.y, slot.bone, vertices);

            for(var v=0;v< vertices.length;v++)
            {
                vertices[v] /=this.scale;
            }

            if(true)
            {
                var xMin = 1.1;
                var xMax = 0;

                var yMin = 1.1;
                var yMax = 0;


                for(var q=0;q<4;q++)
                {
                    if(attachment.uvs[q*2] > xMax)
                    {
                        xMax =  attachment.uvs[q*2];
                    }

                    if(attachment.uvs[q*2] < xMin)
                    {
                        xMin =  attachment.uvs[q*2];
                    }

                    if(attachment.uvs[(q*2)+1] > yMax)
                    {
                        yMax =  attachment.uvs[(q*2)+1];
                    }

                    if(attachment.uvs[(q*2)+1] < yMin)
                    {
                        yMin =  attachment.uvs[(q*2)+1];
                    }
                }

                var uvRect = new RMRect();
                uvRect.x = xMin*this.texture.tex.width;
                uvRect.y = yMin*this.texture.tex.height;
                uvRect.w = (xMax-xMin)*this.texture.tex.width;
                uvRect.h = (yMax-yMin)*this.texture.tex.height;


                var width = Math.sqrt( Math.pow(vertices[4]-vertices[2],2)
                    +Math.pow(vertices[5]-vertices[3],2));

                var height  = Math.sqrt( Math.pow(vertices[0]-vertices[2],2)
                    + Math.pow(vertices[1]-vertices[3],2));

                var rect = new RMRect(vertices[2]+ this.position.x, vertices[3]+ this.position.y,width,height);

                rect = gCanvas.toScreenSpace(rect);

                gCanvas.mContext.save();

                if(this.invertFrame == true)
                {

                    gCanvas.mContext.translate(rect.x,-rect.y );
                    gCanvas.mContext.rotate( (3.14/2) - Math.atan2(vertices[4]-vertices[2] , vertices[5] - vertices[3]));
                }
                else
                {
                    gCanvas.mContext.translate(rect.x,rect.y );
                    gCanvas.mContext.rotate( (3.14/2) - Math.atan2(vertices[4]-vertices[2] , vertices[5] - vertices[3]));
                }




                if(this.texture.tex.width >0)
                {
                    gCanvas.mContext.drawImage(this.texture.tex,uvRect.x,uvRect.y,uvRect.w,uvRect.h,0,0,rect.w,rect.h);
                }
                else
                {
                    gCanvas.rect(new RMRect(0,0,rect.w,rect.h),'#ff0000');
                }

                gCanvas.mContext.restore();

            }
        }
    },

    drawLayer : function(inLayerName)
    {
        var drawOrder = this.skeleton.drawOrder;
        var vertices = [];

        var i = 0;
        var slot = null;

        for (var i = 0; i < drawOrder.length; i++)
        {
            if(drawOrder[i].data.name == inLayerName)
            {
                slot = drawOrder[i];
            }
        }

        if(slot == null) return;

        var attachment = slot.attachment;

        if (!(attachment instanceof spine.RegionAttachment)) return;

        attachment.computeVertices(this.skeleton.x, this.skeleton.y, slot.bone, vertices);

        for(var v=0;v< vertices.length;v++)
        {
            vertices[v] /=this.scale;
        }

        if(true)
        {
            var xMin = 1.1;
            var xMax = 0;

            var yMin = 1.1;
            var yMax = 0;


            for(var q=0;q<4;q++)
            {
                if(attachment.uvs[q*2] > xMax)
                {
                    xMax =  attachment.uvs[q*2];
                }

                if(attachment.uvs[q*2] < xMin)
                {
                    xMin =  attachment.uvs[q*2];
                }

                if(attachment.uvs[(q*2)+1] > yMax)
                {
                    yMax =  attachment.uvs[(q*2)+1];
                }

                if(attachment.uvs[(q*2)+1] < yMin)
                {
                    yMin =  attachment.uvs[(q*2)+1];
                }
            }

            var uvRect = new RMRect();
            uvRect.x = xMin*this.texture.tex.width;
            uvRect.y = yMin*this.texture.tex.height;
            uvRect.w = (xMax-xMin)*this.texture.tex.width;
            uvRect.h = (yMax-yMin)*this.texture.tex.height;


            var width = Math.sqrt( Math.pow(vertices[4]-vertices[2],2)
                +Math.pow(vertices[5]-vertices[3],2));

            var height  = Math.sqrt( Math.pow(vertices[0]-vertices[2],2)
                + Math.pow(vertices[1]-vertices[3],2));

            var rect = new RMRect(vertices[2]+ this.position.x, vertices[3]+ this.position.y,width,height);

            rect = gCanvas.toScreenSpace(rect);

            gCanvas.mContext.save();

            if(this.invertFrame == true)
            {

                gCanvas.mContext.translate(rect.x,-rect.y );
                gCanvas.mContext.rotate( (3.14/2) - Math.atan2(vertices[4]-vertices[2] , vertices[5] - vertices[3]));
            }
            else
            {
                gCanvas.mContext.translate(rect.x,rect.y );
                gCanvas.mContext.rotate( (3.14/2) - Math.atan2(vertices[4]-vertices[2] , vertices[5] - vertices[3]));
            }

            if(this.texture.tex.width >0)
            {
                gCanvas.mContext.drawImage(this.texture.tex,uvRect.x,uvRect.y,uvRect.w,uvRect.h,0,0,rect.w,rect.h);
            }
            else
            {
                gCanvas.rect(new RMRect(0,0,rect.w,rect.h),'#ff0000');
            }

            gCanvas.mContext.restore();

        }
    },

    getBonePos:function(inName)
    {
        for(var i=0;i< this.skeleton.bones.length;i++)
        {
            if(this.skeleton.bones[i].data.name == inName)
            {
                return new RMVector2(this.skeleton.bones[i].worldX,this.skeleton.bones[i].worldY);
            }
        }

        return null;
    },

    getPercentageComplete:function()
    {
        var frames = this.skeletonData.animations[0].duration;

        var erm = this.state.currentTime / this.skeletonData.animations[0].duration;

        return (erm - Math.floor(erm));
    }
};