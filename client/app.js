import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import App from './scenes/App';
import ErrorPage from './scenes/ErrorPage';
import MenuPage from './scenes/MenuPage';
import EditRestaurantPage from './scenes/EditRestaurantPage';

import { store, history } from './create-store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
        <Route path="/" component={App}>
            <Route path="/menu" component={MenuPage} />
            <Route path="/restaurant/edit" component={EditRestaurantPage}/>
        </Route>
        <Route path="*" component={ErrorPage} />
    </Router>
  </Provider>,
  document.getElementById('content')
);
