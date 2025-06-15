/*

 RMCanvas
 V 0.0
 Remode Studios
 22/02/12
 Chris Hebert

 */


var RMCanvas	=		function(inParent){

    this.mParent					=		inParent;
    this.mElement					=		mk('canvas');//,{width: '100%',height: '100%'});
    this.mElement.id				=		"cnvs";
    this.mElement.width				=		this.mParent.mWidth;
    this.mElement.height			=		this.mParent.mHeight;
    this.mElement.style.position	=		'absolute';

    this.mElement.style.left		=		'0px';
    this.mElement.style.top			=		'0px';

    this.mCenter					=		RMVector2.create(0,0);



    this.mContext	=		null;
    RMCanvas.Current	=		this;
    this.initContext();
    //this.testContext();
    gt('gameWrapper').appendChild(this.mElement);
    //gt('gdkGameContainer').appendChild(this.mElement);

    //GARETH
    this.GLcurrentScreenSize = new RMSize(0,0);
    this.GLreferenceScreen = new RMSize(1280,720);

    gCanvas = this;

}

RMCanvas.prototype	=	{

    initContext:function(){
        this.mContext	=		null;
        if(!this.mElement) return this.mContext;
        this.mContext	=	 this.mElement.getContext('2d');
        return this.mContext;

    },
    setWidth:function(inWidth)
    {
        if(!this.mElement) return;
        this.mElement.width	= inWidth;
    },

    setSize:function(inWidth,inHeight)
    {
        if(!this.mElement) return;

        this.mElement.width = window.innerWidth;
        this.mElement.height= window.innerHeight;
    },

    reset:function()
    {
        if(!this.mContext) return;
        this.mContext.globalAlpha	=	1.0;
        //this.mContext.fillStyle		=	'#437823';
        //this.mContext.fillRect(0,0,this.mElement.width,this.mElement.height);

        this.mContext.clearRect(0,0,this.mElement.width	,this.mElement.height);
        this.mContext.strokeStyle	=	"#3489ff";
        this.mContext.lineWidth		=	5.0;
        //this.mContext.strokeRect(0,0,this.mElement.width,this.mElement.height);
        this.mContext.globalAlpha	=	1.0;
        this.mContext.lineWidth		=	0.0;
    },
    testContext:function(){
        if(!this.mContext) return;

        this.mContext.fillStyle		=	'#ff0000';
        this.mContext.fillRect(20,20,100,100);

    },
    drawSprite:function(inSprite){
        //trace("Drawing Sprite " + String(inSprite.mPosition.x));
        var v0;
        v0								=		this.toScreen(inSprite.mPosition);
        if(inSprite.mAlpha < 0.2) return;
        this.mContext.save();
        this.mContext.translate(v0.x,v0.y);
        this.mContext.rotate(rad(-inSprite.mRotation));
        this.mContext.scale(inSprite.mScale.x,inSprite.mScale.y);
        this.mContext.globalAlpha				=		inSprite.mAlpha;
        //	this.mContext.globalCompositeOperation	=		inSprite.mComp;
        this.mContext.drawImage(inSprite.mImage,-inSprite.mReg.x,-inSprite.mReg.y,inSprite.mImage.width,inSprite.mImage.height);


        this.mContext.restore();

    },
    drawPattern:function(inPattern){
        if(inPattern.mAlpha < 0.2) return;
        this.mContext.save();
        this.mContext.translate(inPattern.mPosition.x,inPattern.mPosition.y);
        this.mContext.rotate(rad(-inPattern.mRotation));
        this.mContext.globalAlpha				=		inPattern.mAlpha;
        //	this.mContext.globalCompositeOperation	=		inSprite.mComp;
        this.mContext.rect(0,0,inPattern.mSize.x,inPattern.mSize.y);
        this.mContext.fillStyle	=		inPattern.mPattern;
        this.mContext.fill();

        this.mContext.restore();

    },
    drawPoint:function(inLoc,inSize,inColor,inAlpha){
        var v0;
        var theAlpha					=		0.0;
        v0								=		this.toScreen(inLoc);

        this.mContext.fillStyle			=		'#ffffff';
        if(inColor) this.mContext.fillStyle	=		inColor;
        if(!inSize) inSize				=		8;
        this.mContext.globalAlpha		=		inAlpha;
        this.mContext.fillRect(v0.x-inSize/2,v0.y-inSize/2,inSize,inSize);
    },
    drawCircle:function(inLoc,inSize,inColor){
        var v0;
        var theAlpha					=		1.0;
        v0								=		this.toScreen(inLoc);

        this.mContext.lineWidth			=			1.0;
        this.mContext.strokeStyle			=		'#ffeeaa';
        if(inColor) this.mContext.fillStyle	=		inColor;
        if(!inSize) inSize				=		8;
        if(inSize != 0.0) theAlpha		=		1.0;//Math.min(inSize/50.0);

        if(inSize == 0.0) {
            console.log("Size Is Zero");
        }

        this.mContext.globalAlpha		=		theAlpha;
        this.mContext.beginPath();
        this.mContext.arc(v0.x,v0.y,inSize,0,Math.PI*2.0);
        this.mContext.stroke();

    },
    fillCircle:function(inLoc,inSize,inStyle){
        var v0;
        v0								=		this.toScreen(inLoc);
        var grd;

        this.mContext.globalAlpha		=		1.0;
        this.mContext.globalCompositeOperation	=		"lighter";

        this.mContext.lineWidth		=		1;
        if(inStyle.hasOwnProperty('alpha')){
            this.mContext.globalAlpha		=		inStyle.alpha;
        }


        if(!inSize) inSize				=		8;
        this.mContext.beginPath();
        this.mContext.arc(v0.x,v0.y,inSize,0,Math.PI*2.0);



        if(inStyle.hasOwnProperty('fillColor')){
            this.mContext.fillStyle		=		inStyle.fillColor;
            this.mContext.fill();
        }


        if(inStyle.hasOwnProperty('lineWidth')){
            this.mContext.lineWidth		=		inStyle.lineWidth;
        }
        if(inStyle.hasOwnProperty('strokeColor')){
            this.mContext.strokeStyle		=		inStyle.strokeColor;
            this.mContext.globalAlpha		=		0.5;

            this.mContext.stroke();
        }

    },
    fillRect:function(inPosition,inSize,inStyle,inTransform){

        this.mContext.save();
        this.mContext.fillStyle	=		inStyle.color;
        this.mContext.translate(inPosition.x,inPosition.y);

        if(inStyle.hasOwnProperty('alpha')){
            this.mContext.globalAlpha				=		inStyle.alpha;
        }

        if(inTransform){
            if(inTransform.hasOwnProperty('rotation')){
                this.mContext.rotate(rad(-inTransform.rotation));
            }
            if(inTransform.hasOwnProperty('scale')){
                this.mContext.scale(inTransform.scale.x,inTransform.scale.y);
            }
        }

        this.mContext.fillRect(0,0,inSize.width,inSize.height);
        this.mContext.restore();

    },
    drawPath:function(inPoints,inStyle){

        var i;
        var v0,v1;

        this.mContext.save();

        if(inStyle.hasOwnProperty('alpha')){
            this.mContext.globalAlpha				=		inStyle.alpha;
        }

        this.mContext.globalAlpha			=		1.0;
        this.mContext.beginPath();
        this.mContext.fillStyle				=		inStyle.color;
        this.mContext.strokeStyle			=		inStyle.color;
        if(inStyle.hasOwnProperty('width')){
            this.mContext.lineWidth			=		inStyle.width;
        }

        v0	=		this.toScreen(inPoints[0]);

        this.mContext.moveTo(v0.x,v0.y);

        for(i=1;i<inPoints.length;i++){
            v1	=		this.toScreen(inPoints[(i) % inPoints.length]);
            this.mContext.lineTo(v1.x,v1.y);

        }

        //this.mContext.stroke();
        this.mContext.fill();

        this.mContext.restore();
    },
    drawLineSegment:function(inFrom,inTo,inStyle){
        var v0	=		this.toScreen(inFrom);
        var v1	=		this.toScreen(inTo);

        this.mContext.save();

        if(inStyle.hasOwnProperty('alpha')){
            this.mContext.globalAlpha				=		inStyle.alpha;
        }

        this.mContext.beginPath();
        this.mContext.strokeStyle		=		inStyle.color;
        if(inStyle.hasOwnProperty('width')){
            this.mContext.lineWidth			=		inStyle.width;
        }
        this.mContext.moveTo(v0.x,v0.y);
        this.mContext.lineTo(v1.x,v1.y);
        this.mContext.stroke();


        this.mContext.restore();
    },
    drawVPoint:function(inVector){

    },
    toScreen:function(inPoint){
        var outPoint	=		inPoint.clone();
        outPoint.add(this.mCenter);
        return outPoint;
    }
    ,
    fromScreen:function(inPoint){
        var sclX;
        var sclY;
        var outPoint	=		inPoint.clone();

        sclX			=		1.0;//600.00/this.mElement.offsetWidth;
        sclY			=		1.0;//800.00/this.mElement.offsetHeight;

        //outPoint.subtractN(this.mElement.offsetLeft,this.mElement.offsetTop);

        outPoint.multiplyN(sclX,sclY);

        outPoint.subtract(this.mCenter);
        return outPoint;
    },
    drawLine:function(inFrom,inTo){

        var v0	=		this.toScreen(inFrom.mWorld);
        var v1	=		this.toScreen(inTo.mWorld);

        this.mContext.strokeStyle		=		"#ffffff";
        this.mContext.lineWidth			=		1.0;
        this.mContext.beginPath();
        this.mContext.moveTo(v0.x,v0.y);
        this.mContext.lineTo(v1.x,v1.y);
        this.mContext.stroke();
        this.mContext.closePath();

    },
    drawDashedLine:function(inFrom,inTo){

        var v0	=		this.toScreen(inFrom.mWorld);
        var v1	=		this.toScreen(inTo.mWorld);

        var p0,p1;
        var scl;

        var vct	=		v1.clone();
        vct.subtract(v0);

        scl		=		vct.clone();


        var len	=	vct.length();

        var cnt	=		Math.floor(len/4);
        scl.scaleBy(1.0/cnt);


        var i;

        p0		=		v0.clone();
        this.mContext.strokeStyle		=		"#ffffff";
        this.mContext.lineWidth			=		1.0;

        for(i=0;i<cnt-1;i++){

            p1		=		p0.clone();
            p1.add(scl);

            if(i%2==0){

                this.mContext.beginPath();
                this.mContext.moveTo(p0.x,p0.y);
                this.mContext.lineTo(p1.x,p1.y);
                this.mContext.stroke();
                this.mContext.closePath();

            }

            if(p0.length() > 1200) break;

            p0		=		p1;

        }

    },
    textDimensions:function(inText,inStyle){

        var outDimensions;

        outDimensions		=		{
            x:0,
            y:0
        };

        this.mContext.save();

        this.mContext.font		=		String(inStyle.size) + "px " + inStyle.font;

        outDimensions.x			=		this.mContext.measureText(inText).width;
        outDimensions.y			=		inStyle.size-2;

        this.mContext.restore();
        return outDimensions;


    },
    drawText:function(inText,inStyle,inPosition,inTransform){
        var theAlpha	=		1.0;
        if(inStyle.hasOwnProperty('alpha')) theAlpha		=		inStyle.alpha;
        if(theAlpha < 0.2) return;

        this.mContext.save();
        this.mContext.fillStyle	=		inStyle.color;
        if(inStyle.strokeColor){
            this.mContext.strokeStyle	=		inStyle.strokeColor;
        }
        this.mContext.font		=		String(inStyle.size) + "px " + inStyle.font;
        this.mContext.textBaseline	=	'top';
        this.mContext.textAlign		=	"Left";

        if(inStyle.textBaseline)
        {
            this.mContext.textBaseline	=	inStyle.textBaseline;
        }

        if(inStyle.textAlign)
        {
            this.mContext.textAlign		=	inStyle.textAlign;
        }


        if(inTransform){
            if(inTransform.hasOwnProperty('position')) this.mContext.translate(inTransform.position.x,inTransform.position.y);
            if(inTransform.hasOwnProperty('rotation')) this.mContext.rotate(rad(-inTransform.rotation));
            if(inTransform.hasOwnProperty('scale')) this.mContext.scale(inTransform.scale.x,inTransform.scale.y);
        }
        this.mContext.globalAlpha				=		theAlpha;

        if(inStyle.shadow){
            this.mContext.shadowBlur		=		inStyle.shadow.blur;
            this.mContext.shadowColor		=		inStyle.shadow.color;
            this.mContext.shadowOffsetX		=		inStyle.shadow.selectPageOffset;
            this.mContext.shadowOffsetY		=		-inStyle.shadow.selectPageOffset;
            this.mContext.fillText(inText,inPosition.x,inPosition.y);

            this.mContext.shadowBlur		=		0;
            this.mContext.shadowColor		=		null;
            this.mContext.shadowOffsetX		=		0;
            this.mContext.shadowOffsetY		=		0;

        }

        if(inStyle.strokeColor){
            this.mContext.lineWidth		=		5.0;
            this.mContext.lineJoin		=		"round";
            this.mContext.strokeText(inText,inPosition.x,inPosition.y);
        }
        this.mContext.fillText(inText,inPosition.x,inPosition.y);
        this.mContext.restore();
    },
    drawVector:function(inFrom,inTo){

    },
    drawWorld:function(inWorld){

    },

    //
    //Stuff for Odobo
    //

    setGLReferenceScreen:function(inWidth,inHeight)
    {
        this.GLreferenceScreen = new RMSize(inWidth,inHeight);
    },
    setCurrentResolution:function(inWidth,inHeight)
    {
        this.GLcurrentScreenSize = new RMSize(inWidth,inHeight);
    },

    toScreenSpace:function(inRect)
    {
        // work out the biggest RMSize for the referenceAspect that fits in the currentScreenSize
        var targetSize = new RMSize(0,0);


        targetSize.h = this.GLcurrentScreenSize.h;
        targetSize.w = (targetSize.h * this.GLreferenceScreen.w / this.GLreferenceScreen.h);

        if(targetSize.w > this.GLcurrentScreenSize.w)
        {
            targetSize.w = this.GLcurrentScreenSize.w;
            targetSize.h = (targetSize.w*this.GLreferenceScreen.h) / this.GLreferenceScreen.w;
        }

        var offset = new RMSize(0,0);
        offset.x = this.GLcurrentScreenSize.w - targetSize.w;
        offset.y = this.GLcurrentScreenSize.h - targetSize.h;

        var drawRect = new RMRect();
        drawRect.x = ((inRect.x / this.GLreferenceScreen.w) * targetSize.w) + offset.x/2;
        drawRect.y = ((inRect.y / this.GLreferenceScreen.h) * targetSize.h)+offset.y/2;
        drawRect.w = (inRect.w / this.GLreferenceScreen.w) * targetSize.w;
        drawRect.h = (inRect.h / this.GLreferenceScreen.h) * targetSize.h;

        return drawRect;
    },

    //
    //Scaled drawing functions to keep to aspect ratio
    //

    GLLine:function(x0,y0,x1,y1,inColour)
    {
        var d0 = this.toScreenSpace(new RMRect(x0,y0,0,0) );
        var d1 = this.toScreenSpace(new RMRect(x1,y1,0,0) );
        this.line(d0.x,d0.y,d1.x,d1.y,inColour);

    },

    GLSprite:function(inTex,inRect,uvRect)
    {
        var drawRect = this.toScreenSpace(inRect);
        this.sprite(inTex,drawRect,uvRect);
    },

    GLStrokeRect:function(inRect,inColour)
    {
        var drawRect = this.toScreenSpace(inRect);

        this.strokeRect(drawRect,inColour);
    },

    GLRect:function(inRect,inColour)
    {
        var drawRect = this.toScreenSpace(inRect);

        this.rect(drawRect,inColour);
    },

    GLCircle:function(inPos,inRadius, inColour)
    {
        var drawRect = this.toScreenSpace(new RMRect(inPos.x,inPos.y, inRadius, inRadius));

        this.circle(drawRect.x,drawRect.y, drawRect.w, inColour);
    },

    GLStrokeCircle:function(inPos,inRadius, inColour)
    {
        var drawRect = this.toScreenSpace(new RMRect(inPos.x,inPos.y, inRadius, inRadius));

        this.strokeCircle(drawRect.x,drawRect.y, drawRect.w, inColour);
    },

    GLTextCentred:function(inSize,inString,inPos,inColour)
    {
        var rect = new RMRect();

        rect.set(inPos.x,inPos.y,inSize,inSize);
        rect = this.toScreenSpace(rect);

        this.mContext.save();
        this.mContext.font =		String(rect.h) + "px " + 'dinbold';
        this.mContext.textBaseline	=	'middle';
        this.mContext.textAlign		=	"center";
        this.mContext.fillStyle = inColour;
        this.mContext.strokeColor ='#333333';


        /*  GARETH - don't do this, it's very slow
        this.mContext.strokeStyle	=		this.mContext.strokeColor;
        this.mContext.lineWidth		=		5.0;
        this.mContext.lineJoin		=		"round";
        this.mContext.strokeText(inString,rect.x,rect.y);
        */
        this.mContext.fillText(inString,rect.x,rect.y);
        this.mContext.restore();
        /*
        this.mContext.save();
        var size = this.mContext.measureText(inString);

        //inPos.x -= size.width/2;
        //inPos.y -= size.height/2;

        this.mContext.font =		String(rect.h) + "px " + 'dinbold';
        this.mContext.textBaseline	=	'middle';
        this.mContext.textAlign		=	"center";
        this.mContext.fillStyle = inColour;
        this.mContext.strokeColor ='#333333';

        //this.mContext.fillText(inString,rect.x,rect.y);


        var thisStyle		=		{
            size		:	rect.h,
            color		:	inColour,
            strokeColor	:	'#333333',
            font		:	'dinbold',
            alpha		:	1.0,
            textBaseline: 'middle',
            textAlign:	"center"
        };

        this.drawText(inString,thisStyle,rect);

        this.mContext.restore();
        */
    },


    GLText:function(inSize,inString,inPos,inColour,inJustification)
    {
        var rect = new RMRect();

        rect.set(inPos.x,inPos.y,inSize,inSize);
        rect = this.toScreenSpace(rect);

        this.mContext.save();
        this.mContext.font =		String(rect.h) + "px " + 'dinbold';
        this.mContext.textBaseline	=	'middle';
        this.mContext.textAlign		=	inJustification==undefined?"center":inJustification;
        this.mContext.fillStyle = inColour;

        this.mContext.fillText(inString,rect.x,rect.y);
        this.mContext.restore();
    },

    //
    //unscaled
    //

    rect:function(inRect,inColour)
    {
        this.mContext.fillStyle = inColour;
        this.mContext.fillRect(Math.floor(inRect.x)
                              ,Math.floor(inRect.y)
                              ,Math.floor(inRect.w)
                              ,Math.floor(inRect.h) );
    },

    sprite:function(inName,inRect,uvRect)
    {
        if((inName != null) && (inName.width >0))
        {
            if(uvRect == undefined)
            {
                this.mContext.drawImage(inName
                                       ,Math.floor(inRect.x)
                                       ,Math.floor(inRect.y)
                                       ,Math.floor(inRect.w)
                                       ,Math.floor(inRect.h) );
            }
            else
            {
                try
                {
                    this.mContext.drawImage(inName
                        ,uvRect.x,uvRect.y,uvRect.w,uvRect.h
                        ,inRect.x,inRect.y,inRect.w,inRect.h
                    );
                }
                catch(err)
                {
                    alert(err);
                }
            }
        }
        else
        {
            if(false)
            {
                this.strokeRect(inRect, '#ff0000');
            }
        }
    },

    strokeRect:function(inRect,inColour)
    {
        this.mContext.strokeStyle = inColour;
        this.mContext.strokeRect(inRect.x,inRect.y,inRect.w,inRect.h);
    },

    line:function(x0,y0,x1,y1,inColour)
    {
        this.mContext.strokeStyle = inColour;
        this.mContext.beginPath();
        this.mContext.moveTo(x0, y0);
        this.mContext.lineTo(x1, y1);
        this.mContext.stroke();
    },

    circle:function(inX,inY,inRadius, inColour)
    {
        this.mContext.beginPath();
        this.mContext.arc(inX,inY,inRadius,0,2*Math.PI,false);
        this.mContext.fillStyle = inColour;
        this.mContext.fill();
    },

    strokeCircle:function(inX,inY,inRadius, inColour)
    {
        this.mContext.beginPath();
        this.mContext.arc(inX,inY,inRadius,0,2*Math.PI,false);
        this.mContext.strokeStyle = inColour;
        this.mContext.lineWidth = 2;
        this.mContext.stroke();
    },

    Text:function(inSize,inString,inPos,inColour,inAlign)
    {
        this.mContext.save();
        this.mContext.font =		String(inSize) + "px " + 'dinbold';
        this.mContext.textBaseline	=	'middle';
        this.mContext.textAlign		=	inAlign==undefined?"center":inAlign;
        this.mContext.fillStyle = inColour;

        this.mContext.fillText(inString,inPos.x,inPos.y);
        this.mContext.restore();
    }
}

renderToCanvas = function(w,h,obj, func)
{
    var dest = document.createElement("canvas");
    dest.width = w;
    dest.height = h;

    func(dest,obj);

    return dest;
}
