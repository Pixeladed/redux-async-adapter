import createAsyncAdapter from 'index';
import { AsyncState } from 'types';
import { createAsyncThunk } from '@reduxjs/toolkit';

describe('handlePending', () => {
  it('adds a new status if none exists', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: AsyncState<{}> = {
      data: {},
      status: {},
    };

    adapter.handlePending(thunk)(state);
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

    adapter.handlePending(thunk)(state);
    expect(state.status[thunk.typePrefix]?.error).toBe(undefined);
  });

  it('should set loading to true', () => {
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

    adapter.handlePending(thunk)(state);
    expect(state.status[thunk.typePrefix]?.loading).toBe(true);
  });

  it('should set loaded to false', () => {
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

    adapter.handlePending(thunk)(state);
    expect(state.status[thunk.typePrefix]?.loaded).toBe(false);
  });

  it('should not change lastLoaded field', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});
    const lastLoaded = new Date().toISOString();

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          name: thunk.typePrefix,
          error: { name: 'Error' },
          loading: false,
          loaded: false,
          lastLoaded: lastLoaded,
        },
      },
    };

    adapter.handlePending(thunk)(state);
    expect(state.status[thunk.typePrefix]?.lastLoaded).toBe(lastLoaded);
  });
});
