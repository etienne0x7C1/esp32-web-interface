enum PIN_TYPES {
    PWM
}

/**
 * Low level driver to directly control motor gpios
 */
export class MotorDriver {
    gpios: any = {}

    constructor(pinL, pwmChanL, pinR, pwmChanR) {
        this.gpios.pwmL = {
            pin: pinL,
            pwmChan: pwmChanL,
            val: 0,
            type: PIN_TYPES.PWM
        }

        this.gpios.pwmR = {
            pin: pinR,
            pwmChan: pwmChanR,
            val: 0,
            type: PIN_TYPES.PWM
        }
    }

    forward(dutyCycle) {
        this.gpios.pwmL.val = 0;
        this.gpios.pwmR.val = dutyCycle;
    }

    backward(dutyCycle) {
        this.gpios.pwmL.val = dutyCycle;
        this.gpios.pwmR.val = 0;
    }
}
