import { cloneDeep } from 'lodash';

export function generateNewState(state, changes) {
  const updatedState = cloneDeep(state);
  return Object.assign(updatedState, changes);
}
