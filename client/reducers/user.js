import {
  LOGIN_USER
} from '../actions/user-actions';

const initialState = {
  loggedIn: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    // case GET_USER:
    //   return {
    //     loggedIn: Boolean(action.user),
    //     ...action.user,
    //   };
    case LOGIN_USER:
      return {
        loggedIn: true,
        ...action.user
      };
    default:
      return state;
  }
}
