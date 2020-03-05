class Sequencer
{
    constructor(step, startpos, size, name)
    {
        this.stepCount = step;
        this.currentStep = 0;
        this.steps = [];

        for (var i = 0; i < step; i++)
        {
            this.steps.push(0);
        }

        this.buttons = [];

        for (var i = 0; i < step; i++) {
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

        if (this.steps[step] == 1)
        {
            var player = drummachineInst.audioContext.createBufferSource();
            player.buffer = drummachineInst.sampleMap[this.name];
            player.loop = false;
            player.connect(this.amp);
            player.start(time);
        }
    }

    clear() {
        for (var i = 0; i < this.steps.length; i++)
        {
            this.steps[i] = 0;
        }
    }

    update()
    {
        this.volume.update();
        this.amp.gain.value = this.volume.value * drummachineInst.masterVolume.value;

        GAZCanvas.Text(32, this.name, this.textPos, "#000000", 'left',drummachineInst.textStyle);

        for (var i = 0; i < this.buttons.length; i++)
        {
            if (this.currentStep == i)
            {
                GAZCanvas.Rect(this.buttons[i].rect, "#ffffff");
            }
            else
            {
                if (this.buttons[i].rect.isInMe(Input.mouseLogicalPos) === true)
                {
                    if (this.steps[i] == 1)
                    {
                        GAZCanvas.Rect(this.buttons[i].rect, "#00ff00");
                    }
                    else
                    {
                        GAZCanvas.Rect(this.buttons[i].rect, "#007f00");
                    }
    
                    if (Input.currentMouseState == INPUT_PRESSED)
                    {
                        if (this.steps[i] == 1)
                        {
                            this.steps[i] = 0;
                        }
                        else
                        {
                            this.steps[i] = 1;
                        }
                    }
                }
                else
                {
                    if (this.steps[i] == 1)
                    {
                        GAZCanvas.Rect(this.buttons[i].rect, "#ffff00");
                    }
                    else
                    {
                        GAZCanvas.Rect(this.buttons[i].rect, drummachineInst.itemBGCol);
                    }
                }
            }
        }
    }
}