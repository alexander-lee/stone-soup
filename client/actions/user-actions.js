import { push } from 'react-router-redux';
import _ from 'lodash';
import Cookies from 'cookies-js';
import fetcher from '../utils/fetcher';

/**
- Constants
**/
export const GET_USER = 'GET_USER';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';
export const EDIT_USER_ERROR = 'EDIT_USER_ERROR';

export function getUser() {
  return async function(dispatch, getState) {
    const body = await fetcher.get(`/api/user`);

    if (body.user) {
      const location = Cookies.get('location');
      Cookies.expire('location');

      dispatch({
        type: GET_USER,
        user: body.user
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
    };

    const response = await fetcher.post('/login', { body }, dispatch);
    if (response.error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        error: response.error,
      });
    } else {
      dispatch({
        type: LOGIN_USER_SUCCESS,
        restaurant: response.user,
      });
    }
  }
}

export function createUser(username, password) {
  return async function(dispatch) {
    const body = {
      username,
      password
    };

    const response = await fetcher.post('/api/restaurant/create', { body }, dispatch);
    if (response.error) {
      dispatch({
        type: CREATE_USER_ERROR,
        error: response.error,
      });
    } else {
      dispatch({
        type: CREATE_USER_SUCCESS,
        restaurant: response.restaurant,
      });
    }
  }
}

export const editUser = (userId, location, name, pickupTimes, dietaryRestrictions) => {
  return async(dispatch) => {
    const body = {
      location,
      name,
      pickupTimes,
      dietaryRestrictions,
    };
    console.log(userId, location, name, pickupTimes, dietaryRestrictions);

    const response = await fetcher.put(`/api/restaurant/edit/${userId}`, { body }, dispatch);
    if (response.error) {
      dispatch({
        type: EDIT_USER_ERROR,
        error: response.error,
      });
    } else {
      dispatch({
        type: EDIT_USER_SUCCESS,
        restaurant: response.restaurant,
      });
    }
  }
}
