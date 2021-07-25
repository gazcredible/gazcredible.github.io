class InputValue
{
    constructor()
    {
        this.value = undefined;
    }
}

class ValueInt extends InputValue
{
    constructor(i)
    {
        super();
        this.value = i;
    }
}

class ValueFloat extends InputValue
{
    constructor(f)
    {
        super();
        this.value = f;
    }
}

class ValueVector2 extends InputValue
{
    constructor(v)
    {
        super();
        this.value = v;
    }
}

class InputEventManager
{
    constructor()
    {
        this.inputEventList = {};
        this.clearEvents();
    }

    eventOccured(label)
    {
        return this.inputEventList[label] != undefined;
    }

    getVal(label)
    {
        return this.inputEventList[label];
    }

    clearEvents()
    {
        this.inputEventList = {};
    }

    processInput()
    {
        this.inputEventList = {};
    }
}

class MCInputEventManager extends InputEventManager
{
    constructor()
    {
        super();
    }
    clearEvents()
    {
        super.clearEvents();
    }

    processInput()
    {
        super.processInput();

        if(Input.getKeystate(KEYCODE_left_arrow) != INPUT_NOT_PRESSED)
        {
            this.inputEventList["LEFT"] = new InputValue();
        }

        if(Input.getKeystate(KEYCODE_right_arrow) != INPUT_NOT_PRESSED)
        {
            this.inputEventList["RIGHT"] = new InputValue();
        }

        if(Input.getKeystate(KEYCODE_up_arrow) != INPUT_NOT_PRESSED)
        {
            this.inputEventList["UP"] = new InputValue();
        }

        if(Input.getKeystate(KEYCODE_down_arrow) != INPUT_NOT_PRESSED)
        {
            this.inputEventList["DOWN"] = new InputValue();
        }

        if(Input.getKeystate(KEYCODE_q) == INPUT_PRESSED)
        {
            this.inputEventList["ENTER_MENU"] = new InputValue();
        }

        if(Input.getKeystate(KEYCODE_up_arrow) == INPUT_PRESSED)
        {
            this.inputEventList["MENU_UP"] = new InputValue();
        }

        if(Input.getKeystate(KEYCODE_down_arrow) == INPUT_PRESSED)
        {
            this.inputEventList["MENU_DOWN"] = new InputValue();
        }

        if(Input.getKeystate(KEYCODE_enter) == INPUT_PRESSED)
        {
            this.inputEventList["MENU_SELECT"] = new InputValue();
        }

        if(Input.getKeystate(KEYCODE_space_bar) == INPUT_PRESSED)
        {
            this.inputEventList["START_GAME"] = new InputValue();
        }

        if(Input.mouseLogicalPos != undefined)
        {
            if (Input.currentMouseState == INPUT_PRESSED)
            {
                this.inputEventList["CURSOR"] = new ValueVector2(Input.mouseLogicalPos);
                this.inputEventList["LAUNCH"] = new InputValue();
            }
            else
            {
                this.inputEventList["CURSOR"] = new ValueVector2(Input.mouseLogicalPos);
            }
        }
    }
}