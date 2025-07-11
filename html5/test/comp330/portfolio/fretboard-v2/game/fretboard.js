/*
    Fretboard - main app class for the fretboard app
 */
class Fretboard
{
    constructor()
    {
        //my guitar as a list of strings
        this.strings = [];
        
        //keybuttons - these are the buttons for each note that scales can be created from
        this.keyButtons = [];
        
        //modebuttons - each mode is a different musical mode (major, minor, pentatonic etc)
        this.modeButtons = [];
        
        //image to store guitar gfx
        this.image = new Image();
    }
    
    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1600,900);
    
        //add musical strings with base note and octave
        this.strings.push( new MusicalString("E",2));
        this.strings.push( new MusicalString("A",2));
        this.strings.push( new MusicalString("D",3));
        this.strings.push( new MusicalString("G",3));
        this.strings.push( new MusicalString("B",3));
        this.strings.push( new MusicalString("E",4));
    
        //add a set of keybuttons - these are the buttons for each note that scales can be created from
        this.keyButtons.push( new KeyButton("C", new Rect(100,70,100,50)));
        this.keyButtons.push( new KeyButton("D", new Rect(210,70,100,50)));
        this.keyButtons.push( new KeyButton("E", new Rect(320,70,100,50)));
        this.keyButtons.push( new KeyButton("F", new Rect(430,70,100,50)));
        this.keyButtons.push( new KeyButton("G", new Rect(540,70,100,50)));
        this.keyButtons.push( new KeyButton("A", new Rect(650,70,100,50)));
        this.keyButtons.push( new KeyButton("B", new Rect(760,70,100,50)));
    
        this.keyButtons.push( new KeyButton("C#", new Rect(160,10,40,50)));
        this.keyButtons.push( new KeyButton("Db", new Rect(210,10,40,50)));
        this.keyButtons.push( new KeyButton("D#", new Rect(270,10,40,50)));
        this.keyButtons.push( new KeyButton("Eb", new Rect(320,10,40,50)));
    
        this.keyButtons.push( new KeyButton("F#", new Rect(490,10,40,50)));
        this.keyButtons.push( new KeyButton("Gb", new Rect(540,10,40,50)));
    
        this.keyButtons.push( new KeyButton("G#", new Rect(600,10,40,50)));
        this.keyButtons.push( new KeyButton("Ab", new Rect(650,10,40,50)));
    
        this.keyButtons.push( new KeyButton("A#", new Rect(710,10,40,50)));
        this.keyButtons.push( new KeyButton("Bb", new Rect(760,10,40,50)));
    
        //add all the modebuttons - each mode is a different musical mode (major, minor, pentatonic etc)
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Pent.", "WW3W", ["C", "G", "D", "A", "E", "B", "F#", "C#", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"]), new Rect(1470,10,120,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Pentmin", "3WW3", 	["C", "F", "Bb", "Eb", "Ab","A", "E", "B", "F#", "C#", "G#", "D#", "A#", "D", "G"]) , new Rect(1470,70,120,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Blues", "32113", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1470,130,120,50) ) );
    
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Chrom", "11111111111", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1470,370,120,50) ) );
    
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Ionian", "WWHWWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,10,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Minor", "WHWWHWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,10,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Harmonic", "WHWWH3H", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,10,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Dorian", "WHWWWHW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,70,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Minor", "HWWHWWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,70,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Harmonic", "HWWHW3H", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,70,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Phrygian", "HWWWHWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,130,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Minor", "WWHWWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,130,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Lydian", "WWWHWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,190,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Minor", "WHWWWHW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,190,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Harmonic", "WHWWWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,190,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Mixolydian", "WWHWWHW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,250,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Minor", "HWWWHWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,250,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Harmonic", "HWWWH3H", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,250,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Aeolian", "WHWWHWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,310,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Minor", "WWWHWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,310,150,50) ) );
    
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Locrian", "HWWHWWW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(990,370,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Minor", "WWHWWHW", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1150,370,150,50) ) );
        this.modeButtons.push( new ModeButton(new ScaleDefinition("Harmonic", "WWHWWWH", 	["C", "C#", "Db","D","D#", "Eb","E","F","F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb","B", "Cb"],true ) , new Rect(1310,370,150,50) ) );
    
    
        //initialise the mode to match whatever mode button is selected
        let newItemID = 0;
        this.modeButtons[newItemID].selected = true;
        this.mode =this.modeButtons[newItemID].mode;
    
        //set up the currenttonic to match whatever key button is selected
        newItemID = 0;
        this.keyButtons[newItemID].selected = true;
        this.currentTonic =this.keyButtons[newItemID].labelText;
    
        this.currentScale  = this.mode.getScale(this.currentTonic);
    
        {
            //set up the display buttons - these define how the notes on the fretboard will be displayed (notes, octaves and/or steps in a scale)
            this.displayButtons = [];
            this.displayButtons.push(new KeyButton("Normal", new Rect(10, 140, 200, 50)));
            this.displayButtons.push(new KeyButton("Normal+Octave", new Rect(220, 140, 200, 50)));
            this.displayButtons.push(new KeyButton("ScaleDefinition", new Rect(10, 200, 200, 50)));
            this.displayButtons.push(new KeyButton("ScaleDefinition+Octave", new Rect(220, 200, 200, 50)));
        
            this.displayID = 0;
            this.displayButtons[this.displayID].selected = true;
        }
    
        //load the guitar neck gfx
        this.image.src = "assets/bg.png";
    }
    
    update()
    {
        //update displayButtons (normal-scale etc)
        {
            let newItemID = -1;
            for(let i=0;i< this.displayButtons.length;i++)
            {
                if(this.displayButtons[i].active === true)
                {
                    this.displayButtons[i].update();
                
                    if (Input.currentMouseState === INPUT_PRESSED)
                    {
                        if (this.displayButtons[i].isInRect(Input.mouseLogicalPos) === true)
                        {
                            newItemID = i;
                        }
                    }
                }
            }
        
            if(newItemID !== -1)
            {
                this.displayID = newItemID;
            
                for(let i=0;i< this.displayButtons.length;i++)
                {
                    this.displayButtons[i].selected = false;
                }
            
                this.displayButtons[newItemID].selected = true;
            }
        }
    
        //update keybuttons (notes)
        {
            let newItemID = -1;
            for (let i = 0; i < this.keyButtons.length; i++)
            {
                this.keyButtons[i].active = this.mode.hasKey(this.keyButtons[i].labelText);
            
                if (this.keyButtons[i].active === true)
                {
                    this.keyButtons[i].update();
                
                    if (Input.currentMouseState === INPUT_PRESSED)
                    {
                        if (this.keyButtons[i].isInRect(Input.mouseLogicalPos) === true)
                        {
                            this.currentTonic = this.keyButtons[i].labelText;
                            newItemID = i;
                        }
                    }
                }
            }
        
            if (newItemID !== -1)
            {
                for (let i = 0; i < this.keyButtons.length; i++)
                {
                    this.keyButtons[i].selected = false;
                }
            
                this.keyButtons[newItemID].selected = true;
                this.currentTonic = this.keyButtons[newItemID].labelText;
            }
        }
    
        //update the mode buttons
        {
            let newItemID = -1;
            for (let i = 0; i < this.modeButtons.length; i++)
            {
                this.modeButtons[i].update();
            
                if (Input.currentMouseState === INPUT_PRESSED)
                {
                    if (this.modeButtons[i].isInRect(Input.mouseLogicalPos) === true)
                    {
                        this.mode = this.modeButtons[i].mode;
                    
                        newItemID = i;
                    }
                }
            }
        
            if (newItemID !== -1)
            {
                for (let i = 0; i < this.modeButtons.length; i++)
                {
                    this.modeButtons[i].selected = false;
                }
            
                this.modeButtons[newItemID].selected = true;
                this.mode = this.modeButtons[newItemID].mode;
            
                //does the new mode support the active key?
            
                if (this.mode.hasKey(this.currentTonic) === false)
                {
                    this.currentTonic = this.mode.validNotes[0];
                
                    for (let i = 0; i < this.keyButtons.length; i++)
                    {
                        this.keyButtons[i].selected = (this.keyButtons[i].labelText === this.currentTonic);
                    }
                }
            }
        }
    
        //update the selected scale based on whatever the currenttonic (selected note) is
        this.currentScale  = this.mode.getScale(this.currentTonic);
    }
    
    draw()
    {
        GAZCanvas.Rect( new Rect(0,0,1600,900), 'rgb(255,0,0)');
        
        GAZCanvas.Text(48,this.mode.toString() + " ScaleDefinition Notes", new Vector2(30,320),"#ffffff",'left','Noto Sans','Bold');
        GAZCanvas.Text(48,this.currentScale.toString(), new Vector2(30,370),"#ffffff",'left','Noto Sans','Bold');
    
        let fretlength = 14;
        let yspace = 66;
        let fontSize = 36;
        let yStart = 520;
        let xStart = 0;
        
        /*
            I got the guitar gfx from the interweb and needed to work out all the offsets for the white boxes so I
            could draw the note text in the correct locations. As it's based on a real guitar, the size of each fret
            isn't constant :(.
         */
        let xoffsets = [24,98,231,352,469, 585, 696,799,899,998,1099,1195,1293,1384,1468];
        let yoffsets = [4,58,112,166,219,272];
        let zeroYOffsets =[10,5,2,-2,-5,-10];
        
        GAZCanvas.Sprite(this.image,new Rect(0,500, 1600,400));
        
        /*
            go through each string and draw in the valid notes
            As luck would have it, I set the strings up to go from fattest (E2) to thinnest (E4). The fretboard diagram
            draws them the other way round (E4 to E2), so I reverse the order of the strings with the 5-i lookup
         */
        for(let i=0;i<this.strings.length;i++)
        {
            let currentString ="";
        
            switch(this.displayID)
            {
                case 0: // normal
                    currentString = this.strings[5 - i].getNotes(this.currentScale, fretlength);
                    break;
            
                case 1:
                    currentString = this.strings[5 - i].getNotesWithOctave(this.currentScale, fretlength);
                    fontSize = 24;
                    break;
            
                case 2:
                    currentString = this.strings[5 - i].getScalePositions(this.currentScale, fretlength);
                    break;
            
                case 3:
                    currentString = this.strings[5 - i].getScaleWithOctave(this.currentScale, fretlength);
                    fontSize = 24;
                    break;
            }
            let pos = new Vector2();
            
            if(currentString.length > 0)
            {
                //draw all the valid notes on the string
                for (let fret = 0; fret < currentString.length; fret++)
                {
                    pos.x = xStart + xoffsets[fret]+(44/2);
                    pos.y = yStart + yoffsets[i]+5;
                    
                    if(fret === 0)
                    {
                        //The first note of each string goes in a different Y box compared with the other notes
                        //This code deals with that
                        pos.x -=7;
                        
                        pos.y += zeroYOffsets[i];
                    }
                    
                    let col = "#000000";
                    if( this.currentScale.isScaleRoot(this.strings[5 - i].getNoteFromPosition(fret)) === true)
                    {
                        //if the current note is the root note, draw it in read
                        col = "#ff0000";
                    }
                    if(currentString[fret] !== ' ')
                    {
                        //only draw the frets that aren't empty
                        GAZCanvas.Text(fontSize, currentString[fret], pos, col, 'center', 'Noto Sans', "Bold");
                    }
                }
            }
        }
        
        //draw all the buttons
        for(let i=0;i< this.displayButtons.length;i++)
        {
            this.displayButtons[i].draw();
        }
    
    
        for(let i=0; i< this.keyButtons.length; i++)
        {
            this.keyButtons[i].draw();
        }
    
        for(let i=0;i< this.modeButtons.length;i++)
        {
            this.modeButtons[i].draw();
        }
    
        //draw the mouse pointer so I can see what's going on, if the mouse is in the GAZCanvas space
        //the mouse pos will be undefined if it's out of the GAZCanvas
        if(Input.mouseLogicalPos !== undefined)
        {
            let modelRect = new Rect();
            modelRect.set(Input.mouseLogicalPos.x,Input.mouseLogicalPos.y,10,10);
    
            GAZCanvas.Rect(modelRect,'rgb(0,0,255');
        }
    }
    
    //Launch point for application
    Run()
    {
        fretbaordInst.oneTimeInit();
        setInterval(function()
        {
            GAZCanvas.update();
            
            Input.update();
            
            let letterboxColour = 'rgb(32,32,32)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);
    
            fretbaordInst.update();
            fretbaordInst.draw();
            
            GAZCanvas.drawLetterbox(letterboxColour);
    
            var rect = new Rect(0,10,140,50);
            GAZCanvas.Rect(rect, 'rgb(127,127,32)');
            GAZCanvas.Text(16, 'Click Here To Quit',new Vector2(rect.x+5,rect.y+30),'#ffffff','left');
    
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

fretbaordInst = new Fretboard();
