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
                this.inputEventList["LAUNCH"] = new InputValue();
            }
            else
            {
                this.inputEventList["CURSOR"] = new ValueVector2(Input.mouseLogicalPos);
            }
        }
    }
}