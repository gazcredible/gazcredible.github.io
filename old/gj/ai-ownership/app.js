
//var ip = 'localhost'
//var ip = "167.172.49.166";
var ip = "192.168.0.11";
var port = '9500'

let socket = undefined

class DebugMenuOption_Text extends DebugMenuOption
{
    constructor(name, parent = undefined, dict = undefined)
    {
        super(name, parent, dict)
    }

    getName()
    {
        return this.name + ":" + this.dict.value;
    }
}


class Game
{
    constructor()
    {
        this.frameCount = 0;

        this.drawTime = new Timer();

        this.current_menu = DebugMenu;

        this.menu = new DebugMenuOption("sim menu");

        this.menu.add( new DebugMenuOption_Float('trans x',undefined, {'min': -2000, 'max': 2000, 'step': 1, 'value': 400}))
        this.menu.add( new DebugMenuOption_Float('trans y',undefined, {'min': -2000, 'max': 2000, 'step': 1, 'value': 400}))
        this.menu.add( new DebugMenuOption_Float('scale',undefined, {'min': 0.1, 'max': 200, 'step': 0.01, 'value': 1}))

        this.menu.add(new DebugMenuOption_List('node_mode', undefined, {'list': [], 'value':0, 'held_input': false}))
        this.menu.add(new DebugMenuOption_List('link_mode', undefined, {'list': [], 'value':0, 'held_input': false}))


        this.menu.add( new DebugMenuOption_Text('textbox',undefined, {'value': ""}))

        DebugMenu.add(this.menu);

        this.mouseOldPos = new Vector2();
        this.mousePos = new Vector2();

        model.init();
    }

    oneTimeInit()
    {
        GAZCanvas.referenceScreenSize = new Size(1600, 900);
    }


    updateScene()
    {
        this.current_input = {};

        if (Input.getKeystate(KEYCODE_subtract) == INPUT_PRESSED)
        {
            this.debug_mode = !this.debug_mode;
        }

        if(this.debug_mode == true)
        {
            if (Input.getKeystate(KEYCODE_left_arrow) != INPUT_NOT_PRESSED)
            {
                this.current_input['key'] = 'left'
                this.current_input['held'] = Input.getKeystate(KEYCODE_left_arrow) != INPUT_PRESSED
            }

            if (Input.getKeystate(KEYCODE_right_arrow) != INPUT_NOT_PRESSED)
            {
                this.current_input['key'] = 'right'
                this.current_input['held'] = Input.getKeystate(KEYCODE_right_arrow) != INPUT_PRESSED
            }

            if (Input.getKeystate(KEYCODE_up_arrow) == INPUT_PRESSED)
            {
                this.current_input['key'] = 'up'
            }

            if (Input.getKeystate(KEYCODE_down_arrow) == INPUT_PRESSED)
            {
                this.current_input['key'] = 'down'
            }

            if (Input.getKeystate(KEYCODE_enter) == INPUT_PRESSED)
            {
                this.current_input['key'] = 'select'
            }

            if (Input.getKeystate(KEYCODE_add) == INPUT_PRESSED)
            {
                this.current_input['key'] = 'cancel'
            }
        }
        else
        {
        }

        //do game logic
        model.update();
    }

    drawScene()
    {
        this.drawTime.addFrame();

        Canvas.ctx().imageSmoothingEnabled = false;

        model.draw();

        if(this.debug_mode == true)
        {
            this.current_menu = this.current_menu.update(this.current_input);

            Canvas.ctx().globalAlpha = 0.75;
            GAZCanvas.Rect(new Rect(0, 0, 400, 900), '#000000', true, 0);
            Canvas.ctx().globalAlpha = 1.0;
            GAZCanvas.Text(20, this.current_menu.display(), new Vector2(10, 20), '#ffffff', 'left');
        }

        GAZCanvas.Text(40,this.drawTime.Get().toFixed(2)+'mS',new Vector2(1600,40),'#ffffff','right')

        GAZCanvas.Text(20,'heatmap:' +model.heatmapTime.Get().toFixed(2)+'mS',new Vector2(1600,80),'#ffffff','right')

    }

    Run()
    {
        GameInst.oneTimeInit();

        setInterval(function()
        {
            //Update GAZCanvas to keep the application reactive (the correct aspect ratio)
            GAZCanvas.update();

            //update input control
            Input.update();

            GameInst.frameCount+= 1;
            GameInst.updateScene();

            //draw background in letterbox colour
            let letterboxColour = 'rgb(0,0,0)';
            Canvas.Rect(new Rect(0, 0, window.innerWidth, window.innerHeight),letterboxColour);

            //draw current game state
            GameInst.drawScene();

            //draw letterbox on top of everything to hide whatever needs hiding ;)
            GAZCanvas.drawLetterbox(letterboxColour);
            //want the screen rect drawn?
            GAZCanvas.Rect(new Rect(0,0,GAZCanvas.referenceScreenSize.w,GAZCanvas.referenceScreenSize.h),'rgb(255,0,0)',false,2);

        },16); //make this too small and the rendering will corrupt when moving in reverse (IDKR)
    }
}

let GameInst = undefined;