var BuzzSample = function(instance)
{
    this.instance = instance;
    this.state = false;
    this.volume = 0;
}

var BuzzInstance= function(inName)
{
    this.sampleID = inName;
};

BuzzInstance.prototype.setVolume = function(inVol)
{
    var sample = gBuzzAudio.channelList[this.sampleID];

    if(inVol != undefined)
    {
        sample.volume = inVol;
    }

    sample.instance.setVolume( (sample.volume*100) * gBuzzAudio.globalVolume);
};

BuzzInstance.prototype.setPan = function(inVol)
{
};


BuzzInstance.prototype.pause = function()
{
    var percent = (gBuzzAudio.channelList[this.sampleID].instance.getPercent());

    if( (percent >0) && (percent <100))
    {
        gBuzzAudio.channelList[this.sampleID].instance.pause();
        gBuzzAudio.channelList[this.sampleID].state = true;
    }
    else
    {
        gBuzzAudio.channelList[this.sampleID].state = false;
    }
};

BuzzInstance.prototype.resume = function()
{
    if(gBuzzAudio.channelList[this.sampleID].state == true)
    {
        gBuzzAudio.channelList[this.sampleID].instance.play();
        gBuzzAudio.channelList[this.sampleID].state = false;
    }
};

BuzzInstance.prototype.playIfNotBusy = function(inSample,loop)
{
    if(this.isPlaying() == true)
    {
        return;
    }

    gBuzzAudio.channelList[this.sampleID].instance.load();

    gRMDebug.warn("Buzz: play " + this.sampleID);
    gBuzzAudio.channelList[this.sampleID].instance.play();
};

BuzzInstance.prototype.isPlaying = function()
{
    var percent = gBuzzAudio.channelList[this.sampleID].instance.getPercent();
    if (percent == '--')    return false;
    return ((percent>0) && (percent<99));
};



BuzzInstance.prototype.playDefault = function(loop)
{
    gBuzzAudio.channelList[this.sampleID].instance.stop();

    this.playIfNotBusy("",loop);
};

//===========================================================================

var RMBuzzAudio	=	function()
{
    this.channelList = {};
    this.inputEventCallback = null;
    this.bRunning = false;

    this.globalVolume = 1;
};

RMBuzzAudio.prototype.init = function(inputEvent)
{
    this.inputEventCallback = inputEvent;
    this.bRunning = true;

    return this.bRunning;
};

RMBuzzAudio.prototype.isRunning = function()
{
    return this.bRunning;
};



RMBuzzAudio.prototype.loadSample = function(url,sampleID)
{
    this.channelList[sampleID] = new BuzzSample(new buzz.sound(url,{preload:true} ));
    this.channelList[sampleID].instance.load();
};

RMBuzzAudio.prototype.onInputEvent = function()
{
    if(this.inputEventCallback != null)
    {
        this.inputEventCallback();
    }
};

RMBuzzAudio.prototype.mute = function()
{
    this.globalVolume = 0;
    for(var key in this.channelList)
    {
        if(this.channelList.hasOwnProperty(key))
        {
            var value = this.channelList[key];

            try
            {
                value.instance.mute();
            }catch(e)
            {
            }
        }
    }
};

RMBuzzAudio.prototype.unmute = function()
{
    this.globalVolume = 1;
    for(var key in this.channelList)
    {
        if(this.channelList.hasOwnProperty(key))
        {
            var value = this.channelList[key];

            try
            {
                value.instance.unmute();
            }catch(e)
            {
            }
        }
    }
};

gBuzzAudio = new RMBuzzAudio();
