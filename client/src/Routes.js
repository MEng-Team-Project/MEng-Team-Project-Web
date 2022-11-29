import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
    Main as MainView
} from './views';

const AllRoutes = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route
                        element={<MainView/>}
                        path="/"
                        />
                </Routes>
            </div>
        </Router>
    )
};

export default AllRoutes;