import { useEffect, useMemo, useRef } from "react";
import { TouchControls } from "../pwa-tools/tools/TouchControls";
import { TouchInterface } from "../pwa-tools/tools/TouchInterface";
import { MotorDriver } from "./MotorDriver";
import { WebSocketClientService } from "./WSClientService";

class RovControl {
    motors: any = {}
    controls: any = {}
    speed: any = { turn: 0, move: 0, mower: 0 }
    watchRate = 50 // in ms
    elapsedTime = 0 // since last update
    timeout = 1000  // max time before keepalive

    constructor() {
        this.motors.right = new MotorDriver(16, 0, 17, 1);
        this.motors.left = new MotorDriver(12, 2, 14, 3);
        this.motors.mower = new MotorDriver(32, 4, 33, 5);
        this.controls.joyLeft = { x: 0, y: 0 };
        this.controls.joyRight = { x: 0, y: 0 };
    }

    turn(turnSpeed) {
        if (turnSpeed > 0) {
            console.log("ROV turning right " + turnSpeed)
            this.motors.left.forward(turnSpeed)
            this.motors.right.backward(turnSpeed)
        } else {
            console.log("ROV turning left " + turnSpeed)
            turnSpeed = -turnSpeed
            this.motors.left.backward(turnSpeed)
            this.motors.right.forward(turnSpeed)
        }
    }

    move(speed) {
        // forward
        if (speed >= 0) {
            console.log("ROV moving forward " + speed)
            this.motors.left.forward(speed)
            this.motors.right.forward(speed)
        }
        // backward
        else {
            console.log("ROV moving backward " + speed)
            this.motors.left.backward(-speed)
            this.motors.right.backward(-speed)
        }
    }

    mow(speed) {
        console.log("ROV mowing tool working  " + speed)
        speed >= 0 ? this.motors.mower.forward() : this.motors.mower.backward()
    }

    // watch for changes and call keepalive if timeout elapsed
    watchLoop() {
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
        const mowerSpeed = 0
        const hasChanged = this.speed.turn !== turnSpeed || this.speed.move !== moveSpeed || this.speed.mower !== mowerSpeed;
        // skip if no changes from last time
        if (hasChanged || this.elapsedTime >= this.timeout) {
            if (hasChanged) {
                console.log('speed change')
                this.speed.turn = turnSpeed
                this.speed.move = moveSpeed
                this.speed.mower = mowerSpeed
                // prevent turning and moving at the same time 
                this.controls.joyRight.x ? this.turn(this.speed.turn) : this.move(this.speed.move);
            }
            // call
            this.keepAlive()
        } else {
            this.elapsedTime += this.watchRate;
        }
    }

    // called periodically to maintain link with server and push updates
    keepAlive() {
        if (WebSocketClientService.isConnected) {
            WebSocketClientService.sendData({ service: "gpioservice", gpios: this.toGPIOs() })
            this.elapsedTime = 0;
        }
    }

    toGPIOs() {
        return Object.values(this.motors).map((m: MotorDriver) => Object.values(m.gpios)).flat()
    }
}

export const RovControlInterface = ({ customRouteName }) => {

    const touchRef = useRef()
    const interval: any = useRef()
    // const [refreshFlag, setRefreshFlag] = useState(false)
    // const [state, setState] = useState(false)
    // const countRef = useRef(0)

    useEffect(() => {
        // if (state !== WebSocketClientService.isConnected) {
        //     console.log("state change")
        //     setState(WebSocketClientService.isConnected)
        // }
        interval.current = setInterval(() => rovControl.watchLoop(), rovControl.watchRate);
        // cleanup
        return () => { clearInterval(interval.current); };
    }, [])

    const rovControl = useMemo(() => {
        console.log("[ROV Interface] create rov control instance")
        const rovInstance = new RovControl()
        // bind touch inputs to ROV controls
        touchRef.current = rovInstance.controls
        return rovInstance
    }, [])

    useEffect(() => {
        document.documentElement.requestFullscreen();
    }, [])

    return (<>
        <div class="header">
            <h1>RovControl</h1>
            <p>Resize the browser window to see the responsive effect.</p>
        </div>
        <div style={{ display: "inline-grid", gridTemplateColumns: "auto auto auto" }}>
            <div >1</div>
            <div >2</div>
            <div >3</div>
            <div >1</div>
            <div >2</div>
            <div >3</div>
            <div >1</div>
            <div >2</div>
            <div >3</div>
        </div>
        <TouchControls touchRef={touchRef} >
            {/* <TouchInterface touchRef={touchRef} /> */}
        </TouchControls>

    </>);
}