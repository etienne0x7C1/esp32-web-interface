import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { AppRoutes, RouteLinks } from "../pwa-tools/utils/routing"
import { BuildNum, NavBar } from '../pwa-tools/UI/elements';
import { isMobile } from '../pwa-tools/utils/misc';
// import "../../App.css"
import "../pwa-tools/pwa.css"
// import "./styles.css"

export const BASENAME = process.env.PUBLIC_URL ? process.env.PUBLIC_URL + "/" : ""

// Entry point
const App = () => {
    console.log(BASENAME)
    return (
        <BrowserRouter basename={BASENAME}>
            <div className="App">
                <NavBar />
                <Routes >
                    <Route index element={<Dashboard />} />
                    {/* <Route path={"/*"} element={<Entries />} /> */}
                </Routes>
                <AppRoutes style={{ position: "absolute" }}>
                    <Monitor customRouteName={'monitor'} />
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

export const Monitor = ({ customRouteName }) => {
    return (<>
        {/* <h1 style={{ textAlign: "center" }}> Monitor </h1> */}
    </>);
}

const Wrapper = ({ customRouteName }) => {
    return (<></>)
}

export default App