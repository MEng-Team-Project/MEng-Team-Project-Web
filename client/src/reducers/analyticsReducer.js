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
    analytics: {
        interval: 1800,
        objects: [],
        regions: [
            "North_Burnaby_Road",
            "East_Park_Road",
            "South_Burnaby_Road",
            "West_Park_Road"
        ],
        counts: [
            {
                "start": "West_Park_Road",
                "end": "East_Park_Road",
                "counts": {
                    "total": 1,
                    "car": 1,
                }
            },
            {
                "start": "South_Burnaby_Road",
                "end": "West_Park_Road",
                "counts": {
                    "total": 3,
                    "bicycle": 1,
                    "person": 1,
                    "car": 1
                }
            },
            {
                "start": "South_Burnaby_Road",
                "end": "North_Burnaby_Road",
                "counts": {
                    "total": 1,
                    "car": 1
                }
            },
            {
                "start": "East_Park_Road",
                "end": "West_Park_Road",
                "counts": {
                    "total": 4,
                    "car": 1,
                    "person": 3
                }
            },
            {
                "start": "East_Park_Road",
                "end": "South_Burnaby_Road",
                "counts": {
                    "total": 4,
                    "person": 2,
                    "car": 2
                }
            },
            {
                "start": "North_Burnaby_Road",
                "end": "South_Burnaby_Road",
                "counts": {
                    "total": 1,
                    "car": 1
                }
            }
        ]
    },
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