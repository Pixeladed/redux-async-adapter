import createAsyncAdapter from '../../src/index';
import { AsyncState } from '../../src/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDefaultStatus } from '../../src/utils';

describe('handleReset', () => {
  it('reset the async status to the default state', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: AsyncState<{}> = {
      data: {},
      status: {
        [thunk.typePrefix]: {
          error: undefined,
          lastLoaded: new Date().toISOString(),
          loaded: false,
          loading: true,
          name: thunk.typePrefix,
        },
      },
    };

    adapter.handleReset(thunk)(state);
    expect(state.status?.[thunk.typePrefix]).toStrictEqual(
      getDefaultStatus(thunk.typePrefix)
    );
  });

  it('create a new status if none exist already', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: AsyncState<{}> = {
      data: {},
      status: {},
    };

    adapter.handleReset(thunk)(state);
    expect(state.status?.[thunk.typePrefix]).toStrictEqual(
      getDefaultStatus(thunk.typePrefix)
    );
  });

  it('creates a status state object is none exist', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('thunk', () => {});

    const state: Partial<AsyncState<{}>> = {
      data: {},
    };

    adapter.handleReset(thunk)(state);
    expect(state.status?.[thunk.typePrefix]).toBeTruthy();
  });
});
