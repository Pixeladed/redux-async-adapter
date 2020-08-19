import {
  createAsyncThunk,
  createReducer,
  configureStore,
} from '@reduxjs/toolkit';
import { AsyncStatus } from 'types';
import flushPromises from 'flush-promises';
import createAsyncAdapter from 'index';

describe('selectAllStatuses', () => {
  it('should return empty array if no thunks have been dispatched', () => {
    const adapter = createAsyncAdapter();
    const store = configureStore({
      reducer: () => adapter.getInitialState({}),
    });
    const statuses = adapter.getSelectors().selectAllStatuses(store.getState());
    expect(statuses.length).toBe(0);
  });

  it('should return all statuses of dispatched thunks', async () => {
    const adapter = createAsyncAdapter();
    const thunk1 = createAsyncThunk('thunk 1', async () => {});
    const thunk2 = createAsyncThunk('thunk 2', async () => {});
    const thunk3 = createAsyncThunk('thunk 3', async () => {});

    const store = configureStore({
      reducer: createReducer(adapter.getInitialState({}), {
        [thunk1.pending.type]: adapter.handlePending(thunk1),
        [thunk1.fulfilled.type]: adapter.handleFulfilled(thunk1),
        [thunk1.rejected.type]: adapter.handleRejected(thunk1),
        [thunk2.pending.type]: adapter.handlePending(thunk2),
        [thunk2.fulfilled.type]: adapter.handleFulfilled(thunk2),
        [thunk2.rejected.type]: adapter.handleRejected(thunk2),
        [thunk3.pending.type]: adapter.handlePending(thunk3),
        [thunk3.fulfilled.type]: adapter.handleFulfilled(thunk3),
        [thunk3.rejected.type]: adapter.handleRejected(thunk3),
      }),
    });

    store.dispatch(thunk1());
    store.dispatch(thunk2());
    store.dispatch(thunk3());
    await flushPromises();

    const statuses = adapter.getSelectors().selectAllStatuses(store.getState());
    const getResult = (name: string): Partial<AsyncStatus> =>
      expect.objectContaining({
        name,
        error: undefined,
        loaded: true,
        loading: false,
      });
    const result = [
      getResult(thunk1.typePrefix),
      getResult(thunk2.typePrefix),
      getResult(thunk3.typePrefix),
    ];

    expect(statuses).toStrictEqual(result);
  });
});
