// Axios
import axios from "axios";

// Redux Action Types
import {
    LOADING_STREAMS,
    GET_STREAMS
} from "./types";

// Get Streams
export const getStreams = () => dispatch => {
    console.log("CALLING GET STREAMS");
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

// Streams Loading
export const setStreamsLoading = () => {
    return {
        type: LOADING_STREAMS
    }
}