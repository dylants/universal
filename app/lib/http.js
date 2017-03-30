import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';

import config from '../config';

export const FETCH_DEFAULT_OPTIONS = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
};

export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function isUnauthorized(error) {
  if (error.response && error.response.status === 401) {
    return true;
  }
  return false;
}

export function sendToLogin(dispatch) {
  dispatch(push('/'));
}

export function handleHttpError(dispatch, error, errorAction, ...args) {
  if (isUnauthorized(error)) {
    sendToLogin(dispatch);
  } else {
    dispatch(errorAction(error, ...args));
  }
}

export function localRequest(uri, options) {
  let url = uri;

  /*
   * When running this code on the client (browser), we use a version
   * of fetch that allows relative URLs. However, when running on the
   * server, this uses `node-fetch` which requires a fully qualified
   * URL. Use `localhost` to at least not leave the machine.
   */
  if (typeof window === 'undefined') {
    url = `http://localhost:${config.port}${uri}`;
  }

  return fetch(url, options);
}
