/**
 * Created by gareth on 05/07/2018.
 */

Array.prototype.contains = function(obj)
{
    return this.indexOf(obj) > -1;
};


class NoteLookup
{
    constructor(lowerNote, lowerName,lowerAltNote, upperNote, upperName, upperAltNote)
    {
        this.lowerNote = lowerNote;
        this.lowerName = lowerName;
        this.lowerAltNote = lowerAltNote;
        
        this.upperNote = upperNote;
        this.upperName = upperName;
        this.upperAltNote = upperAltNote;
    }
}


class Octave
{
    constructor()
    {
        this.notes = new Array("C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B");
    
        this.sharpFlats = new Array("C#/Db", "D#/Eb", "F#/Gb", "G#/Ab", "A#/Bb");
    
        this.sharpLookup = [];
    
        this.sharpLookup["C#/Db"] = new NoteLookup("C", "C#", "Cb", "D", "Db", "D#");
        this.sharpLookup["D#/Eb"] = new NoteLookup("D", "D#", "Db", "E", "Eb", "E#");
        this.sharpLookup["F#/Gb"] = new NoteLookup("F", "F#", "Fb", "G", "Gb", "G#");
        this.sharpLookup["G#/Ab"] = new NoteLookup("G", "G#", "Gb", "A", "Ab", "A#");
        this.sharpLookup["A#/Bb"] = new NoteLookup("A", "A#", "Ab", "B", "Bb", "B#");
    
        this.sharpReverseLookup = [];
    
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
    
    isUnresolvedSharpOrFlat(note)
    {
        return this.sharpLookup[note] != null;
    }
    
    isResolvedSharpOrFlat(note)
    {
        return this.sharpReverseLookup[note] != null;
    }
    
    
    isSharpFlat(note)
    {
        return this.sharpReverseLookup[note] != undefined;
    }
    
    isSharp(note)
    {
        return note.indexOf('#') != -1;
    }
    
    isFlat(note)
    {
        return note.indexOf('b') != -1;
    }
    
    noteToSharpFlat(note)
    {
        return this.sharpReverseLookup[note];
    }
    
    nextNote(currentNote, step)
    {
        var offset = this.noteOffset(currentNote);
        
        offset += this.stepAsOffset(step);
        
        offset %= this.notes.length;
        
        return this.notes[offset];
        
        return "X";
    }
    
    stepAsOffset(step)
    {
        if((step == "W") || (step == "2"))
        {
            return 2;
        }
        
        if(step == "5")
        {
            return 5;
        }
        
        if(step == "4")
        {
            return 4;
        }
        
        if(step == "3")
        {
            return 3;
        }
        
        return 1;
    }
    
    noteOffset(note)
    {
        var actualNote = this.sharpReverseLookup[note];
        
        if(actualNote != undefined)
        {
            note = actualNote;
        }
        
        for(var i=0;i<this.notes.length;i++)
        {
            if(note == this.notes[i])
            {
                return i;
            }
        }
        
        return -1;
    }
    
    isSharpOrFlat(note)
    {
        for(var i=0;i<this.sharpFlats.length;i++)
        {
            if(this.sharpFlats[i] == note)
            {
                return true;
            }
        }
        
        return false;
    }
}



var referenceOctave = new Octave();

class MusicalString 
{
    constructor(rootNote, octave)
    {
        this.root = rootNote;
        this.octave = octave;
    }
    getNotesWithOctave(scale, fretLength)
    {
        var list = [];
        
        var currentNote = this.root;
        var currentOctave = this.octave;
        
        this.addNoteAndOctave(scale, list, currentNote,currentOctave);
        
        for(var i = 0; i < fretLength;i++)
        {
            currentNote = referenceOctave.nextNote(currentNote,"H");
            
            if(currentNote == "C")
            {
                currentOctave++;
            }
            
            this.addNoteAndOctave(scale, list, currentNote,currentOctave);
        }
        return list;
    }
    
    getNoteFromPosition(index)
    {
        if(index == 0)
        {
            return this.root;
        }
        
        var currentNote = this.root;
        
        for(var i = 0; i < index;i++)
        {
            currentNote = referenceOctave.nextNote(currentNote,"H");
        }
        
        return currentNote;
    }
    
    
    getNotes(scale, fretLength)
    {
        var list = [];
        
        var currentNote = this.root;
        
        this.addNote(scale, list, currentNote);
        
        for(var i = 0; i < fretLength;i++)
        {
            currentNote = referenceOctave.nextNote(currentNote,"H");
            this.addNote(scale, list, currentNote);
        }
        return list;
    }
    
    getScalePositions(scale, fretLength)
    {
        var list = [];
        
        var currentNote = this.root;
        
        for(var i = 0; i < fretLength;i++)
        {
            list[i] = scale.getNoteAsStep(currentNote);
            currentNote = referenceOctave.nextNote(currentNote,"H");
        }
        return list;
    }
    
    getScaleWithOctave(scale, fretLength)
    {
        var list = [];
        
        var currentNote = this.root;
        var currentOctave = this.octave;
        
        for(var i = 0; i < fretLength;i++)
        {
            var scaleIndex = scale.getNoteAsStep(currentNote);
            
            if(scale.containsNote(currentNote) == true)
            {
                list[i] = currentOctave +":"+ scaleIndex;
            }
            else
            {
                list[i] = " ";
            }
            
            currentNote = referenceOctave.nextNote(currentNote,"H");
            
            if(currentNote == "C")
            {
                currentOctave++;
            }
        }
        return list;
    }
    
    toString(scale)
    {
        var notes = this.getNotes(scale);
        
        var str = "";
        
        for(var i = 0; i < notes.length;i++)
        {
            str += notes[i];
            
            var spaces = 7 - notes[i].length;
            
            for(var j=0;j<spaces;j++)
            {
                str += " ";
            }
        }
        return str;
    }
    
    
    
    addNote(scale, str, note)
    {
        var noteToPrint = note;
        
        if(scale.containsNote(note) == false)
        {
            str.push(" ");
        }
        else
        {
            str.push(scale.getActualNote(note) );
        }
    }
    
    addNoteAndOctave(scale, str, note, octave)
    {
        var noteToPrint = note;
        
        if(scale.containsNote(note) == false)
        {
            str.push(" ");
        }
        else
        {
            str.push(scale.getActualNote(note)+octave );
        }
    }
}

class KeyScale
{
    constructor(scale, notes)
    {
        this.notes = notes;
        this.actualScale = [];
        
        if(scale.isBlues == true)
        {
            for (var i = 0; i < this.notes.length; i++)
            {
                if ((this.actualScale.length > 0) && (referenceOctave.isSharpOrFlat(this.notes[i]) == true))
                {
                    var noteOptions = referenceOctave.sharpLookup[this.notes[i]];
                    
                    if (((referenceOctave.isFlat(this.notes[0]) == false) && (referenceOctave.isSharp(this.notes[0])== false))
                        || (referenceOctave.isFlat(this.notes[0]) == true)
                    ) {
                        if (noteOptions.upperNote == this.notes[0])
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
                        var note = noteOptions.lowerName;
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
            for(var i=0;i<this.notes.length;i++)
            {
                if ((this.actualScale.length > 0) && (referenceOctave.isSharpOrFlat(this.notes[i]) == true))
                {
                    var noteOptions = referenceOctave.sharpLookup[this.notes[i]];
                    
                    if ((this.actualScale.contains(noteOptions.lowerNote) == true)
                        || (this.actualScale.contains(noteOptions.lowerAltNote) == true)
                    )
                    {
                        this.actualScale.push(noteOptions.upperName);
                    }
                    else
                    {
                        this.actualScale.push(noteOptions.lowerName);
                    }
                }
                else
                {
                    this.actualScale.push(this.notes[i]);
                }
            }
        }
    }

    isScaleRoot(note)
    {
        return this.notes[0] == note;
    }
    
    containsNote(note)
    {
        if(referenceOctave.isSharpOrFlat(note) == true)
        {
            if((referenceOctave.isSharp(this.notes[0])==true)  || (referenceOctave.isFlat(this.notes[0])==true))
            {
                var altName = referenceOctave.noteToSharpFlat(this.notes[0]);
                
                if(altName == note)
                {
                    return true;
                }
            }
        }
        
        for(var i=0;i<this.notes.length;i++)
        {
            if(this.notes[i] == note)
            {
                return true;
            }
        }
        return false;
    }
    
    toString()
    {
        return this.actualScale;;
    }
    
    getActualNote(note)
    {
        if(referenceOctave.isSharpFlat(this.notes[0]) == true)
        {
            var altName = referenceOctave.noteToSharpFlat(this.notes[0]);
            
            if(altName == note)
            {
                return this.actualScale[0];
            }
        }
        
        for(var i=0;i< this.notes.length;i++)
        {
            if(this.notes[i] == note)
            {
                return this.actualScale[i];
            }
        }
        
        return "ERROR";
    }
    
    getNoteAsStep(note)
    {
        for(var i=0;i<this.notes.length;i++)
        {
            if(note == this.notes[i])
            {
                var result = (i+1);
                
                if(result == 8)
                {
                    result = 1;
                }
                
                return result;
            }
        }
        
        return " ";
    }
}

class Scale
{
    constructor(label, stepSequence, validNotes, isBlues=false)
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
    
    getScale(root)
    {
        
        var scale = [];
        
        /*
         if(referenceOctave.isSharpFlat(root) == true)
         {
         root = referenceOctave.noteToSharpFlat(root);
         }*/
        
        scale.push(root);
        var currentNote = root;
        
        for(var i=0;i<this.step.length;i++)
        {
            var cmd = this.step.charAt(i);
            
            currentNote = referenceOctave.nextNote(currentNote, cmd);
            
            scale.push(currentNote);
        }
        
        
        return new KeyScale(this,scale);
    }
    
    hasKey(key)
    {
        return this.validNotes.contains(key);
    }
}