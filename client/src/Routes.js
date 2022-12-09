/*
Handles URL routing to the correct component. For example, if you were
to http://localhost:3000/guide, it would automatically load the correct
<Guide /> component.
*/

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
    Main as MainView,
    Guide as GuideView
} from './views';

const AllRoutes = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        element={<MainView/>}
                        path="/"
                        />
                    <Route
                        element={<GuideView/>}
                        path="/guide"
                        />
                </Routes>
            </div>
        </Router>
    )
};

export default AllRoutes;