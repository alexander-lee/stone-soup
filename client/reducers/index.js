import { combineReducers } from 'redux';

import user from './user';
import restaurant from './restaurant';

export default combineReducers({ user, restaurant });
