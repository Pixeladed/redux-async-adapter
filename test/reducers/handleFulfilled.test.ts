import createAsyncAdapter from '../../src/index';
import { AsyncState } from '../../src/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('handleFulfilled', () => {
  it('adds a new status if none exists', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: AsyncState<{}> = {
      data: {},
      status: {},
    };

    adapter.handleFulfilled(thunk)(state);
    expect(state.status[thunk.typePrefix]).toBeTruthy();
  });

  it('should reset error field', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: { name: 'Error' },
          loading: false,
          loaded: false,
          lastLoaded: undefined,
        },
      },
    };

    adapter.handleFulfilled(thunk)(state);
    expect(state.status[thunk.typePrefix]?.error).toBe(undefined);
  });

  it('should set loading to false', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: { name: 'Error' },
          loading: true,
          loaded: false,
          lastLoaded: undefined,
        },
      },
    };

    adapter.handleFulfilled(thunk)(state);
    expect(state.status[thunk.typePrefix]?.loading).toBe(false);
  });

  it('should set loaded to true', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: { name: 'Error' },
          loading: false,
          loaded: false,
          lastLoaded: undefined,
        },
      },
    };

    adapter.handleFulfilled(thunk)(state);
    expect(state.status[thunk.typePrefix]?.loaded).toBe(true);
  });

  it('should update lastLoaded field', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: { name: 'Error' },
          loading: false,
          loaded: false,
          lastLoaded: undefined,
        },
      },
    };

    adapter.handleFulfilled(thunk)(state);
    expect(
      Date.parse(state.status[thunk.typePrefix]?.lastLoaded!)
    ).toBeTruthy();
  });

  it('creates a status state object is none exist', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: Partial<AsyncState<{}>> = {
      data: {},
    };

    adapter.handleFulfilled(thunk)(state);
    expect(state.status[thunk.typePrefix]).toBeTruthy();
  });
});
