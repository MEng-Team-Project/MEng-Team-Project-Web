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