import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import should from 'should';
import thunk from 'redux-thunk';
import * as types from '../../../app/constants/action-types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const MODULE_PATH = '../../../app/actions/page.actions';

function mockActions(localRequest) {
  return proxyquire(MODULE_PATH, {
    '../lib/http': {
      localRequest,
    },
  });
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
        pageActions = mockActions(() =>
          new Promise(resolve => resolve({
            status: 200,
            json: () => ({
              data: { page: 1 },
            }),
          })),
        );
      });

      describe('when data does not already exist', () => {
        it('should dispatch properly', (done) => {
          store.dispatch(pageActions.loadPage1Data())
          .then(() => {
            const actions = store.getActions();
            should(actions.length).equal(2);
            should(actions).deepEqual([{
              type: types.LOADING_PAGE_1_DATA,
            }, {
              type: types.PAGE_1_DATA_LOADED,
              data: { page: 1 },
            }]);
          })
          .then(done)
          .catch(done);
        });
      });

      describe('when data already exists', () => {
        beforeEach(() => {
          store = mockStore({
            page1State: {
              data: { a: 1 },
            },
          });
        });

        it('should dispatch properly', (done) => {
          store.dispatch(pageActions.loadPage1Data())
          .then(() => {
            const actions = store.getActions();
            should(actions.length).equal(1);
            should(actions).deepEqual([{
              type: types.PAGE_1_DATA_ALREADY_LOADED,
            }]);
          })
          .then(done)
          .catch(done);
        });
      });
    });

    describe('when the status is 500', () => {
      beforeEach(() => {
        pageActions = mockActions(() =>
          new Promise(resolve => resolve({
            status: 500,
          })),
        );
      });

      it('should dispatch properly', (done) => {
        store.dispatch(pageActions.loadPage1Data())
        .then(() => {
          const actions = store.getActions();
          should(actions.length).equal(2);
          should(actions[0]).deepEqual({
            type: types.LOADING_PAGE_1_DATA,
          });
          should(actions[1].type).equal(types.LOADING_PAGE_1_DATA_ERROR);
        })
        .then(done)
        .catch(done);
      });
    });
  });

  describe('dispatchToPage1', () => {
    let store;

    beforeEach(() => {
      store = mockStore();
    });

    it('should dispatch properly', (done) => {
      store.dispatch(pageActions.dispatchToPage1())
      .then(() => {
        const actions = store.getActions();
        should(actions.length).equal(1);
        should(actions[0].payload.args).deepEqual(['/page1']);
      })
      .then(done)
      .catch(done);
    });
  });
});
