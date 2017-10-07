import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import _ from 'lodash';

import { login } from '../actions/user-actions';

import s from '../styles/LoginPage.scss';

class LoginPage extends Component {
  componentDidMount() {
    if(this.props.user.loggedIn) {
      this.props.dispatch(push('/'));
    }
  }

  onLogin = () => {
    const username = this.refs.username;
    const password = this.refs.password;

    this.props.dispatch(login(username, password));
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.loginContainer}>
          <img src="images/stonesoup.svg" />
          <p>Participate</p>
          <input type="text" placeholder="Username" ref="username" />
          <input type="password" placeholder="Password" ref="password" />
          <button onClick={this.onLogin}>Login</button>
        </div>
        <div className={s.imageContainer}>
          <img src="images/landing.jpg" />
          <div className={s.imageContent}>
              <h1>Stone Soup</h1>
              <p>sticks and stones make good bones.</p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: _.get(state, 'app.user'),
  }
}

export default connect(mapStateToProps)(LoginPage);
