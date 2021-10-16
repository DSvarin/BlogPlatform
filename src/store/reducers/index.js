import { combineReducers } from 'redux';

import articles from './articles';
import page from './page';
import authentication from './authentication';
import user from './user';

export default combineReducers({
  articles,
  page,
  user,
  authentication,
});
