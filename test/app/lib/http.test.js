import proxyquire from 'proxyquire';
import should from 'should';

import config from '../../../app/config';

const MODULE_PATH = '../../../app/lib/http';

describe('Http library', () => {
  let httpLib;

  beforeEach(() => {
    httpLib = require(MODULE_PATH);
  });

  it('should exist', () => {
    should.exist(httpLib);
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
        should(httpLib.checkHttpStatus(response)).deepEqual(response);
      });
    });

    describe('with a response status 400', () => {
      beforeEach(() => {
        response.status = 400;
      });

      it('should throw an error', () => {
        should.throws(() => httpLib.checkHttpStatus(response));
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
        should(dispatchResult).be.ok();
        should(dispatchResult.payload.args).deepEqual(['/']);
      });
    });

    describe('when the error is NOT unauthorized', () => {
      beforeEach(() => {
        error.response.status = 500;
      });

      it('should send to login', () => {
        httpLib.handleHttpError(dispatch, error, errorAction);
        should(dispatchResult).be.ok();
        should(dispatchResult).equal(error);
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
          should(dispatchResult).be.ok();
          should(dispatchResult).deepEqual({
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
      httpLib = proxyquire(MODULE_PATH, {
        'isomorphic-fetch': (_url, _options) => {
          url = _url;
          options = _options;
        },
      });
    });

    describe('when the window does not exist (server)', () => {
      it('should work', () => {
        httpLib.localRequest('/a/b', { a: 1 });
        should(url).equal(`http://localhost:${config.port}/a/b`);
        should(options).deepEqual({ a: 1 });
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
        should(url).equal('/a/b');
        should(options).deepEqual({ a: 1 });
      });
    });
  });
});
