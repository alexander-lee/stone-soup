import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import App from './scenes/App';
import ErrorPage from './scenes/ErrorPage';
import LoginPage from './scenes/LoginPage';
import MenuPage from './scenes/MenuPage';
import TicketPage from './scenes/TicketPage';
import CreateRestaurantPage from './scenes/CreateRestaurantPage';
import { store, history } from './create-store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={LoginPage} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/restaurant/tickets" component={TicketPage}/>
        <Route path="/restaurant/create" component={CreateRestaurantPage}/>
      </Route>
      <Route path="*" component={ErrorPage} />
    </Router>
  </Provider>,
  document.getElementById('content')
);
