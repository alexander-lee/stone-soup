import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import App from './scenes/App';
import LoginPage from './scenes/LoginPage';
import LandingPage from './scenes/LandingPage';
import ErrorPage from './scenes/ErrorPage';
import MenuPage from './scenes/MenuPage';
import ViewMenuPage from './scenes/ViewMenuPage';
import EditMenuPage from './scenes/EditMenuPage';

import { store, history } from './create-store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/menu" component={MenuPage}>
        <IndexRoute component={ViewMenuPage} />
        <Route path="/menu/edit" component={EditMenuPage} />
      </Route>
      <Route path="*" component={ErrorPage} />
    </Router>
  </Provider>,
  document.getElementById('content')
);
