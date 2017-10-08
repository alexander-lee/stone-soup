import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import _ from 'lodash';

import { login, createUser } from '../actions/user-actions';
import Toast from '../components/Toast';

import s from '../styles/LoginPage.scss';

class LoginPage extends Component {

  static propTypes = {
    createUserError: PropTypes.bool,
    user: PropTypes.object,
  };

  static defaultProps = {
    createUserError: false
  };

  state = {
    isLoggingIn: false,
  };

  componentDidMount() {
    if(this.props.user.loggedIn) {
      this.props.dispatch(push('/'));
    }
  }

  onLogin = () => {
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    this.props.dispatch(login(username, password));
  };

  onCreate = () => {
    const username = this.refs.username.value;
    const password = this.refs.password.value;

    this.props.dispatch(createUser(username, password));
  };

  render() {
    const { createUserError, loginUserError } = this.props.user;
    // Do something UI related in both cases
    console.log(createUserError, loginUserError)
    let message;
    if (createUserError) {
      message = 'Error creating user!';
    }
    if (this.props.user.loginUserError) {
      message = 'Invalid credentials!';
    }
    return (
      <div className={s.container}>
        <div className={s.loginContainer}>
          <img src="images/stonesoup.svg" />
          <p>Participate</p>
          <input type="text" placeholder="Username" ref="username" />
          <input type="password" placeholder="Password" ref="password" />
          <button className={s.loginButton} onClick={this.onLogin}>Login</button>
          <button onClick={this.onCreate}>Create Account</button>
        </div>
        <div className={s.imageContainer}>
          <img src="images/landing.jpg" />
          <div className={s.imageContent}>
              <h1>Stone Soup</h1>
              <p>sticks and stones make good bones.</p>
          </div>
        </div>
        <Toast message={message} shouldDisplay={createUserError || loginUserError }/>
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
