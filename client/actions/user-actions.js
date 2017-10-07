// import { push } from 'react-router-redux';
// import _ from 'lodash';
// import Cookies from 'cookies-js';
// import fetcher from '../utils/api-response-helper';

// /**
// - Constants
// **/
// export const GET_USER = 'GET_USER';
// export const GET_EVENTS_FROM_USER = 'GET_EVENTS_FROM_USER';
// export const GET_SCHEDULES_FROM_USER = 'GET_SCHEDULES_FROM_USER';

// export function getUser() {
//   return async function(dispatch, getState) {
//     const response = await fetcher.get('/api/user');
//     const user = response.user;

//     if(user) {
//       const location = Cookies.get('location');
//       Cookies.expire('location');

//       dispatch({
//         type: GET_USER,
//         user
//       });

//       if(location) {
//         dispatch(push(location));
//       }
//     }
//     else {
//       Cookies.set('location', window.location.pathname, { expires: 600 });
//       dispatch(push('/login'));
//     }
//   }
// }
