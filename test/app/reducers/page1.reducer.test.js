import should from 'should';

import reducer from '../../../app/reducers/page1.reducer';
import * as types from '../../../app/constants/action-types';

describe('the page1 reducer', () => {
  let state;

  it('should exist', () => {
    should.exist(reducer);
  });

  it('should have the correct initial state', () => {
    should(reducer(undefined, {})).deepEqual({
      loading: true,
      error: null,
      data: null,
      dataAlreadyLoaded: 'no',
    });
  });

  describe('in the initial state', () => {
    beforeEach(() => {
      state = {
        loading: true,
        error: null,
        data: null,
        dataAlreadyLoaded: 'no',
      };
    });

    it('should handle LOADING_PAGE_1_DATA', () => {
      should(
        reducer(state, {
          type: types.LOADING_PAGE_1_DATA,
        }),
      ).deepEqual({
        loading: true,
        error: null,
        data: null,
        dataAlreadyLoaded: 'no',
      });
    });
  });

  describe('in the loading state', () => {
    beforeEach(() => {
      state = {
        loading: true,
        error: null,
        data: null,
        dataAlreadyLoaded: 'no',
      };
    });

    it('should handle LOADING_PAGE_1_DATA_ERROR', () => {
      should(
        reducer(state, {
          type: types.LOADING_PAGE_1_DATA_ERROR,
          error: 'bad',
        }),
      ).deepEqual({
        loading: false,
        error: 'bad',
        data: null,
        dataAlreadyLoaded: 'no',
      });
    });

    it('should handle PAGE_1_DATA_LOADED', () => {
      should(
        reducer(state, {
          type: types.PAGE_1_DATA_LOADED,
          data: { a: 1 },
        }),
      ).deepEqual({
        loading: false,
        error: null,
        data: { a: 1 },
        dataAlreadyLoaded: 'no',
      });
    });
  });

  describe('when data is loaded', () => {
    beforeEach(() => {
      state = {
        loading: false,
        error: null,
        data: { a: 1 },
        dataAlreadyLoaded: 'no',
      };
    });

    it('should handle PAGE_1_DATA_ALREADY_LOADED', () => {
      should(
        reducer(state, {
          type: types.PAGE_1_DATA_ALREADY_LOADED,
        }),
      ).deepEqual({
        loading: false,
        error: null,
        data: { a: 1 },
        dataAlreadyLoaded: 'yes',
      });
    });
  });
});
