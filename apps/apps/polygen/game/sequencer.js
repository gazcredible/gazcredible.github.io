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
        this.maxSeqLength = step;
        this.currentSequenceLength = this.maxSeqLength;
        this.steps = [];
        this.buttons = [];

        for (let i = 0; i < this.currentSequenceLength; i++)
        {
            this.steps.push(0);
            this.buttons.push(new GUIButton(new Rect(20+(2*size.h)+ startpos.x + ((size.w + 2) * i), startpos.y, size.w, size.h)));
        }

        this.name = name;
        this.amp = drummachineInst.audioContext.createGain();
        this.amp.connect(drummachineInst.masterVolume);


        this.volume = new GUIDial(startpos.x + (size.h/2), startpos.y + (size.h / 2), (size.h / 2));
        this.volume.value = 1;

        this.seqLength = new GUIDial(10+startpos.x + (3*size.h/2), startpos.y + (size.h / 2), (size.h / 2));
        this.seqLength.value = 1;


        this.textPos = new Vector2();
        this.textPos.x = 150+ startpos.x + ((size.w + 2) * (step)) + size.w / 4;
        this.textPos.y = startpos.y + (size.h / 2) + 32 / 4;
    }

    onStep(time)
    {
        this.currentStep = (this.currentStep + 1) % this.currentSequenceLength;

        if (this.steps[this.currentStep] === 1)
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
        this.volume.text = Math.floor(this.volume.value*100).toString()+"%";
        this.volume.update();
        this.amp.gain.value = this.volume.value * drummachineInst.masterVolume.value;

        this.currentSequenceLength = Math.floor(this.maxSeqLength *this.seqLength.value);

        if(this.currentSequenceLength < 1)
        {
            this.currentSequenceLength = 1;
        }

        this.seqLength.text = this.currentSequenceLength.toString();
        this.seqLength.update()


        if(this.currentStep >= this.currentSequenceLength)
        {
            this.currentStep = 0;
        }

        GAZCanvas.Text(32, this.name, this.textPos, "#000000", 'left',drummachineInst.textStyle);

        for (let i = 0; i < this.buttons.length; i++)
        {
            let col = '#000000';

            if( i >= this.currentSequenceLength)
            {
                col = '#3f3f3f';
            }
            else
            {
                if (this.currentStep === i)
                {
                    col = "#ffffff";

                    if (this.steps[i] === 1)
                    {
                        col = '#f9f973';
                    }
                }
                else
                {
                    if (this.buttons[i].rect.isInMe(Input.mouseLogicalPos) === true)
                    {
                        if (this.steps[i] === 1)
                        {
                            col = "#00ff00";
                        }
                        else
                        {
                            col = "#007f00";
                        }
                    }
                    else
                    {
                        if (this.steps[i] === 1)
                        {
                            col = "#ffff00";
                        }
                        else
                        {
                            col = drummachineInst.itemBGCol;
                        }
                    }
                }
            }
            GAZCanvas.Rect(this.buttons[i].rect,col);
    
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