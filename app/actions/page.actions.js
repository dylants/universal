import fetch from 'isomorphic-fetch';

import {
  FETCH_DEFAULT_OPTIONS,
  checkHttpStatus,
  handleHttpError,
} from '../lib/http';
import {
  LOADING_PAGE_1_DATA,
  LOADING_PAGE_1_DATA_ERROR,
  PAGE_1_DATA_LOADED,
  PAGE_1_DATA_ALREADY_LOADED,
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

function page1DataAlreadyLoaded() {
  return {
    type: PAGE_1_DATA_ALREADY_LOADED,
  };
}

export function loadPage1Data() {
  return (dispatch, getState) => {
    const { page1State } = getState();
    const { data } = page1State;
    if (data) {
      return new Promise(resolve =>
        resolve(dispatch(page1DataAlreadyLoaded())),
      );
    }

    dispatch(loadingPage1Data());

    const uri = 'http://localhost:3000/api/page/1';
    const options = Object.assign({}, FETCH_DEFAULT_OPTIONS, {
      method: 'GET',
    });

    return fetch(uri, options)
      .then(checkHttpStatus)
      .then(checkHttpStatus)
      .then(response => response.json())
      .then(response => dispatch(page1DataLoaded(response.data)))
      .catch(error => handleHttpError(dispatch, error, loadingPage1DataError));
  };
}
