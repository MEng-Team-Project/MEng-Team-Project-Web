/*
Provides the inital global state of the frontend and the function
used to accept the old state and return the new state.

The idea behind redux states is similar to the rest of react,
don't mutate global state, instead transform it in a functional
programming manner where you are applying a simple transformation
(e.g. copy the old state and add some new data) without ever
mutating data.
*/

import {
    LOADING_STREAMS,
    GET_STREAMS,
    SET_STREAM
} from "../actions/types";

const initialState = {
    streams: [],
    streamsLoading: false,
    stream: ""
};

export default (state=initialState, action) => {
    switch (action.type) {
        case GET_STREAMS:
            return {
                ...state,
                streams: action.payload
            };
        case LOADING_STREAMS:
            return {
                ...state,
                streamsLoading: true
            };
        case SET_STREAM:
            return {
                ...state,
                stream: action.payload
            }
        default:
            return state;
    }
};