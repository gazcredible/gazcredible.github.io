class Thing
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
    }

    Init()
    {
        this.x = (Math.random()*600) + 100
        this.y = (Math.random()*250)+100

        var a =Math.random()*(6.28)

        var speed = (Math.random()*2.5) + 0.5
        this.dx = Math.sin(a)*speed
        this.dy = Math.cos(a)*speed

        this.colour = [Math.random()*0.7 + 0.3,Math.random()*0.7 + 0.3,Math.random()*0.7 + 0.3,1];
    }

    Update()
    {
        var fdx = this.dx;
        var fdy = this.dy;

        if (((this.x + fdx) < -16) || ((this.x + fdx) > 800 - 16)) {
            this.dx = -this.dx;
        }

        if (((this.y + fdy) < -16) || ((this.y + fdy) > 480 - 16))
        {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}


class DemoGame extends BaseGame {
    constructor(props) {
        super(props);


        this.things = [];

        for (let i = 0; i < 10000; i++) {
            let thing = new Thing();
            thing.Init();
            this.things.push(thing);
        }
    }

    oneTimeInit() {
        super.oneTimeInit();

        this.canvas = document.getElementById("glcanvas");
        this.gl = this.canvas.getContext("webgl");

        this.debugRenderer = new DebugRenderer();
        this.debugRenderer.Init(this.gl, 32000 * 6);

        this.stateMachine.addState(GameState_Test.label(), new GameState_Test());
        this.stateMachine.setState(GameState_Test.label());
    }
}

DemoGameInst = new DemoGame();