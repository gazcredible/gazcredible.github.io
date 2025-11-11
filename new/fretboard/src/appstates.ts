import {StateMachineState} from "./gazlib/GameBase.ts";
import {KeyCode} from "./gazlib/keycode.ts";
import {KeyState} from "./gazlib/keystate.ts";
import {Rect, Vector2} from "./gazlib/maths.ts";
import {Fretboard} from "./fretboard.ts";

export class GameState_Test extends StateMachineState {
    oscillator;

    static label() {
        return "GameState_Test";
    }

    constructor(app: Fretboard) {
        super(app);
    }

    midi_init() {

    }

    midi_fail() {

    }

    init(app: Fretboard) {
        super.init(app)

    }

    update(app: Fretboard) {
        super.update(app)

        app.update();
    }

    draw(app: Fretboard) {
        super.draw(app)

        app.draw();

    }
}