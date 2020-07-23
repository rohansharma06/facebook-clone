//---- combine reducer is user  for combine all the reducer into one and send it to other

import { combineReducers } from 'redux';
import posts from './posts';
import auth from './auth';
import profile from './profile';
import friends from './friends';

export default combineReducers({
  posts,
  auth,
  profile,
  friends,
});
