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
            <Routes >
                <Route path={"/*"} element={<Entries />} />
                {/* <AppRoutes style={{ position: "absolute" }}>
                    <Wrapper customRouteName={'update'} />
                    <Monitor />
                </AppRoutes> */}
                {/* <Route path="/monitor" element={<Monitor customRouteName={'monitor'} />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

/**
 * Apps entries index 
 */
const Entries = () => {
    return (
        <div className="App">
            <NavBar />
            <AppRoutes /*index={<Dashboard />}*/ style={{ position: "absolute" }}>
                <Wrapper customRouteName={'update'} />
                <Monitor customRouteName={'monitor'} />
            </AppRoutes>
        </div>
    )
}

const Wrapper = ({ customRouteName }) => {
    return (<></>)
}

const Dashboard = ({ ...props }) => {
    return (
        <>
            {/* <header className="App-header App-header-cust"> */}
            <h1 style={{ textAlign: "center" }}> DASHBOARD </h1>
            {/* <div className="App-items"> */}
            {/* <RouteLinks elements={children} /> */}
            {/* </div> */}
            <BuildNum />
            {/* </header> */}
        </>
    )
}

export const Monitor = ({ customRouteName }) => {

    return (
        <div className="App">

        </div>
    );
}

export default App