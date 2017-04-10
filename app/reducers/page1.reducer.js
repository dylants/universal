import { generateNewState } from '../lib/state';
import {
  LOADING_PAGE_1_DATA,
  LOADING_PAGE_1_DATA_ERROR,
  PAGE_1_DATA_LOADED,
  PAGE_1_DATA_ALREADY_LOADED,
} from '../constants/action-types';

const initialState = {
  loading: true,
  error: null,
  data: null,
  dataAlreadyLoaded: 'no',
};

export default function pageReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_PAGE_1_DATA:
      return generateNewState(state, {
        loading: true,
        error: null,
      });
    case LOADING_PAGE_1_DATA_ERROR:
      return generateNewState(state, {
        loading: false,
        error: action.error,
      });
    case PAGE_1_DATA_LOADED:
      return generateNewState(state, {
        loading: false,
        data: action.data,
      });
    case PAGE_1_DATA_ALREADY_LOADED:
      return generateNewState(state, {
        dataAlreadyLoaded: 'yes',
      });
    default:
      return state;
  }
}
