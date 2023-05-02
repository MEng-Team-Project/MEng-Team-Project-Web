// Redux
import {createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';

// Reducer
import rootReducer from './reducers';

// Redux State and Middleware
const initialState = {};
const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Redux Store
const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
        applyMiddleware(...middleware)
    )
);

export default store;