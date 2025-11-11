class Drummachine
{
    constructor()
    {
        this.frameCount = 0;
        this.seq_length = 16;
        this.step = 0;

        //dictionary of sample names to samples
        this.sampleMap = {};

        //create audio subsystem
        let audio_context = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new audio_context();

        this.masterVolume = this.audioContext.createGain();
        this.masterVolume.gain.value = 0.5;
        this.masterVolume.connect(this.audioContext.destination);

        this.oldTime = this.audioContext.currentTime;

        this.bpm = 85;
        this.beats_per_bar = 4;

        //list of sequencers
        this.tracks = [];

        //set up UI components
        this.masterVol = new GUIDial(1500,100,40);
        this.masterVol.value = 0.5;

        this.masterTempo = new GUIDial(1500,220,40,400);
        this.masterTempo.value = 0.5;

        this.mode = "pause";

        //set-up button widgets with callback functions.
        //note how the callback functions are using the drummachineInst to access drummachine data
        //as the function isn't part of the drummachine class
        this.playButton = new GUIButtonText(new Rect(1400,400,150,50), "PLAY", function (button)
        {
            if(drummachineInst.mode === "play")
            {
                drummachineInst.mode = "pause";
                button.label = "PLAY";
            }
            else
            {
                if(drummachineInst.mode === "pause")
                {
                    drummachineInst.mode = "play";
                    button.label = "PAUSE";
                }
            }

            if(drummachineInst.mode === "stop")
            {
                drummachineInst.mode = "play";
                button.label = "PAUSE";
            }
        });

        this.stopButton = new GUIButtonText(new Rect(1400,500,150,50), "STOP", function (button)
        {
            drummachineInst.mode = "stop";
            drummachineInst.playButton.label = "PLAY";
        });

        this.clearButton = new GUIButtonText(new Rect(1400,600,150,50), "CLEAR", function (button)
        {
            for (let i = 0; i < drummachineInst.tracks.length; i++)
            {
                drummachineInst.tracks[i].clear();
            }
        });

        this.itemBGCol = "#aaaaaa";
        this.itemDarkBGCol = "#777777";
        this.itemSelectCol = "#ffff00";
        this.textStyle = 'Archivo Black';
    }
    
    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1600,900);

        let seq_length = 16;
        let step = 0;

        //load all the samples and map them to their SHOUTY names
        let samples = [
            ["sfx/big room clap.wav", "CLAP"],
            ["sfx/big room claves.wav", "CLAVES"],
            ["sfx/big room closed hat.wav", "CLOSED HAT"],
            ["sfx/big room crash.wav", "CRASH"],
            ["sfx/big room fx.wav", "FX"],
            ["sfx/big room hat.wav", "HAT"],
            ["sfx/big room kick 1.wav", "KICK 1"],
            ["sfx/big room kick 2.wav", "KICK 2"],
            ["sfx/big room ride.wav", "RIDE"],
            ["sfx/big room shaker.wav", "SHAKER"],
            ["sfx/big room snare.wav", "SNARE"],
            ["sfx/big room tom.wav", "TOM"],
        ];

        for(let i=0;i<samples.length;i++)
        {
            this.loadSample(samples[i][0],samples[i][1], function (buffer,name)
            {
                drummachineInst.sampleMap[name] =  buffer;
            });
        }

        //set the reference screen size.
        //All the GAZCanvas calls will scale and shift drawing so that it's aspect-correct to this screen resolution
        GAZCanvas.referenceScreenSize = new Size(1600,900);

        
        //create sequencer tracks based on samples loaded above.
        //Note how the tracks are in a different order to the samples, this uses the track[] as a name lookup
        //so when a sample is played, it will use the track name as a look up back to the sample
        
        let itemBGCol = "#aaaaaa";
        let itemDarkBGCol = "#777777";
        let itemSelectCol = "#ffff00";

        let cellSize = new Size(60,60);
        let tracks = ["CLAP", "CLAVES", "CLOSED HAT","HAT", "CRASH", "RIDE","FX","SHAKER","TOM","SNARE","KICK 2","KICK 1"];

        for(let i=0;i<tracks.length;i++)
        {
            this.tracks.push(new Sequencer(seq_length, new Vector2(100, 20+(i*(cellSize.h+2))), cellSize, tracks[i]));
        }
    }

    update()
    {
        /*
            In this application, update() handles updating the application and drawing the scene
            So applications (and games) don't have to have separate update() and draw() functions, but it's normally
            done to split the update and drawing functionality. In an application like this, the update and drawing
            functionality are fairly simple, so there's no huge benefit in separating them, though this could be done
            if the app becomes more complicated
         */
        
        //clear the screen
        GAZCanvas.Rect( new Rect(0,0,1600,900), '#555555');

        //update the master volume dial and draw it with text
        //this could be done in the dial update() code, but these dials have different drawing methods, so it may make
        //sene to make the text drawing a callback function ;)
        {
            this.masterVol.update();
            this.masterVolume.value = this.masterVol.value;

            let pos = this.masterVol.centre.clone();
            pos.y += this.masterVol.radius * 1.5;

            GAZCanvas.Text(22, "Vol:" + this.masterVolume.value.toFixed(2), pos, '#000000', 'center',this.textStyle);
        }

        //ditto for the tempo dial
        {
            this.masterTempo.update();

            this.bpm = 30 + (150 * this.masterTempo.value);

            let pos = this.masterTempo.centre.clone();
            pos.y += this.masterTempo.radius * 1.5;

            GAZCanvas.Text(22, "Tempo:" + this.bpm.toFixed(0), pos, '#000000', 'center',this.textStyle);
        }

        //add some white lines to show where the bars start/end
        GAZCanvas.Rect(new Rect(345,20,3,742),"#ffffff");
        GAZCanvas.Rect(new Rect(594,20,3,742),"#ffffff");
        GAZCanvas.Rect(new Rect(842,20,3,742),"#ffffff");

        //update the buttons. Again, update() includes drawing()
        this.playButton.update();
        this.stopButton.update();
        this.clearButton.update();

        for(let i=0;i< this.tracks.length;i++)
        {
            this.tracks[i].update();
        }

        /*
            do the frame logic.
            The app has three modes (play, pause & stop)
            
            if the app is in play mode, it will trigger new samples if enough time has elapsed to increment the beat of
            the sequencer.
            
            if the app is in pause mode, it will just update the 'oldtime' so that that when the app returns to play mode
            it wont have a backlog of samples to play
            
            if the app is in stop mode, it will set the current step to 0 in the sequencer tracks and update the oldtime
            like it does in pause mode - for the same reason
         */
        if(this.mode === "play")
        {
            let now = this.audioContext.currentTime;
            let gap = now - this.oldTime;

            if (gap > (60 / (this.bpm * this.beats_per_bar)))
            {
                this.oldTime += gap;

                for (let i = 0; i < this.tracks.length; i++)
                {
                    this.tracks[i].play(this.step, now);
                }

                this.step = (this.step + 1) % this.seq_length;
            }
        }

        if(this.mode==="pause")
        {
            this.oldTime = this.audioContext.currentTime;
        }

        if(this.mode==="stop")
        {
            this.step = 0;
            for (let i = 0; i < this.tracks.length; i++)
            {
                this.tracks[i].currentStep = this.step;
            }

            this.oldTime = this.audioContext.currentTime;
        }
    }
    
    //loadSample -  local HttpRequest to load a sample file and decode it with the audio context. On successful load,
    //              the function will call the callback funciton so that the sample can be registered to whatever,
    //              in this case, the dictionary of sample names to sample data
    loadSample(url, name, callback)
    {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function()
        {
            let audioData = request.response;
            drummachineInst.audioContext.decodeAudioData(audioData, function(buffer)
            {
                callback(buffer,name);
            });
        };
        request.send();
    }

    //Run function for app
    Run()
    {
        drummachineInst.oneTimeInit();
        setInterval(function()
        {
            GAZCanvas.update();
            
            Input.update();
    
            let letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
            
            drummachineInst.update();
    
            GAZCanvas.drawLetterbox(letterboxColour);
    
            var rect = new Rect(0,850,180,30);
            GAZCanvas.Rect(rect, 'rgb(127,127,32)');
            GAZCanvas.Text(20, 'Click Here To Quit',new Vector2(10,870),'#ffffff','left');
    
            if( (rect.isInMe(Input.mouseLogicalPos) == true)
                &&(Input.currentMouseState !== INPUT_NOT_PRESSED)
            )
            {
                console.log("quit");
                window.location.href = '../';
            }
        },17);
    }
}

drummachineInst = new Drummachine();