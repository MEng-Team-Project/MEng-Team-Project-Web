// Axios
import axios from "axios";

// Redux Action Types
import {
    LOADING_FILTERS,
    GET_FILTERS,
    SET_FILTERS
} from "./types";

// Get Filters
export const getFilters = () => dispatch => {
    console.log("CALLING GET FILTERS");
    dispatch(setFiltersLoading());
    axios
        .get('/api/filters/all')
        .then(res => 
            dispatch({
                type: GET_FILTERS,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_FILTERS,
                payload: null
            })
        );
};

// Set Filters
export const setFilters = filters => dispatch => {
    dispatch({
        type: SET_FILTERS,
        payload: filters
    });
};

// Filters Loading
export const setFiltersLoading = () => {
    return {
        type: LOADING_FILTERS
    }
}