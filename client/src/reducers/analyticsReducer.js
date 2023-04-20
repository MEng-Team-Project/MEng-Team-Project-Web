/* eslint-disable import/no-anonymous-default-export */
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
    LOADING_ANALYTICS,
    GET_ANALYTICS,
    SET_ANALYTICS
} from "../actions/types";

const initialState = {
    analytics: [],
    analyticsLoading: false,
};

export default (state=initialState, action) => {
    switch (action.type) {
        case GET_ANALYTICS:
            return {
                ...state,
                analytics: action.payload
            };
        case LOADING_ANALYTICS:
            return {
                ...state,
                analyticsLoading: true
            };
        case SET_ANALYTICS:
            return {
                ...state,
                analytics: action.payload
            }
        default:
            return state;
    }
};