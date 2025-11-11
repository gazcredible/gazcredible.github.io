/*
    NoteLookup - support for octave class
 */
export class NoteLookup
{
    lowerNote;
        lowerName;
        lowerAltNote;

        upperNote ;
        upperName ;
        upperAltNote;

    constructor(lowerNote :any, lowerName:any,lowerAltNote:any, upperNote:any, upperName:any, upperAltNote:any)
    {
        this.lowerNote = lowerNote;
        this.lowerName = lowerName;
        this.lowerAltNote = lowerAltNote;
        
        this.upperNote = upperNote;
        this.upperName = upperName;
        this.upperAltNote = upperAltNote;
    }
}

/*
    Octave -    class to support building valid sequences (with appropriate note names)
                sharps and flats are chosen depending on scale specifics
 */
export class Octave
{
    notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
    sharpFlats = ["C#/Db", "D#/Eb", "F#/Gb", "G#/Ab", "A#/Bb"];
    sharpLookup :{[id:string] : NoteLookup} = {};
    sharpReverseLookup:{[id:string] : string} = {};

    constructor()
    {
        this.notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
    
        this.sharpFlats = ["C#/Db", "D#/Eb", "F#/Gb", "G#/Ab", "A#/Bb"];

        this.sharpLookup ={};
        this.sharpLookup["C#/Db"] = new NoteLookup("C", "C#", "Cb", "D", "Db", "D#");
        this.sharpLookup["D#/Eb"] = new NoteLookup("D", "D#", "Db", "E", "Eb", "E#");
        this.sharpLookup["F#/Gb"] = new NoteLookup("F", "F#", "Fb", "G", "Gb", "G#");
        this.sharpLookup["G#/Ab"] = new NoteLookup("G", "G#", "Gb", "A", "Ab", "A#");
        this.sharpLookup["A#/Bb"] = new NoteLookup("A", "A#", "Ab", "B", "Bb", "B#");

        this.sharpReverseLookup["C#"] = "C#/Db";
        this.sharpReverseLookup["D#"] = "D#/Eb";
        this.sharpReverseLookup["F#"] = "F#/Gb";
        this.sharpReverseLookup["G#"] = "G#/Ab";
        this.sharpReverseLookup["A#"] = "A#/Bb";
    
        this.sharpReverseLookup["Db"] = "C#/Db";
        this.sharpReverseLookup["Eb"] = "D#/Eb";
        this.sharpReverseLookup["Gb"] = "F#/Gb";
        this.sharpReverseLookup["Ab"] = "G#/Ab";
        this.sharpReverseLookup["Bb"] = "A#/Bb";
    }
    
    isUnresolvedSharpOrFlat(note :any)
    {
        return this.sharpLookup[note] !== null;
    }
    
    isResolvedSharpOrFlat(note :any)
    {
        return this.sharpReverseLookup[note] !== null;
    }
    
    
    isSharpFlat(note :any)
    {
        return this.sharpReverseLookup[note] !== undefined;
    }
    
    isSharp(note :any)
    {
        return note.indexOf('#') !== -1;
    }
    
    isFlat(note :any)
    {
        return note.indexOf('b') !== -1;
    }
    
    noteToSharpFlat(note :any)
    {
        return this.sharpReverseLookup[note];
    }
    
    nextNote(currentNote :any, step :any)
    {
        let offset = this.noteOffset(currentNote);
        
        offset += this.stepAsOffset(step);
        
        offset %= this.notes.length;
        
        return this.notes[offset];
    }
    
    stepAsOffset(step :any)
    {
        if((step === "W") || (step === "2"))
        {
            return 2;
        }
        
        if(step === "5")
        {
            return 5;
        }
        
        if(step === "4")
        {
            return 4;
        }
        
        if(step === "3")
        {
            return 3;
        }
        
        return 1;
    }
    
    noteOffset(note :any)
    {
        let actualNote = this.sharpReverseLookup[note];
        
        if(actualNote !== undefined)
        {
            note = actualNote;
        }
        
        for(let i=0;i<this.notes.length;i++)
        {
            if(note === this.notes[i])
            {
                return i;
            }
        }
        
        return -1;
    }
    
    isSharpOrFlat(note :any)
    {
        for(let i=0;i<this.sharpFlats.length;i++)
        {
            if(this.sharpFlats[i] === note)
            {
                return true;
            }
        }
        
        return false;
    }
}



let referenceOctave = new Octave();

/*
    MusicalString - a chromatic scale based on a guitar string starting at a given note and octave
 */
export class MusicalString
{
    root:any;
    octave:any;

    constructor(rootNote :any, octave :any)
    {
        this.root = rootNote;
        this.octave = octave;
    }
    getNotesWithOctave(scale:any, fretLength?:any)
    {
        let list:any[] = [];
        
        let currentNote = this.root;
        let currentOctave = this.octave;
        
        this.addNoteAndOctave(scale, list, currentNote,currentOctave);
        
        for(let i = 0; i < fretLength;i++)
        {
            currentNote = referenceOctave.nextNote(currentNote,"H");
            
            if(currentNote === "C")
            {
                currentOctave++;
            }
            
            this.addNoteAndOctave(scale, list, currentNote,currentOctave);
        }
        return list;
    }
    
    getNoteFromPosition(index:any)
    {
        if(index === 0)
        {
            return this.root;
        }
        
        let currentNote = this.root;
        
        for(let i = 0; i < index;i++)
        {
            currentNote = referenceOctave.nextNote(currentNote,"H");
        }
        
        return currentNote;
    }
    
    
    getNotes(scale:any, fretLength:any)
    {
        let list:any = [];
        
        let currentNote = this.root;
        
        this.addNote(scale, list, currentNote);
        
        for(let i = 0; i < fretLength;i++)
        {
            currentNote = referenceOctave.nextNote(currentNote,"H");
            this.addNote(scale, list, currentNote);
        }
        return list;
    }
    
    getScalePositions(scale:any, fretLength:any)
    {
        let list = [];
        
        let currentNote = this.root;
        
        for(let i = 0; i < fretLength;i++)
        {
            list[i] = scale.getNoteAsStep(currentNote);
            currentNote = referenceOctave.nextNote(currentNote,"H");
        }
        return list;
    }
    
    getScaleWithOctave(scale:any, fretLength:any)
    {
        let list = [];
        
        let currentNote = this.root;
        let currentOctave = this.octave;
        
        for(let i = 0; i < fretLength;i++)
        {
            let scaleIndex = scale.getNoteAsStep(currentNote);
            
            if(scale.containsNote(currentNote) === true)
            {
                list[i] = currentOctave +":"+ scaleIndex;
            }
            else
            {
                list[i] = " ";
            }
            
            currentNote = referenceOctave.nextNote(currentNote,"H");
            
            if(currentNote === scale[0])
            {
                currentOctave++;
            }
        }
        return list;
    }
    

    
    
    
    addNote(scale:any, str:[any], note:any)
    {
        let noteToPrint = note;
        
        if(scale.containsNote(note) === false)
        {
            str.push(" ");
        }
        else
        {
            str.push(scale.getActualNote(note) );
        }
    }
    
    addNoteAndOctave(scale:any, str:any[], note:any, octave:any)
    {
        if(scale.containsNote(note) === false)
        {
            str.push(" ");
        }
        else
        {
            str.push(scale.getActualNote(note)+octave );
        }
    }
}

/*
    KeyScale - a scale in a given key, based on a scale definition and a root note
 */
export class KeyScale
{
    notes:any;
    actualScale:any;

    constructor(scale:any, notes:any)
    {
        this.notes = notes;
        this.actualScale = [];
        
        if(scale.isBlues === true)
        {
            for (let i = 0; i < this.notes.length; i++)
            {
                if ((this.actualScale.length > 0) && (referenceOctave.isSharpOrFlat(this.notes[i]) === true))
                {
                    let noteOptions = referenceOctave.sharpLookup[this.notes[i]];
                    
                    if (((referenceOctave.isFlat(this.notes[0]) === false) && (referenceOctave.isSharp(this.notes[0])=== false))
                        || (referenceOctave.isFlat(this.notes[0]) === true)
                    ) {
                        if (noteOptions.upperNote === this.notes[0])
                        {
                            this.actualScale.push(noteOptions.lowerName);
                        }
                        else
                        {
                            //this is the flat note
                            this.actualScale.push(noteOptions.upperName);
                        }
                    }
                    else
                    {
                        //this is the sharp
                        let note = noteOptions.lowerName;
                        this.actualScale.push(note);
                    }
                }
                else
                {
                    this.actualScale.push(this.notes[i]);
                }
            }
        }
        else
        {
            for(let i=0;i<this.notes.length;i++)
            {
                this.actualScale.push(this.notes[i]);
            }
        }
    }

    isScaleRoot(note:any)
    {
        return this.notes[0] === note;
    }
    
    containsNote(note:any)
    {
        if(referenceOctave.isSharpOrFlat(note) === true)
        {
            if((referenceOctave.isSharp(this.notes[0])===true)  || (referenceOctave.isFlat(this.notes[0])===true))
            {
                let altName = referenceOctave.noteToSharpFlat(this.notes[0]);
                
                if(altName === note)
                {
                    return true;
                }
            }
        }
        
        for(let i=0;i<this.notes.length;i++)
        {
            if(this.notes[i] === note)
            {
                return true;
            }
        }
        return false;
    }
    
    toString()
    {
        return this.actualScale;
    }
    
    getActualNote(note:any)
    {
        if(referenceOctave.isSharpFlat(this.notes[0]) === true)
        {
            let altName = referenceOctave.noteToSharpFlat(this.notes[0]);
            
            if(altName === note)
            {
                return this.actualScale[0];
            }
        }
        
        for(let i=0;i< this.notes.length;i++)
        {
            if(this.notes[i] === note)
            {
                return this.actualScale[i];
            }
        }
        
        return "ERROR";
    }
    
    getNoteAsStep(note:any)
    {
        for(let i=0;i<this.notes.length;i++)
        {
            if(note === this.notes[i])
            {
                let result = (i+1);
                
                if(result === 8)
                {
                    result = 1;
                }
                
                return result;
            }
        }
        
        return " ";
    }
}

/*
    ScaleDefinition - definition of a scale
    
    Will build a KeyScale from a sequence of steps & half-steps (WWHWWWH etc) using a set of validNotes (chromatic scalse)
 */
export class ScaleDefinition
{
    label :any;
    step :any;
    validNotes :any;
    isBlues:any;

    constructor(label:any, stepSequence:any, validNotes:any, isBlues=false)
    {
        this.label = label;
        this.step = stepSequence;
        this.validNotes = validNotes;
        this.isBlues = isBlues;
    }

    toString()
    {
        return this.label;
    }
    
    getScale(root:any)
    {
        
        let scale = [];
        
        scale.push(root);
        let currentNote = root;
        
        for(let i=0;i<this.step.length;i++)
        {
            let cmd = this.step.charAt(i);
            
            currentNote = referenceOctave.nextNote(currentNote, cmd);
            
            scale.push(currentNote);
        }
        
        
        return new KeyScale(this,scale);
    }
    
    hasKey(key:any)
    {
        let index = this.validNotes.indexOf(key);

        return index > -1;
    }
}


