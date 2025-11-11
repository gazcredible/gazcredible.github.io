var DTFAudio = function()
{
    this.soundbank = null;
    this.buffer_tune0 = null;
    this.voice_tune0= null;


    this.loadedVoices = false;

    this.initForiOS = false;

    this.currentInstances = [];


    this.wrapperTune = null;
    this.gameTune = null;

    this.buttonfx = null;
    this.fruitfx = null;
    this.ballOnTruckfx = null;
    this.ballOnWallfx = null;

    this.buckBallfx = null;
    this.freeThrowfx = null;

    this.creatureJumpfx = null;
    this.fruitdropfx = null;
    this.vanloopL = null;
    this.vanloopR = null;

    this.fruitInitialRipeHit = null;
    this.fruitSubsequentRipeHit = null;

    this.currentTune = null;
    this.crossfadeTunes = false;
    this.crossfadeVolume = 0.0;

    this.bPlayVanFX = false;
    this.mute = false;
    this.playLoops = false;

    this.globalAttenuation = 0;

    this.userHowler = true;
};

DTFAudio.prototype.oneTimeInit = function()
{
    if(gEnableAudio == true)
    {
        /*
        if( (gRMPlatform.getPlatform() == "iOS")
          &&(gRMPlatform.getVersion().Major >6 )
            )
            */
        if(false)
        {
            this.userHowler = false;
            // use webkitAudio
            gAudioWebkit.init(this.eventCallback);

            console.error("start webkit");
            //load all the audio samples into buffers
            //loadSound('game/data/audio/test00.mp3');
            gAudioWebkit.loadSample('game/data/audio/drop_2.mp3','menu tune');

            gAudioWebkit.loadSample('game/data/audio/drop_1.mp3','game tune');

            gAudioWebkit.loadSample('game/data/audio/beep.mp3','annoying beep');

            gAudioWebkit.loadSample('game/data/audio/spotfx/button_click.mp3','button fx');
            gAudioWebkit.loadSample('game/data/audio/spotfx/fruithit.mp3','ball hit');
            gAudioWebkit.loadSample('game/data/audio/spotfx/ripefruit_first_hit.mp3','ripefruitinitial hit');
            gAudioWebkit.loadSample('game/data/audio/spotfx/ripefruit_hit.mp3','ripefruit hit');
            gAudioWebkit.loadSample('game/data/audio/spotfx/unripefruit_hit.mp3','unripefruit hit');

            gAudioWebkit.loadSample('game/data/audio/spotfx/droppingfruit.mp3','droppingfruit');
            gAudioWebkit.loadSample('game/data/audio/spotfx/freethrow.mp3','free throw');
            gAudioWebkit.loadSample('game/data/audio/spotfx/leapingcreature.mp3','leaping creature');
            gAudioWebkit.loadSample('game/data/audio/spotfx/test.wav','truck loop');

            gAudioWebkit.loadSample('game/data/audio/spotfx/levelcomplete_success.mp3','level success');

            this.wrapperTune = new AudioInstance('menu tune',true);
            this.gameTune = new AudioInstance('game tune',true);

            this.buttonfx = new AudioInstance('button fx');
            this.fruitfx = new AudioInstance('unripefruit hit');
            this.fruitInitialRipeHit = new AudioInstance('ripefruitinitial hit');
            this.fruitSubsequentRipeHit = new AudioInstance('ripefruit hit');
            this.ballOnTruckfx = new AudioInstance('ball hit');
            this.ballOnWallfx = new AudioInstance('ball hit');
            this.buckBallfx = new AudioInstance('free throw');
            this.freeThrowfx = new AudioInstance('free throw');
            this.creatureJumpfx = new AudioInstance('leaping creature');
            this.fruitdropfx = new AudioInstance('droppingfruit');
            this.vanloopL = new AudioInstance('truck loop');
            this.vanloopR = new AudioInstance('truck loop');

            this.levelCompleteSuccess = new AudioInstance('level success');
        }
        else
        {
            gHowlerAudio.init(this.eventCallback);

            gRMDebug.warn("start howler " + gRMPlatform.getDeviceName());

            this.buttonfx = new HowlerInstance('game/data/audio/spotfx/button_click.mp3');
            this.fruitfx = new HowlerInstance('game/data/audio/spotfx/unripefruit_hit.mp3');
            this.fruitInitialRipeHit = new HowlerInstance('game/data/audio/spotfx/ripefruit_first_hit.mp3');
            this.fruitSubsequentRipeHit = new HowlerInstance('game/data/audio/spotfx/ripefruit_hit.mp3');

            this.ballOnTruckfx = new HowlerInstance('game/data/audio/spotfx/fruithit.mp3');
            this.ballOnWallfx = new HowlerInstance('game/data/audio/spotfx/fruithit.mp3');
            this.buckBallfx = new HowlerInstance('game/data/audio/spotfx/freethrow.mp3');
            this.freeThrowfx = new HowlerInstance('game/data/audio/spotfx/freethrow.mp3');
            this.creatureJumpfx = new HowlerInstance('game/data/audio/spotfx/leapingcreature.mp3');
            this.fruitdropfx = new HowlerInstance('game/data/audio/spotfx/droppingfruit.mp3');

            this.levelCompleteSuccess = new HowlerInstance('game/data/audio/spotfx/levelcomplete_success.mp3');

            if ((false) || ((gRMPlatform.isAndroid() == true) || (gRMPlatform.isIE() == true)))
            {
                // no music for you
                this.playLoops = false;
            }
            else
            {
                this.playLoops = true;
                // music for you!
                this.wrapperTune = new HowlerInstance('game/data/audio/drop_2.mp3');
                this.gameTune = new HowlerInstance('game/data/audio/drop_1.mp3');

                this.vanloopL = new HowlerInstance('game/data/audio/spotfx/test.wav');
                this.vanloopR = new HowlerInstance('game/data/audio/spotfx/test.wav');
            }
        }

        this.mute = false;
        if(gAudioMute == true)
        {
            this.mute = true;
        }
    }
};

DTFAudio.prototype.playLoopingSamples=function()
{
    return false;

    if(gRMPlatform.getDeviceName() == 'GT-I9100')   return false;

    return true;
}

DTFAudio.prototype.update = function()
{
    if(this.userHowler==true)
    {
        if(this.mute == true)
        {
            gHowlerAudio.mute();
        }
        else
        {
            if(gRMPlatform.isActiveWindow() == false)
            {
                gHowlerAudio.mute();
            }
            else
            {
                gHowlerAudio.unmute();
            }
        }

        if(this.playLoops == true)
        {
            if(this.initForiOS == false)   return;

            if(this.currentTune == "wrapper")
            {
                if(this.wrapperTune)    this.wrapperTune.setVolume(this.crossfadeVolume);
                if(this.gameTune)       this.gameTune.setVolume(1-this.crossfadeVolume);
            }
            else
            {
                if(this.wrapperTune)    this.wrapperTune.setVolume(1-this.crossfadeVolume);
                if(this.gameTune)       this.gameTune.setVolume(this.crossfadeVolume);
            }

            if(this.bPlayVanFX == false)
            {
                this.vanloopL.setVolume(0);
                this.vanloopR.setVolume(0);
                return;
            }

            if(this.vanloopL.isPlaying() == false)
            {
                this.vanloopL.playDefault(true);
                this.vanloopR.playDefault(true);
            }

            var pan = gGame.model.dim2.position.x/800;

            if(pan < 0) pan = 0;
            if(pan > 1) pan = 1;

            this.vanloopL.setVolume(1-pan);
            this.vanloopR.setVolume(pan);
            this.vanloopL.setPan(-1);
            this.vanloopR.setPan(1);
        }
    }

    if(gAudioWebkit.isRunning() == true)
    {
        if(this.mute == true)
        {
            gAudioWebkit.setMaseterVolume(0);
        }
        else
        {
            if(gRMPlatform.isActiveWindow() == false)
            {
                gAudioWebkit.setMaseterVolume(0);
            }
            else
            {
                gAudioWebkit.setMaseterVolume(1);
            }

        }

        this.updateForAudioContext();
    }

    if(this.initForiOS == false)    return;

    // GARETH: do the cross fading here for BGM
    if(this.crossfadeTunes == true)
    {
        if(this.crossfadeVolume >= 1.0)
        {
            this.crossfadeVolume = 1.0;
            this.crossfadeTunes = false;
        }
        else
        {
            this.crossfadeVolume+= 0.05;
        }
    }

    //this.updateVan();
};

DTFAudio.prototype.eventCallback = function()
{
    // on iOS need to use this to trigger audio for first time ...
    var audio = gGame.audio;

    if(audio.initForiOS == true)
    {
        return;
    }

    if(gHowlerAudio.isRunning() == true)
    {
        audio.buttonfx.play();

        audio.initForiOS = true;
    }

    if(gAudioWebkit.isRunning() == true)
    {
        if(audio.initForiOS == false)
        {
            var tempAudio = new AudioInstance();
            tempAudio.setVolume(0);

            audio.initForiOS = tempAudio.play('annoying beep');
        }
    }


    if(gBuzzAudio.isRunning() == true)
    {
        if(audio.playLoopingSamples() == true)
        {
            gBuzzAudio.channelList['game tune'].instance.play();
            gBuzzAudio.channelList['game tune'].instance.setVolume(0);

            gBuzzAudio.channelList['truck loop'].instance.play();
            gBuzzAudio.channelList['truck loop'].instance.setVolume(0);
        }

        audio.initForiOS = true;
    }
};

DTFAudio.prototype.pause = function()
{
    if(this.userHowler==true)
    {
        Howler.mute();
        return;
    }

    if(this.playLoopingSamples() == true)
    {
        this.wrapperTune.pause();
        this.gameTune.pause();
        this.vanloopL.pause();
        if(this.vanloopR!= null)    this.vanloopR.pause();
    }

    this.buttonfx.pause();
    this.fruitfx.pause();
    this.fruitInitialRipeHit.pause();
    this.fruitSubsequentRipeHit.pause();
    this.ballOnTruckfx.pause();
    this.ballOnWallfx.pause();
    this.buckBallfx.pause();
    this.freeThrowfx.pause();
    this.creatureJumpfx.pause();
    this.fruitdropfx.pause();

    this.globalAttenuation = 1;
};

DTFAudio.prototype.resume = function()
{
    if(this.userHowler==true)
    {
        Howler.unmute();
        return;
    }



    if(this.playLoopingSamples() == true)
    {
        this.wrapperTune.resume();
        this.gameTune.resume();

        this.vanloopL.resume();
        if(this.vanloopR!= null)    this.vanloopR.resume();
    }

    this.buttonfx.resume();
    this.fruitfx.resume();
    this.fruitInitialRipeHit.resume();
    this.fruitSubsequentRipeHit.resume();
    this.ballOnTruckfx.resume();
    this.ballOnWallfx.resume();
    this.buckBallfx.resume();
    this.freeThrowfx.resume();
    this.creatureJumpfx.resume();
    this.fruitdropfx.resume();


    this.globalAttenuation = 0;
};

DTFAudio.prototype.playTune = function(inTuneName, crossfade)
{
    if(this.initForiOS == false)   return;

    if(this.currentTune != inTuneName)
    {
        this.currentTune = inTuneName;
        this.crossfadeTunes = crossfade;

        if(this.crossfadeTunes == false)
        {
            this.crossfadeVolume = 1.0;
            if(this.currentTune == "wrapper")
            {
                this.playWrapperTune(true);
                return;
            }

            if(this.currentTune == "ingame")
            {
                this.playInGameTune(true);
                return;
            }

            alert("playtune - " + inTuneName +" not valid");
        }
        else
        {
            this.crossfadeVolume = 0.0;
            this.playWrapperTune(true);
            this.playInGameTune(true);
        }
    }
};

DTFAudio.prototype.playWrapperTune = function(loop)
{
    if(this.initForiOS == false)   return;
    if(this.playLoopingSamples() == false)  return;

    this.wrapperTune.playIfNotBusy(loop);
};

DTFAudio.prototype.playInGameTune = function(loop)
{
    if(this.initForiOS == false)   return;

    if(this.gameTune != null)
    {
        this.gameTune.playIfNotBusy(loop);
    }
};

DTFAudio.prototype.playFruitHit=function()
{
    if(this.initForiOS == false)   return;
    this.fruitfx.playIfNotBusy();
};

DTFAudio.prototype.playRipeFruitInitialHit = function()
{
    if(this.initForiOS == false)   return;
    this.fruitInitialRipeHit.playIfNotBusy();
}

DTFAudio.prototype.playRipeFruitSubsequentHit = function()
{
    if(this.initForiOS == false)   return;
    this.fruitSubsequentRipeHit.playIfNotBusy();
}

DTFAudio.prototype.playButtonHit = function()
{
    if(this.userHowler==true)
    {
        gRMDebug.warn("Howler: play button fx");
        this.buttonfx.play();
        return;
    }

    if(this.initForiOS == false)   return;
    this.buttonfx.playIfNotBusy();
};

DTFAudio.prototype.playBallCollidesWithVan = function()
{
    if(this.initForiOS == false)   return;
    this.ballOnTruckfx.playIfNotBusy();
};

DTFAudio.prototype.playBallCollidesWithWall = function()
{
    if(this.initForiOS == false)   return;
    this.ballOnWallfx.playIfNotBusy();
};

DTFAudio.prototype.onBucketBall = function()
{

    if(this.initForiOS == false)   return;
    this.buckBallfx.playIfNotBusy();
};

DTFAudio.prototype.onFreeThrow = function()
{
    if(this.initForiOS == false)   return;
    this.freeThrowfx.playIfNotBusy();
};

DTFAudio.prototype.onCreatureJump = function()
{
    if(this.initForiOS == false)   return;
    this.creatureJumpfx.playIfNotBusy();
};

DTFAudio.prototype.onFruitDrop = function()
{
    if(this.initForiOS == false)   return;
    this.fruitdropfx.playIfNotBusy();
};

DTFAudio.prototype.playVan = function(inPlay)
{
    if(this.playLoopingSamples() == false)  return;
    this.bPlayVanFX = inPlay;
};


DTFAudio.prototype.playLevelCompleteSuccess = function()
{
    if(this.initForiOS == false)   return;
    this.levelCompleteSuccess.playIfNotBusy();
}

DTFAudio.prototype.getMute=function()
{
    return this.mute;
};

DTFAudio.prototype.setMute=function(inMute)
{
    this.mute= inMute;
};

DTFAudio.prototype.buzzLoop = function(channel)
{
    var percent = channel.getPercent();
    if(percent == '--')
    {
        channel.play();
    }

    if(percent >= 100)
    {
        channel.stop();
        channel.setPercent(0);
        channel.play();
    }
}

DTFAudio.prototype.updateForBuzz = function()
{
    if(this.initForiOS == false)   return;
    if(this.playLoopingSamples() == false)  return;

    this.buzzLoop(gBuzzAudio.channelList['game tune'].instance);

    gBuzzAudio.channelList['game tune'].instance.setVolume(100);

    this.buzzLoop(gBuzzAudio.channelList['truck loop'].instance);

    if(this.bPlayVanFX == false)
    {
        gBuzzAudio.channelList['truck loop'].instance.setVolume(0);
    }
    else
    {
        var pan = gGame.model.dim2.position.x/800;

        pan -= 0.5;
        pan *= 2;

        pan = 1- Math.abs(pan);

        pan =1;

        pan *= (1-this.globalAttenuation);

        gBuzzAudio.channelList['truck loop'].instance.setVolume(pan*100);
    }
};

DTFAudio.prototype.updateForAudioContext=function()
{
    if(this.initForiOS == false)   return;

    if(this.playLoopingSamples() == false)  return;

    if(this.currentTune == "wrapper")
    {
        if(this.wrapperTune)    this.wrapperTune.setVolume(this.crossfadeVolume);
        if(this.gameTune)       this.gameTune.setVolume(1-this.crossfadeVolume);
    }
    else
    {
        if(this.wrapperTune)    this.wrapperTune.setVolume(1-this.crossfadeVolume);
        if(this.gameTune)       this.gameTune.setVolume(this.crossfadeVolume);
    }

    //if(this.wrapperTune)    this.wrapperTune.setVolume(0);
    //if(this.gameTune)       this.gameTune.setVolume(0);

    if(this.bPlayVanFX == false)
    {
        this.vanloopL.setVolume(0);
        this.vanloopR.setVolume(0);
        return;
    }

    if(this.vanloopL.isPlaying() == false)
    {
        this.vanloopL.playDefault(true);
        this.vanloopR.playDefault(true);
    }

    var pan = gGame.model.dim2.position.x/800;

    if(pan < 0) pan = 0;
    if(pan > 1) pan = 1;

    this.vanloopL.setVolume(1-pan);
    this.vanloopR.setVolume(pan);
    this.vanloopL.setPan(-1);
    this.vanloopR.setPan(1);
}

DTFAudio.prototype.toString=function()
{
    var string = "";//gRMPlatform.getDeviceName() + " ";
    if(gAudioWebkit.isRunning() == true)
    {
        string += "audiowebkit";
    }

    if(gBuzzAudio.isRunning() == true)
    {
        string +="buzzAudio";
    }

    string += "play Loops: " + this.playLoopingSamples();

    return string;
}