import {Vector2,Rect} from "./maths.ts";
import {KeyCode} from "./keycode.ts";
import {KeyState} from "./keystate.ts";
import {GameBase} from "./GameBase.ts";


export class Input
{
    mouseLogicalPos;
    mouseAbsolutePos;

    currentKeyState;
    oldKeyState;
    rawKeyState;

    mouseRawState;
    currentMouseState;
    oldMouseState;

    mouseDown;
    oldMouseEvent;

    constructor()
    {
        this.mouseLogicalPos = new Vector2();
        this.mouseAbsolutePos = new Vector2();

        this.currentKeyState = new Array(256);
        this.oldKeyState = new Array(256);
        this.rawKeyState = new Array(256);

        for(let i=0;i<256;i++)
        {
            this.currentKeyState[i] = KeyState.INPUT_NOT_PRESSED;
            this.oldKeyState[i] = this.currentKeyState[i];
            this.rawKeyState[i] = '';
        }

        this.mouseRawState = '';
        this.currentMouseState = KeyState.INPUT_NOT_PRESSED;
        this.oldMouseState = this.currentMouseState;

        const self = this;

        window.addEventListener('mousemove',function (event) {
            self.mouseAbsolutePos.set(new Vector2(event.pageX, event.pageY));
        });
        window.addEventListener('mouseup',function(event){
            self.mouseDown = false;
            self.mouseAbsolutePos.set(new Vector2(event.pageX, event.pageY));

            self.mouseRawState = 'up';
        });
        window.addEventListener('mousedown',function (event){
            self.mouseDown = true;
            self.mouseAbsolutePos.set(new Vector2(event.pageX, event.pageY));

            self.mouseRawState = 'down';
        });

        window.addEventListener('keydown',function(event){
            self.rawKeyState[event.keyCode] = 'down';
        });
        window.addEventListener('keyup',function(event){
            self.rawKeyState[event.keyCode] = 'up';
        });

    }

    // Callbacks for EventListeners

    //window.addEventListener('touchstart',Input().onTouchStart);
    //window.addEventListener('touchmove',Input().onTouchMove);
    //window.addEventListener('touchend',Input().onTouchEnd);

    /*
        onTouchStart(event)
        {
            Input().mouseDown = true;
            Input().mouseLogicalPos.x  = event.touches[0].clientX;
            Input().mouseLogicalPos.y  = event.touches[0].clientY;

            Input().mouseRawState = 'down';
        }

        onTouchMove(event)
        {
            Input().mouseLogicalPos.x  = event.touches[0].clientX;
            Input().mouseLogicalPos.y  = event.touches[0].clientY;
        }

        onTouchEnd(event)
        {
            Input().mouseLogicalPos.x  = event.touches[0].clientX;
            Input().mouseLogicalPos.y  = event.touches[0].clientY;

            Input().mouseDown = false;
            Input().mouseRawState = 'up';
        }

        onMouseUp(event)
        {
            Input().mouseDown = false;
            Input().mouseLogicalPos = Input().getMousePos(event);

            Input().mouseRawState = 'up';
        }

        onKeyDown(event)
        {
            Input().rawKeyState[event.keyCode] = 'down';
        }

        onKeyUp(event)
        {
            Input().rawKeyState[event.keyCode] = 'up';
        }
     */

    getKeystate(key)
    {
        return this.currentKeyState[key];
    }

    update(game: GameBase)
    {
        if(this.mouseLogicalPos === undefined)
        {
            this.mouseDown = false;
            this.oldMouseEvent = false;

            this.currentMouseState = KeyState.INPUT_NOT_PRESSED;;
            this.oldMouseState = this.currentMouseState;
        }
        else
        {
            this.oldMouseEvent = this.mouseDown;
            this.oldMouseState = this.currentMouseState;

            this.currentMouseState = this._processState(this.currentMouseState, this.mouseRawState);
            this.mouseRawState = '';
        }

        for(let i=0;i<256;i++)
        {
            this.currentKeyState[i] = this._processState(this.currentKeyState[i], this.rawKeyState[i]);
            this.rawKeyState[i] = '';
        }

        let screenRect = new Rect();
        screenRect.set(0,0,game.canvas.referenceScreenSize.w,game.canvas.referenceScreenSize.h);
        screenRect = game.canvas.toScreenSpace(screenRect);

        if(screenRect.isInMe(this.mouseAbsolutePos) === true) {
            this.mouseLogicalPos = this.mouseAbsolutePos.clone();
            // convert screen space to renderspace
            this.mouseLogicalPos.x -= screenRect.x;
            this.mouseLogicalPos.y -= screenRect.y;

            this.mouseLogicalPos.x /= screenRect.w;
            this.mouseLogicalPos.y /= screenRect.h;

            this.mouseLogicalPos.x *= game.canvas.referenceScreenSize.w;
            this.mouseLogicalPos.y *= game.canvas.referenceScreenSize.h;
        }else{
            this.mouseLogicalPos = undefined;
        }
    }

    _processState(thing, state)
    {
        switch(thing)
        {
            case KeyState.INPUT_PRESSED:
            {
                if (state === 'up')
                {
                    return KeyState.INPUT_RELEASED;
                }
                else
                {
                    return KeyState.INPUT_HELD;
                }
            }
                break;

            case KeyState.INPUT_HELD:
            {
                if (state === 'up')
                {
                    return KeyState.INPUT_RELEASED;
                }

                return KeyState.INPUT_HELD;
            }
                break;

            case KeyState.INPUT_RELEASED:
            {
                if (state === 'down')
                {
                    return KeyState.INPUT_PRESSED;
                }

                return KeyState.INPUT_NOT_PRESSED;
            }
                break;

            case KeyState.INPUT_NOT_PRESSED:
            {
                if (state === 'down')
                {
                    return KeyState.INPUT_PRESSED;
                }
            }
                break;
        }

        return KeyState.INPUT_NOT_PRESSED;
    }
}