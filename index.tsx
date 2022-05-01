import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { AppRoutes, RouteLinks } from "../pwa-tools/utils/routing"
import { BuildNum, StatusBar } from '../pwa-tools/UI/statusBar';
import { isMobile } from '../pwa-tools/utils/misc';
// import "../../App.css"
import "../pwa-tools/pwa.css"
// import { StatusMonitor } from '../pwa-tools/tools/StatusMonitor';
import { WebSocketClientService } from '../pwa-tools/tools/WSClientService';
import { ScheduledTask, TIME_PERIOD } from '../pwa-tools/tools/ScheduledTask';
import { RovControlInterface } from './RovControlInterface';
// import "./styles.css"

export const BASENAME = process.env.PUBLIC_URL ? process.env.PUBLIC_URL + "/" : ""

// Entry point
const App = () => {
    const interval: any = useRef()

    console.log(BASENAME)

    useEffect(() => {

    })

    useEffect(() => {
        console.log("start watchloop")
        // if (state !== WebSocketClientService.isConnected) {
        //     console.log("state change")
        //     setState(WebSocketClientService.isConnected)
        // }
        WebSocketClientService.createSingleton(`ws://${window.location.hostname}/ws`)
        ScheduledTask.startTimer(TIME_PERIOD.sec / 40)
        // interval.current = WebSocketClientService.startWatchLoop(1000)
        // interval.current = setInterval(() => watchLoop(), watchRate);
        // cleanup
        // return () => { console.log("stoping watchloop"); clearInterval(interval.current); };
        return () => ScheduledTask.stopTimer();
    }, [])

    return (
        <BrowserRouter basename={BASENAME}>
            <div className="App">
                <StatusBar>
                    {/* <div>toto</div> */}
                </StatusBar>
                <Routes >
                    <Route index element={<Dashboard />} />
                    {/* <Route path={"/*"} element={<Entries />} /> */}
                </Routes>
                <AppRoutes style={{ position: "absolute" }}>
                    {/* <StatusMonitor customRouteName={'monitor'} /> */}
                    <RovControlInterface customRouteName={'rovcontrol'} />
                    <Wrapper customRouteName={'update'} />
                </AppRoutes>
            </div>
        </BrowserRouter>
    );
}

// const Entries = () => {
//     return (<AppRoutes /*index={<Dashboard />}*/ style={{ position: "absolute" }}>
//         <Monitor customRouteName={'monitor'} />
//         <Wrapper customRouteName={'update'} />
//     </AppRoutes>)
// }

const Dashboard = ({ ...props }) => {
    return (
        <>
            <h1 style={{ textAlign: "center" }}> ESP32 Interface </h1>
            <BuildNum />
        </>
    )
}

const Wrapper = ({ customRouteName }) => {
    return (<></>)
}

export default App