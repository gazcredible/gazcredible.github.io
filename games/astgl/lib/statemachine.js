/**
 * Created by gareth on 26/06/2018.
 */

class StateMachineState
{
    constructor()
    {
        this.frameCount = 0;
    }
    
    init()
    {
        this.frameCount = 0;
    }
    
    update()
    {
        this.frameCount++;
    }
    
    draw()
    {
    
    }
    
    exit()
    {
    
    }
    
}
class StateMachine
{
    constructor()
    {
        this.states = {}
        this.currentState ="";
        this.desiredState ="";
    }
    
    addState(name, state)
    {
        this.states[name] = state;
    }
    
    setState(name)
    {
        this.desiredState = name;
    }
    
    update()
    {
        if(this.desiredState != "")
        {
            if(this.currentState != "")
            {
                this.states[this.currentState].exit();
            }
            
            this.currentState = this.desiredState;
            this.desiredState = "";

            if(this.states[this.currentState] != undefined)
            {
                this.states[this.currentState].init();
            }
        }
    
        if(this.currentState != "")
        {
            if(this.states[this.currentState] != undefined)
            {
                this.states[this.currentState].update();
            }
        }
    }
    
    draw()
    {
        if(this.currentState != "")
        {
            if(this.states[this.currentState] != undefined)
            {
                this.states[this.currentState].draw();
            }
        }
    }
}