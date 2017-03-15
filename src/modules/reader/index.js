// @flow

type StateType = {
  _id: ?string,
  files: string[],
  isLoading: boolean,
  progress: ?number,
  error: ?string,
};

export const defaultState: StateType = {
  _id: null,
  files: null,
  isLoading: false,
  progress: null,
  error: null,
};

export function reducer(state: StateType = defaultState, action: ActionType) {
  switch (action.type) {
    default:
      return state;
  }
}
