import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../lib/http';
import {
  LOADING_PAGE_1_DATA,
  LOADING_PAGE_1_DATA_ERROR,
  PAGE_1_DATA_LOADED,
} from '../constants/action-types';

function loadingPage1Data() {
  return {
    type: LOADING_PAGE_1_DATA,
  };
}

function loadingPage1DataError(error) {
  return {
    type: LOADING_PAGE_1_DATA_ERROR,
    error,
  };
}

function page1DataLoaded(data) {
  return {
    type: PAGE_1_DATA_LOADED,
    data,
  };
}

export function loadPage1Data() {
  return (dispatch) => {
    dispatch(loadingPage1Data());

    const uri = '/api/page/1';
    const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
      method: 'GET',
    });

    return fetch(uri, options) // eslint-disable-line
      .then(checkHttpStatus)
      .then(checkHttpStatus)
      .then(response => response.json())
      .then(response => dispatch(page1DataLoaded(response.data)))
      .catch(error => handleHttpError(dispatch, error, loadingPage1DataError));
  };
}
