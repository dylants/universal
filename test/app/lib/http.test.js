import should from 'should';

describe('Http library', () => {
  let httpLib;

  beforeEach(() => {
    httpLib = require('../../../app/lib/http');
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
});
