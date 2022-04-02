import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import countriesReducer from './reducers';

/* Dev config */
const composeEnhaners = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    countriesReducer,
    composeEnhaners(applyMiddleware(thunk))
);

export default store;