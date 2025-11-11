import {Rect, Size, Vector2} from "./maths.ts";
import {Input} from "./input.ts";
import {GAZCanvas} from "./GAZCanvas.ts";

export class StateMachineState
{
    frameCount;

    constructor(game :GameBase)
    {
        this.frameCount = 0;
    }

    init(game :GameBase)
    {
        this.frameCount = 0;
    }

    update(game :GameBase)
    {
        this.frameCount++;
    }

    draw(game :GameBase)
    {

    }

    exit(game :GameBase)
    {

    }
}
export class StateMachine
{
    states ;
    currentState;
    desiredState;

    constructor()
    {
        this.states = {}
        this.currentState ="";
        this.desiredState ="";
    }

    /*
        addState(string name, StateMachineState state)

        Add new state to this.states{}, state machine dictionary

        Will fail if name in use already
     */
    addState(name, state)
    {
        this.states[name] = state;
    }

    /*
        setState(string name)

        Request state change at next Statemachine.Update() call

        Will fail if name is not in this.states,  i.e. undefined state
     */

    setState(name)
    {
        this.desiredState = name;
    }

    /*
        update() -  Do logical update on state machine
                    Will do state transition if desired state has been set
    */
    update(game)
    {
        if(this.desiredState !== "")
        {
            if(this.currentState !== "")
            {
                this.states[this.currentState].exit();
            }

            this.currentState = this.desiredState;
            this.desiredState = "";

            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].init(game);
            }
        }

        if(this.currentState !== "")
        {
            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].update(game);
            }
        }
    }

    draw(game)
    {
        if(this.currentState !== "")
        {
            if(this.states[this.currentState] !== undefined)
            {
                this.states[this.currentState].draw(game);
            }
        }
    }
}


export class GameBase
{
    public frameCount ;
    stateMachine :StateMachine;
    input;
    canvas;


    constructor()
    {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();

        this.input = new Input();

        this.canvas = new GAZCanvas();
    }

    oneTimeInit()
    {
        this.canvas.referenceScreenSize = new Size(1600,900);
    }

    update()
    {
    }

    draw()
    {
    }

    Run()
    {
        //do oneTimeInit once
        //@typescript-eslint/no-this-alias
        let game = this;

        game.oneTimeInit();

        setInterval(function()
        {
            //on each frame ...

            /*
                GAZCanvas().update() -    this does the reactive canvas functionality
                                        and needs to be called at the beginning of each
                                        update()
             */
            game.canvas.update(0);

            /*
                Input.update() -    Update system inputs (mouse, keyboard).
                                    Needs to be called each frame
             */
            game.input.update(game);

            game.frameCount+= 1;

            //do state machine update
            game.stateMachine.update(game);

            //clear screen for drawing
            let letterboxColour = 'rgb(32,32,32)';

            //do state machine draw
            game.stateMachine.draw(game);

            /*
            if (game.input.mouseLogicalPos !== undefined){
                game.canvas.Rect(new Rect(game.input.mouseLogicalPos.x-16, game.input.mouseLogicalPos.y-16, 32,32),'#ff0000');
            }*/


            //draw the letterbox over the screen to hide any overdraw
            game.canvas.drawLetterbox(letterboxColour);
        },17);
    }
}