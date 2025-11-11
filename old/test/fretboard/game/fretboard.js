class Fretboard
{
    constructor()
    {
        this.strings = [];
    
        this.strings.push( new MusicalString("E",2));
    
        this.strings.push( new MusicalString("A",2));
        this.strings.push( new MusicalString("D",3));
        this.strings.push( new MusicalString("G",3));
        this.strings.push( new MusicalString("B",3));
        this.strings.push( new MusicalString("E",4));
    
        this.buttons = [];
    
        this.buttons.push( new KeyButton("C", new Rect(100,70,100,50)));
        this.buttons.push( new KeyButton("D", new Rect(210,70,100,50)));
        this.buttons.push( new KeyButton("E", new Rect(320,70,100,50)));
        this.buttons.push( new KeyButton("F", new Rect(430,70,100,50)));
        this.buttons.push( new KeyButton("G", new Rect(540,70,100,50)));
        this.buttons.push( new KeyButton("A", new Rect(650,70,100,50)));
        this.buttons.push( new KeyButton("B", new Rect(760,70,100,50)));
    
        this.buttons.push( new KeyButton("C#", new Rect(160,10,40,50)));
        this.buttons.push( new KeyButton("Db", new Rect(210,10,40,50)));
        this.buttons.push( new KeyButton("D#", new Rect(270,10,40,50)));
        this.buttons.push( new KeyButton("Eb", new Rect(320,10,40,50)));
    
        this.buttons.push( new KeyButton("F#", new Rect(490,10,40,50)));
        this.buttons.push( new KeyButton("Gb", new Rect(540,10,40,50)));
    
        this.buttons.push( new KeyButton("G#", new Rect(600,10,40,50)));
        this.buttons.push( new KeyButton("Ab", new Rect(650,10,40,50)));
    
        this.buttons.push( new KeyButton("A#", new Rect(710,10,40,50)));
        this.buttons.push( new KeyButton("Bb", new Rect(760,10,40,50)));
    
        this.modeButtons = [];
    
        this.modeButtons.push( new ModeButton(new Scale("Pent.", "WW3W", ["C", "G", "D", "A", "E", "B", "F#", "C#", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"]), new Rect(1470,10,120,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Pentmin", "3WW3", 	["C", "F", "Bb", "Eb", "Ab","A", "E", "B", "F#", "C#", "G#", "D#", "A#", "D", "G"]) , new Rect(1470,70,120,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Blues", "32113", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1470,130,120,50) ) );
    
        this.modeButtons.push( new ModeButton(new Scale("Chrom", "11111111111", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1470,370,120,50) ) );
    
        this.modeButtons.push( new ModeButton(new Scale("Ionian", "WWHWWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,10,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Minor", "WHWWHWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,10,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Harmonic", "WHWWH3H", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,10,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new Scale("Dorian", "WHWWWHW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,70,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Minor", "HWWHWWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,70,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Harmonic", "HWWHW3H", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,70,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new Scale("Phrygian", "HWWWHWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,130,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Minor", "WWHWWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,130,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new Scale("Lydian", "WWWHWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,190,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Minor", "WHWWWHW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,190,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Harmonic", "WHWWWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,190,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new Scale("Mixolydian", "WWHWWHW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,250,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Minor", "HWWWHWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,250,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Harmonic", "HWWWH3H", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,250,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new Scale("Aeolian", "WHWWHWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,310,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Minor", "WWWHWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,310,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new Scale("Locrian", "HWWHWWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,370,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Minor", "WWHWWHW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,370,150,50) ) );
        this.modeButtons.push( new ModeButton(new Scale("Harmonic", "WWHWWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,370,150,50) ) );
    
    
        var newItemID = 0;
    
        this.modeButtons[newItemID].selected = true;
        this.mode =this.modeButtons[newItemID].mode;
    
        newItemID = 0;
    
        this.buttons[newItemID].selected = true;
        this.currentTonic =this.buttons[newItemID].labelText;
    
        this.currentScale  = this.mode.getScale(this.currentTonic);
        
        {
            this.displayButtons = [];
            this.displayButtons.push(new KeyButton("Normal", new Rect(10, 140, 200, 50)));
            this.displayButtons.push(new KeyButton("Normal+Octave", new Rect(220, 140, 200, 50)));
            this.displayButtons.push(new KeyButton("Scale", new Rect(10, 200, 200, 50)));
            this.displayButtons.push(new KeyButton("Scale+Octave", new Rect(220, 200, 200, 50)));
        
            this.displayID = 0;
            this.displayButtons[this.displayID].selected = true;
        }
        
        this.image = new Image();
        this.image.src = "assets/bg.png";
    }
    
    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1600,900);
    }
    
    update()
    {
        //update display buttons (normal-scale etc)
        {
            var newItemID = -1;
            for(var i=0;i< this.displayButtons.length;i++)
            {
                if(this.displayButtons[i].active == true)
                {
                    this.displayButtons[i].update();
                
                    if (Input.currentMouseState == INPUT_PRESSED)
                    {
                        if (this.displayButtons[i].isInRect(Input.mouseLogicalPos) == true)
                        {
                            newItemID = i;
                        }
                    }
                }
            }
        
            if(newItemID != -1)
            {
                this.displayID = newItemID;
            
                for(var i=0;i< this.displayButtons.length;i++)
                {
                    this.displayButtons[i].selected = false;
                }
            
                this.displayButtons[newItemID].selected = true;
            }
        }
    
    
        var newItemID = -1;
        for(var i=0;i< this.buttons.length;i++)
        {
            this.buttons[i].active = this.mode.hasKey(this.buttons[i].labelText );
        
            if(this.buttons[i].active == true)
            {
                this.buttons[i].update();
    
                if (Input.currentMouseState == INPUT_PRESSED)
                {
                    if (this.buttons[i].isInRect(Input.mouseLogicalPos) == true)
                    {
                        this.currentTonic = this.buttons[i].labelText;
                        newItemID = i;
                    }
                }
            }
        }
    
        if(newItemID != -1)
        {
            for(var i=0;i< this.buttons.length;i++)
            {
                this.buttons[i].selected = false;
            }
        
            this.buttons[newItemID].selected = true;
            this.currentTonic = this.buttons[newItemID].labelText;
        }
    
        newItemID = -1;
        for(var i=0;i< this.modeButtons.length;i++)
        {
            this.modeButtons[i].update();
    
            if (Input.currentMouseState == INPUT_PRESSED)
            {
                if(this.modeButtons[i].isInRect(Input.mouseLogicalPos) == true)
                {
                    this.mode = this.modeButtons[i].mode;
                
                    newItemID = i;
                }
            }
        }
    
        if(newItemID != -1)
        {
            for(var i=0;i< this.modeButtons.length;i++)
            {
                this.modeButtons[i].selected = false;
            }
        
            this.modeButtons[newItemID].selected = true;
            this.mode = this.modeButtons[newItemID].mode;
        
            //does the new mode support the active key?
        
            if( this.mode.hasKey(this.currentTonic) == false)
            {
                this.currentTonic = this.mode.validNotes[0];
            
                for(var i=0;i< this.buttons.length;i++)
                {
                    if(this.buttons[i].labelText == this.currentTonic)
                    {
                        this.buttons[i].selected = true;
                    }
                    else
                    {
                        this.buttons[i].selected = false;
                    }
                }
            }
        }
    
        this.currentScale  = this.mode.getScale(this.currentTonic);
    }
    
    draw()
    {
        GAZCanvas.Rect( new Rect(0,0,1600,900), 'rgb(255,0,0)');
        
        GAZCanvas.Text(48,this.mode.toString() + " Scale Notes", new Vector2(30,320),"#ffffff",'left','Noto Sans','Bold');
        GAZCanvas.Text(48,this.currentScale.toString(), new Vector2(30,370),"#ffffff",'left','Noto Sans','Bold');
    
        var fretlength = 14;
        var xspace = 60;
        var yspace = 66;
        var fontSize = 36;
        var yStart = 520;
        var xStart = 0;
        
        var xoffsets = [24,98,231,352,469, 585, 696,799,899,998,1099,1195,1293,1384,1468];
        var yoffsets = [4,58,112,166,219,272];
        var zeroYOffsets =[10,5,2,-2,-5,-10];
        
        GAZCanvas.Sprite(this.image,new Rect(0,500, 1600,400));
        
        //normal = 'Noto Sans',"Bold" 36pt + 5
        //sharp =
    
        for(var i=0;i<this.strings.length;i++)
        {
            var n ="";
        
            switch(this.displayID)
            {
                case 0: // normal
                    n = this.strings[5 - i].getNotes(this.currentScale, fretlength);
                    break;
            
                case 1:
                    n = this.strings[5 - i].getNotesWithOctave(this.currentScale, fretlength);
                    fontSize = 24;
                    break;
            
                case 2:
                    n = this.strings[5 - i].getScalePositions(this.currentScale, fretlength);
                    break;
            
                case 3:
                    n = this.strings[5 - i].getScaleWithOctave(this.currentScale, fretlength);
                    fontSize = 24;
                    break;
            }
            var pos = new Vector2();
            if(n.length > 0)
            {
                for (var ch = 0; ch < n.length; ch++)
                {
                    pos.x = xStart + xoffsets[ch]+(44/2);
                    pos.y = yStart + yoffsets[i]+5;
                    
                    if(ch == 0)
                    {
                        pos.x -=7;
                        
                        pos.y += zeroYOffsets[i];
                    }
                    
                    var col = "#000000";
                    if( this.currentScale.isScaleRoot(this.strings[5 - i].getNoteFromPosition(ch)) == true)
                    {
                        col = "#ff0000";
                    }
                    
                    GAZCanvas.Text(fontSize, n[ch], pos, col, 'center','Noto Sans',"Bold");
                }
            }
        }
        
        for(var i=0;i< this.displayButtons.length;i++)
        {
            this.displayButtons[i].draw();
        }
    
    
        for(var i=0;i< this.buttons.length;i++)
        {
            this.buttons[i].draw();
        }
    
        for(var i=0;i< this.modeButtons.length;i++)
        {
            this.modeButtons[i].draw();
        }
    
        if(Input.mouseLogicalPos != undefined)
        {
            var modelRect = new Rect();
            modelRect.set(Input.mouseLogicalPos.x,Input.mouseLogicalPos.y,10,10);
    
            GAZCanvas.Rect(modelRect,'rgb(0,0,255');
        
            var p = Input.mouseLogicalPos.clone();
            p.y -= 10;
            GAZCanvas.Text(12, Input.mouseLogicalPos.toString(), p, "#ffffff", 'left','Noto Sans');
        }
    }
    
    Run()
    {
        fretbaordInst.oneTimeInit();
        setInterval(function()
        {
            GAZCanvas.update();
            
            Input.update();
            
            var letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            fretbaordInst.update();
            fretbaordInst.draw();
            
            GAZCanvas.drawLetterbox(letterboxColour);
        },17);
    }
}

fretbaordInst = new Fretboard();
