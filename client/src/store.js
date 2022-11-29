// Redux
import {createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';

// Reducer
import rootReducer from './reducers';

// Redux State and Middleware
const initialState = {};
const middleware = [thunk];

// Redux Store
const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware)
    )
);

export default store;