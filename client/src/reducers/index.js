/*
Exports the functions used to get a new global state from an old one.
*/

import { combineReducers } from "redux";
import streamReducer from "./streamReducer";
import filtersReducer from "./filtersReducer";

export default combineReducers({
    streams: streamReducer,
    filters: filtersReducer
});