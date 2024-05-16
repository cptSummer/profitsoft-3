import { combineReducers } from 'redux';

import user from './user';
import photo from './photo';

export default combineReducers({
  user,
  photo
});
