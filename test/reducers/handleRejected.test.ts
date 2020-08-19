import createAsyncAdapter from 'index';
import { AsyncState } from 'types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMatchingSerializedError } from 'utils';

describe('handleRejected', () => {
  it('adds a new status if none exists', () => {
    const adapter = createAsyncAdapter();
    const error = new Error();
    const thunk = createAsyncThunk('thunk', () => {});
    const action = thunk.rejected(error, 'request id');

    const state: AsyncState<{}> = {
      data: {},
      status: {},
    };

    adapter.handleRejected(thunk)(state, action);
    expect(state.status[thunk.typePrefix]).toBeTruthy();
  });

  it('should set error field', () => {
    const adapter = createAsyncAdapter();
    const error = new Error();
    const thunk = createAsyncThunk('thunk', () => {});
    const action = thunk.rejected(error, 'request id');

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: undefined,
          loading: false,
          loaded: false,
          lastLoaded: undefined,
        },
      },
    };

    adapter.handleRejected(thunk)(state, action);
    expect(state.status[thunk.typePrefix]?.error).toEqual(
      getMatchingSerializedError(error)
    );
  });

  it('should set loading to false', () => {
    const adapter = createAsyncAdapter();
    const error = new Error();
    const thunk = createAsyncThunk('thunk', () => {});
    const action = thunk.rejected(error, 'request id');

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: undefined,
          loading: true,
          loaded: false,
          lastLoaded: undefined,
        },
      },
    };

    adapter.handleRejected(thunk)(state, action);
    expect(state.status[thunk.typePrefix]?.loading).toBe(false);
  });

  it('should set loaded to false', () => {
    const adapter = createAsyncAdapter();
    const error = new Error();
    const thunk = createAsyncThunk('thunk', () => {});
    const action = thunk.rejected(error, 'request id');

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: undefined,
          loading: false,
          loaded: true,
          lastLoaded: undefined,
        },
      },
    };

    adapter.handleRejected(thunk)(state, action);
    expect(state.status[thunk.typePrefix]?.loaded).toBe(false);
  });

  it('should not update lastLoaded field', () => {
    const adapter = createAsyncAdapter();
    const error = new Error();
    const thunk = createAsyncThunk('thunk', () => {});
    const action = thunk.rejected(error, 'request id');

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: undefined,
          loading: false,
          loaded: false,
          lastLoaded: undefined,
        },
      },
    };

    adapter.handleRejected(thunk)(state, action);
    expect(state.status[thunk.typePrefix]?.lastLoaded).toBeUndefined();
  });
});
