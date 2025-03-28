var INPUT_NOT_PRESSED = 'not_pressed';
var INPUT_PRESSED = 'pressed';
var INPUT_HELD = 'held';
var INPUT_RELEASED = 'released';

class InputClass
{
    constructor()
    {
        this.mouseLogicalPos = new Vector2();
        this.mouseAbsolutePos = new Vector2();
    
        this.currentKeyState = new Array(256);
        this.oldKeyState = new Array(256);
        this.rawKeyState = new Array(256);
    
        var i;
        for(i=0;i<256;i++)
        {
            this.currentKeyState[i] = INPUT_NOT_PRESSED;
            this.oldKeyState[i] = this.currentKeyState[i];
            this.rawKeyState[i] = '';
        }
        
        this.mouseRawState = '';
        this.currentMouseState = INPUT_NOT_PRESSED;
        this.oldMouseState = this.currentMouseState;
    
        this.ongoingTouches = [];
    }
    
    onMouseMove(event)
    {
        Input.mouseLogicalPos = Input.getMousePos(event);
    }
    
    onMouseDown(event)
    {
        Input.mouseDown = true;
        Input.mouseLogicalPos = Input.getMousePos(event);
    
        Input.mouseRawState = 'down';
    }
    
    onMouseUp(event)
    {
        Input.mouseDown = false;
        Input.mouseLogicalPos = Input.getMousePos(event);
    
        Input.mouseRawState = 'up';
    }
    
    onKeyDown(event)
    {
        Input.rawKeyState[event.keyCode] = 'down';
        console.log(event.keyCode);
    }
    
    onKeyUp(event)
    {
        Input.rawKeyState[event.keyCode] = 'up';
    }
    
    getMousePos(event)
    {
        var rawMousePos = new Vector2(event.pageX, event.pageY);
    
        this.mouseAbsolutePos.set(rawMousePos);
    
        var screenRect = new Rect();
        screenRect.set(0,0,GAZCanvas.referenceScreenSize.w,GAZCanvas.referenceScreenSize.h);
        screenRect = GAZCanvas.toScreenSpace(screenRect);
    
        if(screenRect.isInMe(rawMousePos) === true)
        {
            // convert screen space to renderspace
            rawMousePos.x -= screenRect.x;
            rawMousePos.y -= screenRect.y;
        
            rawMousePos.x /= screenRect.w;
            rawMousePos.y /= screenRect.h;
        
            rawMousePos.x *= GAZCanvas.referenceScreenSize.w;
            rawMousePos.y *= GAZCanvas.referenceScreenSize.h;
        
            return rawMousePos;
        }
        return undefined;
    }
    
    colorForTouch(touch)
    {
        var r = touch.identifier % 16;
        var g = Math.floor(touch.identifier / 3) % 16;
        var b = Math.floor(touch.identifier / 7) % 16;
        r = r.toString(16); // make it a hex digit
        g = g.toString(16); // make it a hex digit
        b = b.toString(16); // make it a hex digit
        var color = "#" + r + g + b;
        console.log("color for touch with identifier " + touch.identifier + " = " + color);
        return color;
    }
    
    ongoingTouchIndexById(idToFind)
    {
        for (var i = 0; i < this.ongoingTouches.length; i++)
        {
            var id = this.ongoingTouches[i].identifier;
        
            if (id == idToFind)
            {
                return i;
            }
        }
        return -1;    // not found
    }
    
    copyTouch(touch)
    {
        return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    }
    
    onTouchStart(evt)
    {
        //evt.preventDefault();
        console.log("touchstart.");
        var el = document.getElementsByTagName("canvas")[0];
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;
    
        for (var i = 0; i < touches.length; i++) {
            console.log("touchstart:" + i + "...");
            Input.ongoingTouches.push(Input.copyTouch(touches[i]));
            var color = Input.colorForTouch(touches[i]);
            ctx.beginPath();
            ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
            ctx.fillStyle = color;
            ctx.fill();
            console.log("touchstart:" + i + ".");
        }
    }
    
    onTouchEnd(evt)
    {
        //evt.preventDefault();
        console.log("touchend");
        var el = document.getElementsByTagName("canvas")[0];
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;
    
        for (var i = 0; i < touches.length; i++) {
            var color = Input.colorForTouch(touches[i]);
            var idx = Input.ongoingTouchIndexById(touches[i].identifier);
        
            if (idx >= 0)
            {
                ctx.lineWidth = 4;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(Input.ongoingTouches[idx].pageX, Input.ongoingTouches[idx].pageY);
                ctx.lineTo(touches[i].pageX, touches[i].pageY);
                ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
                Input.ongoingTouches.splice(idx, 1);  // remove it; we're done
            }
            else
                {
                //console.log("can't figure out which touch to end");
            }
        }
    }
    
    onTouchCancel(evt) {
        //evt.preventDefault();
        console.log("touchcancel.");
        var touches = evt.changedTouches;
    
        for (var i = 0; i < touches.length; i++)
        {
            var idx = Input.ongoingTouchIndexById(touches[i].identifier);
            Input.ongoingTouches.splice(idx, 1);  // remove it; we're done
        }
    }
    
    onTouchMove(evt)
    {
        //evt.preventDefault();
        var el = document.getElementsByTagName("canvas")[0];
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;
    
        for (var i = 0; i < touches.length; i++)
        {
            var color = Input.colorForTouch(touches[i]);
            var idx = Input.ongoingTouchIndexById(touches[i].identifier);
        
            if (idx >= 0)
            {
                console.log("continuing touch "+idx);
                ctx.beginPath();
                console.log("ctx.moveTo(" + Input.ongoingTouches[idx].pageX + ", " + Input.ongoingTouches[idx].pageY + ");");
                ctx.moveTo(Input.ongoingTouches[idx].pageX, Input.ongoingTouches[idx].pageY);
                console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
                ctx.lineTo(touches[i].pageX, touches[i].pageY);
                ctx.lineWidth = 4;
                ctx.strokeStyle = color;
                ctx.stroke();
    
                Input.ongoingTouches.splice(idx, 1, Input.copyTouch(touches[i]));  // swap in the new touch record
                console.log(".");
            }
            else
                {
                console.log("can't figure out which touch to continue");
            }
        }
    }
    
    
    update()
    {
        if(this.mouseLogicalPos == undefined)
        {
            this.mouseDown = false;
            this.oldMouseEvent = false;
            
            this.currentMouseState = INPUT_NOT_PRESSED;
            this.oldMouseState = this.currentMouseState;
        }
        else
        {
            this.oldMouseEvent = this.mouseDown;
            this.oldMouseState = this.currentMouseState;
            
            this.currentMouseState = this._processState(this.currentMouseState, this.mouseRawState);
            this.mouseRawState = '';
        }
    
        var i;
        for(i=0;i<256;i++)
        {
            this.oldKeyState[i] = this.currentKeyState[i];
            
            if(this.currentKeyState[i] == 'pressed')
            {
                if(this.rawKeyState[i] == 'up')
                {
                    this.currentKeyState[i] = 'released';
                }
                else
                {
                    this.currentKeyState[i] = 'held';
                }
            }
            else
            {
                if(this.currentKeyState[i] == 'held')
                {
                    if(this.rawKeyState[i] == 'up')
                    {
                        this.currentKeyState[i] = 'released';
                    }
                }
                else
                {
                    if(this.currentKeyState[i] == 'released')
                    {
                        this.currentKeyState[i] = INPUT_NOT_PRESSED;
                    }
                    else
                    {
                        if(this.rawKeyState[i] == 'down')
                        {
                            this.currentKeyState[i] = 'pressed';
                        }
                    }
                }
            }
            this.rawKeyState[i] = "";
        }
    }
    
    _processState(thing, state)
    {
        switch(thing)
        {
            case INPUT_PRESSED:
            {
                if (state == 'up')
                {
                    return INPUT_RELEASED;
                }
                else
                {
                    return INPUT_HELD;
                }
            }
            break;
    
            case INPUT_HELD:
            {
                if (state == 'up')
                {
                    return INPUT_RELEASED;
                }
        
                return INPUT_HELD;
            }
            break;
            
            case INPUT_RELEASED:
            {
                if (state == 'down')
                {
                    return INPUT_PRESSED;
                }
        
                return INPUT_NOT_PRESSED;
            }
            break;
    
            case INPUT_NOT_PRESSED:
            {
                if (state == 'down')
                {
                    return INPUT_PRESSED;
                }
            }
            break;
        }
        
        return INPUT_NOT_PRESSED;
    }
    
    getKeystate(key)
    {
        return this.currentKeyState[key];
    }
}

Input = new InputClass();

window.addEventListener('mousemove',Input.onMouseMove);
window.addEventListener('mouseup',Input.onMouseUp);
window.addEventListener('mousedown',Input.onMouseDown);

window.addEventListener('keydown',Input.onKeyDown);
window.addEventListener('keyup',Input.onKeyUp);

window.addEventListener("touchstart", Input.onTouchStart, false);
window.addEventListener("touchend", Input.onTouchEnd, false);
window.addEventListener("touchcancel", Input.onTouchCancel, false);
window.addEventListener("touchmove", Input.onTouchMove, false);
