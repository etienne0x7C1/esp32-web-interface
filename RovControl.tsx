import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MotorDriver } from "./MotorDriver";
import { WebSocketClientService } from "./WSClientService";

class RovControl {

    motorLeft: MotorDriver;
    motorRight: MotorDriver;
    motorTool: MotorDriver;
    motors = []

    constructor() {
        this.motorLeft = new MotorDriver(16, 0, 17, 1);
        this.motorRight = new MotorDriver(26, 2, 27, 3);
        this.motorTool = new MotorDriver(2, 4, 4, 5);
        this.motors = [this.motorLeft, this.motorRight, this.motorTool]
    }

    turnLeft(speed) {
        this.motorLeft.forward(speed)
        this.motorRight.backward(speed)
    }

    turnRight(speed) {

    }

    moveForward(speed) {
        this.motorLeft.forward(speed)
    }

    moveBackward(speed) {

    }

    toGPIOs() {
        return this.motors.map((m: MotorDriver) => Object.values(m.gpios)).flat()
    }
}

export const RovControlInterface = ({ customRouteName }) => {

    const interval: any = useRef()
    const [refreshFlag, setRefreshFlag] = useState(false)
    const [state, setState] = useState(false)
    const countRef = useRef(0)

    const ping = useCallback(() => {
        if (state !== WebSocketClientService.isConnected) {
            console.log("state change")
            setState(WebSocketClientService.isConnected)
        }
        const counter = countRef.current++;
        rov.moveForward(80);
        if (WebSocketClientService.isConnected) {
            WebSocketClientService.sendData({ service: "gpioservice", gpios: rov.toGPIOs() })
        }
        setRefreshFlag(!refreshFlag)
    }, [state, refreshFlag])

    useEffect(() => {
        interval.current = setInterval(() => ping(), 1000);
        // cleanup
        return () => { clearInterval(interval.current); };
    }, [ping])

    const rov = useMemo(() => {
        console.log("[ROV] create")
        return new RovControl()
    }, [])



    return (<>
        <h2>RovControl</h2>

    </>);
}