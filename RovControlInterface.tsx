import { faEject, faFire } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TIME_PERIOD } from "../pwa-tools/tools/ScheduledTask";
import { TouchControls } from "../pwa-tools/tools/TouchControls";
import { Slider } from "../pwa-tools/UI/slider";
import { FullscreenToggleBtn, TouchButton } from "../pwa-tools/UI/touchInterface";
import { RovControl } from "./RovControl";

enum TOUCH_BTN_ACTIONS { 
    Jump,
    Fire
}

const RovTouchBtnInterface = ({ touchRef }) => {

    const onButtonTouch = ((action, state) => {
        switch (action) {
            case TOUCH_BTN_ACTIONS.Jump:
                // if (state) console.log("jump")
                touchRef.current.jump = state
                break;
            case TOUCH_BTN_ACTIONS.Fire:
                // if (state) console.log("fire")
                touchRef.current.fire = state
                break;
        }
    })

    return (<>
        <FullscreenToggleBtn />
        {/* <TouchButton icon={faEject} style={{ top: "40%", right: "10%" }} onTouch={(state) => onButtonTouch(TOUCH_BTN_ACTIONS.Jump, state)} />
        <TouchButton icon={faFire} style={{ bottom: "13%", right: "8%" }} onTouch={(state) => onButtonTouch(TOUCH_BTN_ACTIONS.Fire, state)} /> */}
    </>)

}

export const RovControlInterface = ({ customRouteName }) => {

    const touchRef = useRef()// link between UI touch controls and Rov inputs

    const rovControl = useMemo(() => {
        console.log("[RovControlInterface] ready")
        const rovInstance = new RovControl(TIME_PERIOD.sec / 10)
        // bind touch inputs to ROV controls
        touchRef.current = rovInstance.controls
        return rovInstance
    }, [])

    return (<>
        {/* <div>
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
        </div> */}
        <TouchControls touchRef={touchRef} showBtn>
            <Slider touchRef={touchRef} />
            <RovTouchBtnInterface touchRef={touchRef} />
        </TouchControls>

    </>);
}