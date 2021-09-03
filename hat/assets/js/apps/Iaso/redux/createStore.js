import {
    combineReducers,
    createStore as _createStore,
    applyMiddleware,
    compose,
} from 'redux';

export default (initialState = {}, reducers = {}, middleWare = []) =>
    _createStore(
        combineReducers({
            ...reducers,
        }),
        initialState,
        compose(
            applyMiddleware(...middleWare),
            window.__REDUX_DEVTOOLS_EXTENSION__
                ? window.__REDUX_DEVTOOLS_EXTENSION__()
                : f => f,
        ),
    );
