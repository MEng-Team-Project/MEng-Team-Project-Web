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
    LOADING_FILTERS,
    GET_FILTERS,
    SET_FILTERS
} from "../actions/types";

const initialState = {
    filters: {
        dataSourceFilter: {},
        objectFilter: [],
        dateTimeRangeFilter: {},
        startRegionFilter: [],
        endRegionFilter: []
    },
    filtersLoading: false,
};

export default (state=initialState, action) => {
    switch (action.type) {
        case GET_FILTERS:
            return {
                ...state,
                filters: action.payload
            };
        case LOADING_FILTERS:
            return {
                ...state,
                filtersLoading: true
            };
        case SET_FILTERS:
            return {
                ...state,
                filters: action.payload
            }
        default:
            return state;
    }
};