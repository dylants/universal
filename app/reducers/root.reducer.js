import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import page1Reducer from './page1.reducer';

export default combineReducers({
  routing,
  page1State: page1Reducer,
});
