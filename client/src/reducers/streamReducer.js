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