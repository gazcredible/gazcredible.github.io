var ResumeInfo = function()
{
    this.looping = false;
    this.position = 0;
    this.isPlaying = false;
};

var AudioInstance = function(inSample)
{
    this.voice = null;
    this.volume = null;
    this.panner = null;
    this.playing = false;

    this.resumeInfo = new ResumeInfo();

    if(inSample != undefined)
    {
        this.sampleID = inSample;
    }
    else
    {
        this.sampleID = "";
    }

    //this.panEnabled = true;

    this.init();
};

AudioInstance.prototype.init = function()
{
    try
    {
        if(gAudioWebkit.context != null)
        {
            this.volume = gAudioWebkit.createGainNode();
            this.volume.gain.value = 1.0;
            this.volume.connect(gAudioWebkit.volume);
            this.playing = false;
            if(this.panEnabled == true)
            {
                this.panner = gAudioWebkit.context.createPanner();
                this.panner.connect(this.volume);
                this.panner.coneOuterGain = 1.0;
                this.panner.coneOuterAngle = 180;
                this.panner.coneInnerAngle = 0;
                this.panner.setPosition(0,0,0);
            }
        }
    }catch(ex)
    {
        alert("AudioInstance:init " + ex);
    }
};

//GARETH pan -1 ... 0 ... 1
AudioInstance.prototype.setPan = function(inPan)
{
    if((this.panEnabled == true) && (this.panner != null))
    {
        this.panner.setPosition(inPan,0,0);
    }
};

AudioInstance.prototype.setVolume = function(inVolume)
{
    if(this.volume != null)
    {
        inVolume = Math.min(Math.max(inVolume,0),1);
        this.volume.gain.value = inVolume;
    }
};


AudioInstance.prototype.play = function(bufferName,loop)
{
    try
    {
        if(gAudioWebkit.context != null)
        {
            if(this.voice != null)
            {
                gAudioWebkit.removeAudioInstance(this);

                if(this.isPlaying() == true)
                {
                    this.stop();
                }
            }

            this.voice = gAudioWebkit.context.createBufferSource();
            try
            {
                if(bufferName != undefined)
                {
                    this.voice.buffer = gAudioWebkit.bufferList[bufferName];
                    //console.warn("Playing buffer: " + bufferName + " ");
                }
                else
                {
                    this.voice.buffer = gAudioWebkit.bufferList[this.sampleID];
                    //console.warn("Playing sample name: " + this.sampleID +" ");
                }

                if(this.panEnabled == true)
                {
                    this.voice.connect(this.panner);
                }
                else
                {
                    this.voice.connect(this.volume);
                }

                if((loop != undefined) && (loop != false))
                {
                    this.voice.loop = loop;
                }
                else
                {
                    this.voice.loop = false;
                }

                gAudioWebkit.addAudioInstance(this);
                this.voice.start(0);
                this.voice.onended = this.voiceFinished;
                this.playing = true;
                return true;
            }catch(e)
            {
                //alert("AudioInstance.play: " + e);
                return false;
            }
        }
    }
    catch(ex)
    {
        alert("AudioInstance:play " + ex);
    }
    return true;
};

AudioInstance.prototype.voiceFinished = function(event)
{
    // on voice finished playing
    if(this.loop == false)
    {
        var voice = gAudioWebkit.getInstanceFromVoice(this);
        voice.playing = false;

        gAudioWebkit.removeAudioInstance(voice);
    }
};

AudioInstance.prototype.playIfNotBusy = function(loop)
{
    if(this.isPlaying() == false)
    {
        this.play(this.sampleID,loop);
    }
}

AudioInstance.prototype.playDefault=function(loop)
{
    this.play(this.sampleID,loop);
}

AudioInstance.prototype.isPlaying = function()
{
    if(this.voice == null)
    {
        return false;
    }

    return (this.playing == true);
};

AudioInstance.prototype.pause = function()
{
    this.resumeInfo.isPlaying = this.isPlaying();

    if(this.voice != null)
    {
        this.resumeInfo.looping = this.voice.loop;
    //    this.resumeInfo.position = this.voice.po
    }

    if(this.resumeInfo.isPlaying == true)
    {
        this.stop();
    }
};

AudioInstance.prototype.resume = function()
{
    if(this.resumeInfo.isPlaying == true)
    {
        this.play(this.sampleID,this.resumeInfo.looping);
    }
};

AudioInstance.prototype.stop = function()
{
    if(this.voice != null)
    {
        if(this.isPlaying() == true)
        {
            this.voice.stop(0);
        }
        this.voice = null;
    }
};
//=============================================================================================
var RMAudioWebkit	=	function()
{
    this.context = null;
    this.inputEventCallback = null;

    this.bufferList = {};

    this.openLoadRequest = 0; // use to monitor loading ...

    this.audioInstanceLookup = [];

    this.resourceCount = 0;
    this.resourceLoaded = 0;
    this.bRunning = false;
}

function onError()
{
    console.warn("failed to load audio!");
}

RMAudioWebkit.prototype.init = function(inputEvent)
{
    try
    {
        if(window.AudioContext != undefined)
        {
            this.context = new AudioContext();
            this.volume = this.context.createGain();
        }

        if(window.webkitAudioContext != undefined)
        {
            this.context = new webkitAudioContext();
            this.volume = this.context.createGainNode();
        }

        if(this.context != null)
        {
            this.volume.gain.value = 1.0;

            this.volume.connect(this.context.destination);

            this.inputEventCallback = inputEvent;

            this.bRunning = true;
        }
    }catch(e)
    {
        //alert("Audio not supported");
    }

    return this.bRunning;
};

RMAudioWebkit.prototype.isRunning = function()
{
    return this.context != null;
};


RMAudioWebkit.prototype.onInputEvent = function()
{
    if(this.inputEventCallback != null)
    {
        this.inputEventCallback();
    }
};

RMAudioWebkit.prototype.toString = function()
{
    if(this.context == undefined)   return "n/a";

    return "running";
};

RMAudioWebkit.prototype.loadSample = function(url,name)
{
    if( (gAudioWebkit != undefined)
        &&(gAudioWebkit.context != null)
        )
    {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        gAudioWebkit.openLoadRequest++;
        gAudioWebkit.resourceCount++;

        // Decode asynchronously
        request.onload = function()
        {
            gAudioWebkit.context.decodeAudioData(request.response, function(buffer)
            {
                gAudioWebkit.bufferList[name] = buffer;
                gAudioWebkit.openLoadRequest--;
                gAudioWebkit.resourceLoaded++;
            }, onError);
        }
        request.send();
    }
};

RMAudioWebkit.prototype.isContentLoaded=function()
{
    return (gAudioWebkit.openLoadRequest==0);
};

RMAudioWebkit.prototype.isAvailable=function()
{
    return gAudioWebkit.context != null;
}

RMAudioWebkit.prototype.getMaseterVolume=function()
{
    if(this.isAvailable() == true)
    {
        return gAudioWebkit.volume.gain.value;
    }

    return 0;
};

RMAudioWebkit.prototype.setMaseterVolume=function(inVolume)
{
    if(this.isAvailable() == true)
    {
        gAudioWebkit.volume.gain.value = Math.min(Math.max(inVolume,0),1);
    }
};

RMAudioWebkit.prototype.createGainNode=function()
{
    if(window.AudioContext != undefined)
    {
        return this.context.createGain();
    }

    if(window.webkitAudioContext != undefined)
    {
        return this.context.createGainNode();
    }

    return null;
}



RMAudioWebkit.prototype.addAudioInstance=function(inInstance)
{
    this.audioInstanceLookup.push(inInstance);
};

RMAudioWebkit.prototype.getInstanceFromVoice=function(inVoice)
{
    for(var i=0;i<this.audioInstanceLookup.length;i++)
    {
        if(this.audioInstanceLookup[i].voice == inVoice)
        {
            return this.audioInstanceLookup[i];
        }
    }

    return null
};


RMAudioWebkit.prototype.removeAudioInstance=function(inInstance)
{
    var newArray = [];
    if(inInstance != null)
    {
        for(var i=0;i<this.audioInstanceLookup.length;i++)
        {
            if(this.audioInstanceLookup[i] != inInstance)
            {
                newArray.push(this.audioInstanceLookup[i]);
            }
        }

        this.audioInstanceLookup = newArray;
    }
}

var gAudioWebkit = new RMAudioWebkit();
