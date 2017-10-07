import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
// import { persistStore, autoRehydrate } from 'redux-persist';

import rootReducer from './reducers';

const store = createStore(
  combineReducers({
    app: rootReducer,
    routing: routerReducer
  }),
  compose(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(browserHistory)),
    // autoRehydrate(),
    process.env.NODE_ENV !== 'production' && typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  )
);

// persistStore(store);

const history = syncHistoryWithStore(browserHistory, store);

export { store, history }
