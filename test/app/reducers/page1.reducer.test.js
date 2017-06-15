import reducer from '../../../app/reducers/page1.reducer';
import * as types from '../../../app/constants/action-types';

describe('the page1 reducer', () => {
  let state;

  it('should exist', () => {
    expect(reducer).toBeDefined();
  });

  it('should have the correct initial state', () => {
    expect(reducer(undefined, {})).toEqual({
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
      expect(
        reducer(state, {
          type: types.LOADING_PAGE_1_DATA,
        }),
      ).toEqual({
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
      expect(
        reducer(state, {
          type: types.LOADING_PAGE_1_DATA_ERROR,
          error: 'bad',
        }),
      ).toEqual({
        loading: false,
        error: 'bad',
        data: null,
        dataAlreadyLoaded: 'no',
      });
    });

    it('should handle PAGE_1_DATA_LOADED', () => {
      expect(
        reducer(state, {
          type: types.PAGE_1_DATA_LOADED,
          data: { a: 1 },
        }),
      ).toEqual({
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
      expect(
        reducer(state, {
          type: types.PAGE_1_DATA_ALREADY_LOADED,
        }),
      ).toEqual({
        loading: false,
        error: null,
        data: { a: 1 },
        dataAlreadyLoaded: 'yes',
      });
    });
  });
});
