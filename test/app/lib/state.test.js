import should from 'should';
import * as stateLib from '../../../app/lib/state';

describe('state lib', () => {
  it('should exist', () => {
    should.exist(stateLib);
  });

  describe('generateNewState', () => {
    it('should update state correctly when updates are necessary', () => {
      const state = { a: 1, b: 2, c: 3 };
      const updates = { b: 4 };
      should(stateLib.generateNewState(state, updates)).deepEqual({
        a: 1,
        b: 4,
        c: 3,
      });
    });

    it('should update state correctly when additions are necessary', () => {
      const state = { a: 1, b: 2, c: 3 };
      const updates = { d: 4 };
      should(stateLib.generateNewState(state, updates)).deepEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      });
    });

    it('should update state correctly when no updates are necessary', () => {
      const state = { a: 1, b: 2, c: 3 };
      const updates = {};
      should(stateLib.generateNewState(state, updates)).deepEqual({
        a: 1,
        b: 2,
        c: 3,
      });
    });
  });
});
