

// JavaScript Document


var RMGameTimer		=		function(){
	
	this.mTimer			=		null;
	this.mCurrentTime	=		0;
	this.mLastTime		=		0;
	this.mElapsedTime	=		0;
	this.mRunning		=		false;
	this.eUpdate		=		new RMGameTimerEvent(this);
	
	
}


RMGameTimer.prototype		=		{
	
	start:function(){
		var self		=		this;
		
		this.mCurrentTime	=		getTicks();
		this.mLastTime		=		this.mCurrentTime;
		this.mRunning		=		true;
		this.mTimer			=		setInterval(function(){
			
			
			self.doTimer();
			
			
			},16)	;
	},
	stop:function(){
		if(!this.mTimer) return;
		clearInterval(this.mTimer);
		this.mTimer		=		null;
		this.mRunning	=		false;
	},
	doTimer:function(){
		this.mCurrentTime	=		getTicks();
		this.mElapsedTime	=		this.mCurrentTime - this.mLastTime;
		this.mLastTime		=		this.mCurrentTime;
		this.eUpdate.notify({elapsed : this.mElapsedTime/1000.0});
		
	}
	
	
	
};


var RMGameTimerEvent	=	function(sender){
	this._sender	=	sender;
	this._listeners	=	[];
	
};

RMGameTimerEvent.prototype	=	{
	attach : function(listener,owner){
		this._listeners.push({listener:listener,owner:owner});	
	},
	notify: function(args){
		var i;
		for(i=0;i<this._listeners.length;i++)
        {
			this._listeners[i].listener.call(this._listeners[i].owner,this._sender,args);
		}
	}
};

