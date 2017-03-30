import should from 'should';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as pageActions from '../../../app/actions/page.actions';
import * as types from '../../../app/constants/action-types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('page actions', () => {
  describe('loadPage1Data', () => {
    const PAGE_DATA_URL = '/api/page/1';
    let store;

    beforeEach(() => {
      store = mockStore();
    });

    afterEach(() => {
      fetchMock.restore();
    });

    describe('when the status is 200', () => {
      beforeEach(() => {
        fetchMock.mock(PAGE_DATA_URL, {
          status: 200,
          body: { data: { page: 1 } },
        });
      });

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

    describe('when the status is 500', () => {
      beforeEach(() => {
        fetchMock.mock(PAGE_DATA_URL, {
          status: 500,
        });
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
});
