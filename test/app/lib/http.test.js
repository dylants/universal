import config from '../../../app/config';

const MODULE_PATH = '../../../app/lib/http';

describe('Http library', () => {
  let httpLib;

  beforeEach(() => {
    httpLib = require(MODULE_PATH);
  });

  it('should exist', () => {
    expect(httpLib).toBeDefined();
  });

  describe('checkHttpStatus', () => {
    let response;

    beforeEach(() => {
      response = {
        a: 1,
      };
    });

    describe('with a response status 200', () => {
      beforeEach(() => {
        response.status = 200;
      });

      it('should return the response', () => {
        expect(httpLib.checkHttpStatus(response)).toEqual(response);
      });
    });

    describe('with a response status 400', () => {
      beforeEach(() => {
        response.status = 400;
      });

      it('should throw an error', () => {
        expect(() => httpLib.checkHttpStatus(response)).toThrow();
      });
    });
  });

  describe('handleHttpError', () => {
    let dispatch;
    let dispatchResult;
    let error;
    let errorAction;

    beforeEach(() => {
      dispatch = (result) => {
        dispatchResult = result;
      };

      error = {
        response: {},
      };

      errorAction = err => err;
    });

    describe('when the error is unauthorized', () => {
      beforeEach(() => {
        error.response.status = 401;
      });

      it('should send to login', () => {
        httpLib.handleHttpError(dispatch, error, errorAction);
        expect(dispatchResult).toBeTruthy();
        expect(dispatchResult.payload.args).toEqual(['/']);
      });
    });

    describe('when the error is NOT unauthorized', () => {
      beforeEach(() => {
        error.response.status = 500;
      });

      it('should send to login', () => {
        httpLib.handleHttpError(dispatch, error, errorAction);
        expect(dispatchResult).toBeTruthy();
        expect(dispatchResult).toBe(error);
      });

      describe('when there are more arguments supplied', () => {
        beforeEach(() => {
          errorAction = (err, x, y, z) => ({
            err,
            x,
            y,
            z,
          });
        });

        it('should send the arguments', () => {
          httpLib.handleHttpError(dispatch, error, errorAction, '1', 2);
          expect(dispatchResult).toBeTruthy();
          expect(dispatchResult).toEqual({
            err: error,
            x: '1',
            y: 2,
            z: undefined,
          });
        });
      });
    });
  });

  describe('localRequest', () => {
    let url;
    let options;

    beforeEach(() => {
      jest.resetModules();
      jest.setMock('isomorphic-fetch', (_url, _options) => {
        url = _url;
        options = _options;
      });
      httpLib = require(MODULE_PATH);
    });

    describe('when the window does not exist (server)', () => {
      it('should work', () => {
        httpLib.localRequest('/a/b', { a: 1 });
        expect(url).toBe(`http://localhost:${config.port}/a/b`);
        expect(options).toEqual({ a: 1 });
      });
    });

    describe('when the window does exist (client)', () => {
      let disableJSDomHook;

      beforeEach(() => {
        // this creates a 'window' which mocks being in the client
        disableJSDomHook = require('jsdom-global')();
      });

      afterEach(() => {
        disableJSDomHook();
      });

      it('should work', () => {
        httpLib.localRequest('/a/b', { a: 1 });
        expect(url).toBe('/a/b');
        expect(options).toEqual({ a: 1 });
      });
    });
  });
});
