// Axios
import axios from "axios";

// Redux Action Types
import {
    LOADING_ANALYTICS,
    GET_ANALYTICS,
    SET_ANALYTICS
} from "./types";

// Get Analytics
export const getAnalytics = () => dispatch => {
    console.log("CALLING GET ANALYTICS");
    dispatch(setAnalyticsLoading());
    axios
        .get('/api/analytics/all')
        .then(res => 
            dispatch({
                type: GET_ANALYTICS,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_ANALYTICS,
                payload: null
            })
        );
};

// Set Analytics
export const setAnalytics = analytics => dispatch => {
    dispatch({
        type: SET_ANALYTICS,
        payload: analytics
    });
};

// Analytics Loading
export const setAnalyticsLoading = () => {
    return {
        type: LOADING_ANALYTICS
    }
}