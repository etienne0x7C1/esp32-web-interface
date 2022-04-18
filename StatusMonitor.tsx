import { WebSocketClientService } from "./WSClientService";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// class DeviceMonitorService extends WebSocketClientService {

//     constructor(){
//         super("DeviceMonitor")
//     }

// }

export const StatusMonitor = ({ customRouteName }) => {
    const interval: any = useRef()
    const [refreshFlag, setRefreshFlag] = useState(false)
    const [state, setState] = useState(false)
    const countRef = useRef(0)

    const ping = useCallback(() => {
        if (state !== WebSocketClientService.isConnected) {
            console.log(WebSocketClientService.isConnected ? "connnected to device" : "lost connection")
            setState(WebSocketClientService.isConnected)
        }
        const counter = countRef.current++;
        if (WebSocketClientService.isConnected) {
            WebSocketClientService.sendData({ counter })
        }
        setRefreshFlag(!refreshFlag)
    }, [state, refreshFlag])

    useEffect(() => {
        interval.current = setInterval(() => ping(), 1000);
        // cleanup
        return () => { clearInterval(interval.current); };
    }, [ping])

    return (<>
        <h2>Device ESP32</h2>

        <div>State: {state ? "Connected" : "Offline"}</div>
        <div>{state ? "Uptime: " : "Downtime: "} {countRef.current}</div>
        <div>Sent: {countRef.current}</div>
        <div>Received: {WebSocketClientService.msgCount}</div>
        <div>Data: {WebSocketClientService.msgData}</div>

    </>);
}