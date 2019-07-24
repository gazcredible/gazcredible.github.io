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