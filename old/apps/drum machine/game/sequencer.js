/*
    Sequencer - one track step sequencer
    
    This class is the core of the drum machine. drummachineInst contains a list of sequencers, each seqeuncer is responsible
    for managing its own playback of allotted sample.
    
    The sequencer is implemented as an array of logical steps, each with a physical GUIButton that handles user input.
    When a GUIButton is pressed, the corresponding steps entry has its state flipped
    
    Each sequencer has its own volume (gain) control so that its volume can be attenuated relative to the other sequencers
    This is attached to the master volume giving more volume contol to the user.
    
    The update() is responsible for updating the sequencer state and drawing the buttons
 */
class Sequencer
{
    constructor(step, startpos, size, name)
    {
        this.currentStep = 0;
        this.steps = [];

        for (let i = 0; i < step; i++)
        {
            this.steps.push(0);
        }

        this.buttons = [];

        for (let i = 0; i < step; i++) {
            this.buttons.push(new GUIButton(new Rect(startpos.x + ((size.w + 2) * i), startpos.y, size.w, size.h)));
        }

        this.name = name;
        this.amp = drummachineInst.audioContext.createGain();
        this.amp.connect(drummachineInst.masterVolume);


        this.volume = new GUIDial(startpos.x + (size.h / 2) - size.w, startpos.y + (size.h / 2), (size.h / 2));
        this.volume.value = 1;

        this.textPos = new Vector2();
        this.textPos.x = startpos.x + ((size.w + 2) * (step)) + size.w / 4;
        this.textPos.y = startpos.y + (size.h / 2) + 32 / 4;
    }

    play(step, time)
    {
        this.currentStep = step;

        if (this.steps[step] === 1)
        {
            let player = drummachineInst.audioContext.createBufferSource();
            player.buffer = drummachineInst.sampleMap[this.name];
            player.loop = false;
            player.connect(this.amp);
            player.start(time);
        }
    }

    clear()
    {
        for (let i = 0; i < this.steps.length; i++)
        {
            this.steps[i] = 0;
        }
    }

    update()
    {
        this.volume.update();
        this.amp.gain.value = this.volume.value * drummachineInst.masterVolume.value;

        GAZCanvas.Text(32, this.name, this.textPos, "#000000", 'left',drummachineInst.textStyle);

        for (let i = 0; i < this.buttons.length; i++)
        {
            if (this.currentStep === i)
            {
                GAZCanvas.Rect(this.buttons[i].rect, "#ffffff");
            }
            else
            {
                if (this.buttons[i].rect.isInMe(Input.mouseLogicalPos) === true)
                {
                    if (this.steps[i] === 1)
                    {
                        GAZCanvas.Rect(this.buttons[i].rect, "#00ff00");
                    }
                    else
                    {
                        GAZCanvas.Rect(this.buttons[i].rect, "#007f00");
                    }
                }
                else
                {
                    if (this.steps[i] === 1)
                    {
                        GAZCanvas.Rect(this.buttons[i].rect, "#ffff00");
                    }
                    else
                    {
                        GAZCanvas.Rect(this.buttons[i].rect, drummachineInst.itemBGCol);
                    }
                }
            }
    
            if (this.buttons[i].rect.isInMe(Input.mouseLogicalPos) === true)
            {
                if (Input.currentMouseState === INPUT_PRESSED)
                {
                    if (this.steps[i] === 1)
                    {
                        this.steps[i] = 0;
                    }
                    else
                    {
                        this.steps[i] = 1;
                    }
                }
            }
        }
    }
}