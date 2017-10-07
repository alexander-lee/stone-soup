import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import LoginPage from './LoginPage';
import Navbar from '../components/Navbar';
import { getUser } from '../actions/user-actions';

class App extends Component {
  componentDidMount() {
    this.props.getUser();
  }

  redirectTo = (url) => {
    this.props.push(url);
  }

  renderMain = () => {
    return (
      <div>
        { location.pathname !== '/' && <Navbar redirectTo={this.redirectTo} /> }
        { this.props.children }
      </div>
    );
  }

  render() {
    let body;
    if (!this.props.user) {
      body = <div />; // LOADING
    }
    else {
      body = this.renderMain();
    }

    return body;
  }
}


function mapStateToProps(state) {
  const user = _.get(state, 'app.user');
  return { user };
}

function mapDispatchToProps(dispatch) {
  return {
    getUser: () => {
      dispatch(getUser());
    },
    push: (url) => {
      dispatch(push(url));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
