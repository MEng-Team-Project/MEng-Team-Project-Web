/*
Exports the functions used to get a new global state from an old one.
*/

import { combineReducers } from "redux";
import streamReducer from "./streamReducer";

export default combineReducers({
    streams: streamReducer
});