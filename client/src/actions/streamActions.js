// Axios
import axios from "axios";

// Redux Action Types
import {
    LOADING_STREAMS,
    GET_STREAMS,
    SET_STREAM
} from "./types";

// Get Streams
export const getStreams = () => dispatch => {
    // console.log("CALLING GET STREAMS");
    dispatch(setStreamsLoading());
    axios
        .get('/api/streams/all')
        .then(res => 
            dispatch({
                type: GET_STREAMS,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_STREAMS,
                payload: null
            })
        );
};

// Set Stream
export const setStream = stream => dispatch => {
    
    dispatch({
        type: SET_STREAM,
        payload: stream
    });
};

// Streams Loading
export const setStreamsLoading = () => {
    return {
        type: LOADING_STREAMS
    }
}