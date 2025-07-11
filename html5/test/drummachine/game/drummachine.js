class Drummachine
{
    constructor()
    {
        this.frameCount = 0;
        this.seq_length = 16;
        this.step = 0;

        this.sampleMap = {};

        var audio_context = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new audio_context();

        this.masterVolume = this.audioContext.createGain();
        this.masterVolume.gain.value = 0.5;
        this.masterVolume.connect(this.audioContext.destination);

        this.oldTime = this.audioContext.currentTime;

        this.bpm = 85;
        this.beats_per_bar = 4;

        this.tracks = [];

        this.masterVol = new GUIDial(1500,100,40);
        this.masterVol.value = 0.5;

        this.masterTempo = new GUIDial(1500,220,40,400);
        this.masterTempo.value = 0.5;

        this.mode = "pause";

        this.playButton = new GUIButtonText(new Rect(1400,400,150,50), "PLAY", function (button)
        {
            if(drummachineInst.mode == "play")
            {
                drummachineInst.mode = "pause";
                button.label = "PLAY";
            }
            else
            {
                if(drummachineInst.mode == "pause")
                {
                    drummachineInst.mode = "play";
                    button.label = "PAUSE";
                }
            }

            if(drummachineInst.mode == "stop")
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
            for (var i = 0; i < drummachineInst.tracks.length; i++)
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

        var seq_length = 16;
        var step = 0;

        var samples =  [
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

        for(var i=0;i<samples.length;i++)
        {
            this.loadSample(samples[i][0],samples[i][1], function (buffer,name)
            {
                drummachineInst.sampleMap[name] =  buffer;
            });
        }

        GAZCanvas.referenceScreenSize = new Size(1600,900);

        var itemBGCol = "#aaaaaa";
        var itemDarkBGCol = "#777777";
        var itemSelectCol = "#ffff00";

        var cellSize = new Size(60,60);

        var samples = ["CLAP", "CLAVES", "CLOSED HAT","HAT", "CRASH", "RIDE","FX","SHAKER","TOM","SNARE","KICK 2","KICK 1"];

        for(var i=0;i<samples.length;i++)
        {
            this.tracks.push(new Sequencer(seq_length, new Vector2(100, 20+(i*(cellSize.h+2))), cellSize, samples[i]));
        }
    }

    update()
    {
        GAZCanvas.Rect( new Rect(0,0,1600,900), '#555555');

        {
            this.masterVol.update();
            this.masterVolume.value = this.masterVol.value;

            var pos = this.masterVol.centre.clone();
            pos.y += this.masterVol.radius * 1.5;

            GAZCanvas.Text(22, "Vol:" + this.masterVolume.value.toFixed(2), pos, '#000000', 'center',this.textStyle);
        }

        {
            this.masterTempo.update();

            this.bpm = 30 + (150 * this.masterTempo.value);

            var pos = this.masterTempo.centre.clone();
            pos.y += this.masterTempo.radius * 1.5;

            GAZCanvas.Text(22, "Tempo:" + this.bpm.toFixed(0), pos, '#000000', 'center',this.textStyle);
        }

        GAZCanvas.Rect(new Rect(345,20,3,742),"#ffffff");
        GAZCanvas.Rect(new Rect(594,20,3,742),"#ffffff");
        GAZCanvas.Rect(new Rect(842,20,3,742),"#ffffff");

        this.playButton.update();
        this.stopButton.update();
        this.clearButton.update();

        for(var i=0;i< this.tracks.length;i++)
        {
            this.tracks[i].update();
        }

        if(this.mode == "play")
        {
            var now = this.audioContext.currentTime;
            var gap = now - this.oldTime;

            if (gap > (60 / (this.bpm * this.beats_per_bar)))
            {
                this.oldTime += gap;

                for (var i = 0; i < this.tracks.length; i++)
                {
                    this.tracks[i].play(this.step, now);
                }

                this.step = (this.step + 1) % this.seq_length;
            }
        }

        if(this.mode=="pause")
        {
            this.oldTime = this.audioContext.currentTime;
        }

        if(this.mode=="stop")
        {
            this.step = 0;
            for (var i = 0; i < this.tracks.length; i++)
            {
                this.tracks[i].currentStep = this.step;
            }

            this.oldTime = this.audioContext.currentTime;
        }
    }
    

    draw()
    {
        //GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');
    
    }

    loadSample(url, name, callback)
    {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function()
        {
            var audioData = request.response;
            drummachineInst.audioContext.decodeAudioData(audioData, function(buffer)
            {
                callback(buffer,name);
            });
        };
        request.send();
    }

    Run()
    {
        drummachineInst.oneTimeInit();
        setInterval(function()
        {
            GAZCanvas.update();
            
            Input.update();
    
            var letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
            
            drummachineInst.update();
            drummachineInst.draw();
    
            GAZCanvas.drawLetterbox(letterboxColour);
        },17);
    }
}

drummachineInst = new Drummachine();