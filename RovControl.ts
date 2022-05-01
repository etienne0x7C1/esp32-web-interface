import { MotorDriver } from "./MotorDriver";
import { ScheduledTask, TIME_PERIOD } from "../pwa-tools/tools/ScheduledTask";
import { WebSocketClientService } from "../pwa-tools/tools/WSClientService";

const DEFAULT_UPDATE_RATE = TIME_PERIOD.sec / 40;

export class RovControl extends ScheduledTask {
    motors: any = {}
    controls: any = {}
    speed: any = { turn: 0, move: 0, mower: 0 }

    constructor(updateRate = DEFAULT_UPDATE_RATE) {
        super(updateRate)
        this.motors.right = new MotorDriver(16, 0, 17, 1);
        this.motors.left = new MotorDriver(12, 2, 14, 3);
        this.motors.mower = new MotorDriver(32, 4, 33, 5);
        this.controls.joyLeft = { x: 0, y: 0 };
        this.controls.joyRight = { x: 0, y: 0 };
        console.log("[RovControl] new instance")
    }

    // ROV actions

    turn(turnSpeed) {
        if (turnSpeed > 0) {
            // console.log("ROV turning right " + turnSpeed)
            this.motors.left.forward(turnSpeed)
            this.motors.right.backward(turnSpeed)
        } else {
            // console.log("ROV turning left " + turnSpeed)
            turnSpeed = -turnSpeed
            this.motors.left.backward(turnSpeed)
            this.motors.right.forward(turnSpeed)
        }
    }

    move(speed) {
        // forward
        if (speed >= 0) {
            // console.log("ROV moving forward " + speed)
            this.motors.left.forward(speed)
            this.motors.right.forward(speed)
        }
        // backward
        else {
            // console.log("ROV moving backward " + speed)
            this.motors.left.backward(-speed)
            this.motors.right.backward(-speed)
        }
    }

    mow(speed) {
        // console.log("ROV mowing tool working  " + speed)
        speed >= 0 ? this.motors.mower.forward(speed) : this.motors.mower.backward(speed)
    }

    onTick() {
        // skip if no changes from last time
        if (this.watchChanges()) {
            console.log("[RovControl] change detected")
            // prevent turning and moving at the same time 
            this.controls.joyRight.x ? this.turn(this.speed.turn) : this.move(this.speed.move);
            this.mow(this.speed.mower)
            // post data to webscokets
            const gpios = this.exportGPIOs();
            const service = "gpioservice"
            WebSocketClientService.data = {service, gpios}
        }
    }

    watchChanges() {
        // handle resetting joy to default pos when touching off
        if (this.controls.joyLeft.needReset) {
            this.controls.joyLeft.x = 0
            this.controls.joyLeft.y = 0
            this.controls.joyLeft.needReset = false
        }
        if (this.controls.joyRight.needReset) {
            this.controls.joyRight.x = 0
            this.controls.joyRight.y = 0
            this.controls.joyRight.needReset = false
        }
        const moveSpeed = -this.controls.joyLeft.y * 2 + Math.sign(this.controls.joyLeft.y)
        const turnSpeed = this.controls.joyRight.x * 2 - Math.sign(this.controls.joyRight.x)
        const mowerSpeed = this.controls.slider
        const hasChanged = this.speed.turn !== turnSpeed || this.speed.move !== moveSpeed || this.speed.mower !== mowerSpeed;
        this.speed.turn = turnSpeed
        this.speed.move = moveSpeed
        this.speed.mower = mowerSpeed
        return hasChanged;
    }

    // export all GPIOs to single json object
    exportGPIOs() {
        return Object.values(this.motors).map((m: MotorDriver) => Object.values(m.gpios)).flat()
    }
}