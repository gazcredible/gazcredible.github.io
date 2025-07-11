class BaseGame {

    constructor() {
        this.frameCount = 0;
        this.stateMachine = new StateMachine();
    }

    oneTimeInit() {

    }

    Run(inst) {
        //do oneTimeInit once

        inst.oneTimeInit();

        let time = performance.now();

        setInterval(function () {
            //on each frame ...

            Input.update();

            inst.frameCount += 1;

            //do state machine update
            inst.stateMachine.update();
            inst.stateMachine.draw();

            Canvas.ctx().canvas.width  = window.innerWidth;
            Canvas.ctx().canvas.height = window.innerHeight;

            Canvas.ctx().clearRect(0,0,Canvas.ctx().width,Canvas.ctx().height);
           // Canvas.Rect(new Rect(0,0,500,500),'#ff00ff',true)

            time = performance.now() - time;

            Canvas.Text(60,time,new Vector2(0,60),'#ffffff')

            time = performance.now();

        }, 16);
    }
}