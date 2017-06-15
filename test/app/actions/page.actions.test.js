import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as types from '../../../app/constants/action-types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const HTTP_LIB_PATH = '../../../app/lib/http';
const MODULE_PATH = '../../../app/actions/page.actions';

function mockActions(localRequest) {
  const httpLib = require(HTTP_LIB_PATH);
  jest.resetModules();
  jest.setMock(HTTP_LIB_PATH, ({
    ...httpLib,
    localRequest,
  }));
}

describe('page actions', () => {
  let pageActions;

  beforeEach(() => {
    pageActions = require(MODULE_PATH);
  });

  describe('loadPage1Data', () => {
    let store;

    beforeEach(() => {
      store = mockStore({
        page1State: {},
      });
    });

    describe('when the status is 200', () => {
      beforeEach(() => {
        mockActions(() =>
          new Promise(resolve => resolve({
            status: 200,
            json: () => ({
              data: { page: 1 },
            }),
          })),
        );
        pageActions = require(MODULE_PATH);
      });

      describe('when data does not already exist', () => {
        it('should dispatch properly', () =>
          store.dispatch(pageActions.loadPage1Data())
          .then(() => {
            const actions = store.getActions();
            expect(actions.length).toBe(2);
            expect(actions).toEqual([{
              type: types.LOADING_PAGE_1_DATA,
            }, {
              type: types.PAGE_1_DATA_LOADED,
              data: { page: 1 },
            }]);
          }),
        );
      });

      describe('when data already exists', () => {
        beforeEach(() => {
          store = mockStore({
            page1State: {
              data: { a: 1 },
            },
          });
        });

        it('should dispatch properly', () =>
          store.dispatch(pageActions.loadPage1Data())
          .then(() => {
            const actions = store.getActions();
            expect(actions.length).toBe(1);
            expect(actions).toEqual([{
              type: types.PAGE_1_DATA_ALREADY_LOADED,
            }]);
          }),
        );
      });
    });

    describe('when the status is 500', () => {
      beforeEach(() => {
        mockActions(() =>
          new Promise(resolve => resolve({
            status: 500,
            json: () => ({
              error: 'bad',
            }),
          })),
        );
        pageActions = require(MODULE_PATH);
      });

      it('should dispatch properly', () =>
        store.dispatch(pageActions.loadPage1Data())
        .then(() => {
          const actions = store.getActions();
          expect(actions.length).toBe(2);
          expect(actions[0]).toEqual({
            type: types.LOADING_PAGE_1_DATA,
          });
          expect(actions[1].type).toBe(types.LOADING_PAGE_1_DATA_ERROR);
        }),
      );
    });
  });

  describe('dispatchToPage1', () => {
    let store;

    beforeEach(() => {
      store = mockStore();
    });

    it('should dispatch properly', () =>
      store.dispatch(pageActions.dispatchToPage1())
      .then(() => {
        const actions = store.getActions();
        expect(actions.length).toBe(1);
        expect(actions[0].payload.args).toEqual(['/page1']);
      }),
    );
  });
});
