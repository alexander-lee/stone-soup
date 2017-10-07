import {
  GET_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
} from '../actions/user-actions';

const initialState = {
  loggedIn: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_USER:
      return {
        ...state,
        ...action.user,
        id: action.user._id,
        loggedIn: Boolean(action.user),
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        ...action.user,
        id: action.user._id,
        loggedIn: true,
        loginUserError: false,
      };
    case LOGIN_USER_ERROR:
      return {
        ...state,
        loginUserError: true,
        loggedIn: false,
      }
    case CREATE_USER_ERROR:
      return {
        ...state,
        createUserError: true,
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        createUserError: false,
      };
    default:
      return state;
  }
}
