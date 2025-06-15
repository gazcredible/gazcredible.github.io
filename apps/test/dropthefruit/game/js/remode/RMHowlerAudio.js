
var HowlerInstance= function(inName)
{
    var names = [];
    names.push(inName);
    this.howlInstance = new Howl({urls:names});
};

HowlerInstance.prototype.setVolume = function(inVol)
{
    this.howlInstance.volume(inVol);
};

HowlerInstance.prototype.setPan = function(inVol)
{
};


HowlerInstance.prototype.pause = function()
{
    this.howlInstance.pause();
};

HowlerInstance.prototype.resume = function()
{
    this.howlInstance.play();
};

HowlerInstance.prototype.playIfNotBusy = function(loop)
{
    if(loop != undefined)
    {
        this.howlInstance.loop(loop);
    }

    this.howlInstance.play();
};

HowlerInstance.prototype.play = function()
{
    this.howlInstance.play();
};

HowlerInstance.prototype.isPlaying = function()
{
    return false;
};



HowlerInstance.prototype.playDefault = function(loop)
{
};

//===========================================================================

var RMHowlerAudio	=	function()
{
    this.channelList = {};
    this.inputEventCallback = null;
    this.bRunning = false;

    this.globalVolume = 1;
};

RMHowlerAudio.prototype.init = function(inputEvent)
{
    this.inputEventCallback = inputEvent;
    this.bRunning = true;

    return this.bRunning;
};

RMHowlerAudio.prototype.isRunning = function()
{
    return this.bRunning;
};



RMHowlerAudio.prototype.loadSample = function(url,sampleID)
{
    this.channelList[sampleID] = new HowlerSample(new buzz.sound(url,{preload:true} ));
    this.channelList[sampleID].instance.load();
};

RMHowlerAudio.prototype.onInputEvent = function()
{
    if(this.inputEventCallback != null)
    {
        this.inputEventCallback();
    }
};

RMHowlerAudio.prototype.mute = function()
{
    Howler.mute();
};

RMHowlerAudio.prototype.unmute = function()
{
    Howler.unmute();
};

gHowlerAudio = new RMHowlerAudio();
