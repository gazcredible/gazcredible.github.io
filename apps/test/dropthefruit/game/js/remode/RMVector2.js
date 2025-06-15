/*
	
	RMVector2
	V 0.0
	Remode Studios
	22/02/12
	Chris Hebert

*/


var RMVector2	=	function(inX,inY,inW)
{
    this.x = 0;
    this.y=0;
    this.w=0;

    if(inX != undefined)
    {
        this.x = inX;
    }

    if(inY != undefined)
    {
        this.y = inY;
    }

    if(inW != undefined)
    {
        this.w = inW;
    }
}

RMVector2.delta		=		function(inA,inB){
	var v0			=		inA.clone();
	v0.subtract(inB);
	return v0.length();	
}

RMVector2.create 	=		function(inX,inY){
	var outVector	=		new RMVector2(inX,inY,1.0);
	return outVector;	
}

RMVector2.createZero 	=		function(){
	var outVector	=		new RMVector2(0.0,0.0,1.0);
	return outVector;	
}

RMVector2.prototype	=		{
	randomPosition:function(inRange){
		this.x		=		(Math.random() * inRange * 2.0) - inRange;
		this.y		=		(Math.random() * inRange * 2.0) - inRange;
	},
	randomDirection:function(){
		var theta;			
		theta		=		Math.random() * 360.0;
		
		this.x			=		cosine(theta);
		this.y			=		-sine(theta);
	},
	clear:function(){
		this.x		=		0.0;
		this.y		=		0.0;
	},
	setTo:function(inVector){
		this.x			=		inVector.x;
		this.y			=		inVector.y;
	},
	setToN:function(inX,inY){
		this.x		=		inX;
		this.y		=		inY;
	},
	delta:function(inPoint){
		var thisP;
		
		thisP		=		this.clone();
		thisP.subtract(inPoint);
		return thisP.length();
		
	},
	add:function(inVector){
		this.x		+=		inVector.x;
		this.y		+=		inVector.y;
	},
	addScaled:function(inVector,inScale){
		this.x		+=		(inVector.x * inScale);
		this.y		+=		(inVector.y * inScale);
	},
	subtract:function(inVector){
		this.x		-=		inVector.x;
		this.y		-=		inVector.y;
	},
	multiply:function(inVector){
		this.x		*=		inVector.x;
		this.y		*=		inVector.y;
	},
	divide:function(inVector){
		this.x		/=		inVector.x;
		this.y		/=		inVector.y;
	},
	addN:function(inX,inY){
		this.x		+=		inX;
		this.y		+=		inY;
	},
	subtractN:function(inX,inY){
		this.x		-=		inX;
		this.y		-=		inY;
	},
	multiplyN:function(inX,inY){
		this.x		*=		inX;
		this.y		*=		inY;
	},
	divideN:function(inX,inY){
		this.x		/=		inX;
		this.y		/=		inY;
	},
	scaleBy:function(inValue){
		this.x		*=		inValue;
		this.y		*=		inValue;
	},
	normal:function(){
		var thisX,thisY;
		thisX		=		-this.y;
		thisY		=		this.x;
		this.x		=		thisX;
		this.y		=		thisY;	
	},
	dot:function(inVector){
		return (this.x * inVector.x) + (this.y * inVector.y);	
	},
	det:function(inVector){
		return (this.x * inVector.y) - (this.y * inVector.x);	
	},
	lengthSquared:function(){
		return Math.pow(this.x,2) + Math.pow(this.y,2);
	},
	length:function(){
		return Math.sqrt(this.lengthSquared());
	},
	unitVector:function(){
		var theMag	=		this.length();
		if(theMag == 0) return;
		this.scaleBy(1.0/theMag);
	},
	rotate:function(inTheta){
		var thisX,thisY;
		var rads		=		rad(inTheta);
		
		thisX			=		this.x * Math.cos(rads) - this.y * Math.sin(rads);
		thisY			=		this.x * Math.sin(rads) + this.y * Math.cos(rads)
		
		this.x			=		thisX;
		this.y			=		thisY;
	},
	getAngle:function(inP1){
		var p1;
		var outRad;
		var outDeg;
		
		p1				=		inP1.clone();
		p1.subtract(this);
		
		outRad			=		Math.atan2(p1.x,p1.y);
		outDeg			=		deg(outRad);
		return outDeg;
	},
	clone:function(){
		return new RMVector2(this.x,this.y,1.0);	
	},

    toString:function()
    {
        return ""+this.x.toFixed(2)+ ":" + this.y.toFixed(2);
    },

    //GARETH

    normalise:function()
    {
        var len = this.length();

        this.x /= len;
        this.y /= len;
    }

};