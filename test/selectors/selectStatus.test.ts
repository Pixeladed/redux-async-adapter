import {
  createAsyncThunk,
  createReducer,
  configureStore,
} from '@reduxjs/toolkit';
import { getDefaultStatus } from '../../src/utils';
import { AsyncStatus } from '../../src/types';
import flushPromises from 'flush-promises';
import createAsyncAdapter from '../../src/index';

describe('selectStatus', () => {
  it('select the default status if there is no previous requests', () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('example thunk', async () => {});
    const store = configureStore({
      reducer: () => adapter.getInitialState({}),
    });

    const status = adapter.getSelectors().selectStatus(thunk)(store.getState());
    expect(status).toEqual(getDefaultStatus(thunk.typePrefix));
  });

  it('select the current status if a thunk has been dispatched', async () => {
    const adapter = createAsyncAdapter();
    const thunk = createAsyncThunk('example thunk', async () => {});
    const store = configureStore({
      reducer: createReducer(adapter.getInitialState({}), {
        [thunk.pending.type]: adapter.handlePending(thunk),
        [thunk.fulfilled.type]: adapter.handleFulfilled(thunk),
        [thunk.rejected.type]: adapter.handleRejected(thunk),
      }),
    });

    store.dispatch(thunk());
    await flushPromises();

    const status = adapter.getSelectors().selectStatus(thunk)(store.getState());
    const result: Partial<AsyncStatus> = {
      name: thunk.typePrefix,
      error: undefined,
      loaded: true,
      loading: false,
    };
    expect(status).toEqual(expect.objectContaining(result));
  });
});
