import {
    LOADING_STREAMS,
    GET_STREAMS
} from "../actions/types";

const initialState = {
    streams: [],
    streamsLoading: false
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
        default:
            return state;
    }
};