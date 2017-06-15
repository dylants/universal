import * as stateLib from '../../../app/lib/state';

describe('state lib', () => {
  it('should exist', () => {
    expect(stateLib).toBeDefined();
  });

  describe('generateNewState', () => {
    it('should update state correctly when updates are necessary', () => {
      const state = { a: 1, b: 2, c: 3 };
      const updates = { b: 4 };
      expect(stateLib.generateNewState(state, updates)).toEqual({
        a: 1,
        b: 4,
        c: 3,
      });
    });

    it('should update state correctly when additions are necessary', () => {
      const state = { a: 1, b: 2, c: 3 };
      const updates = { d: 4 };
      expect(stateLib.generateNewState(state, updates)).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      });
    });

    it('should update state correctly when no updates are necessary', () => {
      const state = { a: 1, b: 2, c: 3 };
      const updates = {};
      expect(stateLib.generateNewState(state, updates)).toEqual({
        a: 1,
        b: 2,
        c: 3,
      });
    });
  });
});
