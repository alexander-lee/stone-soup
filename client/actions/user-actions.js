import { push } from 'react-router-redux';
import _ from 'lodash';
import Cookies from 'cookies-js';
import fetcher from '../utils/fetcher';

/**
- Constants
**/
export const GET_USER = 'GET_USER';
export const LOGIN_USER = 'LOGIN_USER';

export function getUser() {
  return async function(dispatch, getState) {
    const user = Cookies.get('user');

    if (user) {
      const location = Cookies.get('location');
      Cookies.expire('location');

      dispatch({
        type: GET_USER,
        user: JSON.parse(user)
      });

      if(location) {
        dispatch(push(location));
      }
    }
    else {
      Cookies.set('location', window.location.pathname, { expires: 600 });
      dispatch(push('/'))
    }
  }
}

export function login(username, password) {
  return async function(dispatch) {
    const body = {
      username,
      password
    }

    const response = await fetcher.post('/login', { body }, dispatch);

    Cookies.expire('user');
    Cookies.set('user', JSON.stringify(response.user), { expires: 3600 });
    dispatch({
      type: LOGIN_USER,
      user: response.user
    })
  }
}
