import { push } from 'react-router-redux';

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
