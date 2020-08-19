import createAsyncAdapter from '../../src/index';
import {
  configureStore,
  createAsyncThunk,
  createReducer,
} from '@reduxjs/toolkit';
import flushPromises from 'flush-promises';

describe('selectAllFinished', () => {
  it('returns true if there are no dispatched thunks', () => {
    const adapter = createAsyncAdapter();
    const store = configureStore({
      reducer: () => adapter.getInitialState({}),
    });

    const result = adapter.getSelectors().selectAllFinished(store.getState());
    expect(result).toBe(true);
  });

  it('returns true if all thunks are finished', async () => {
    const adapter = createAsyncAdapter();
    const thunk1 = createAsyncThunk('thunk1', () => {});
    const thunk2 = createAsyncThunk('thunk2', () => {});

    const store = configureStore({
      reducer: createReducer(adapter.getInitialState({}), {
        [thunk1.pending.type]: adapter.handlePending(thunk1),
        [thunk1.fulfilled.type]: adapter.handleFulfilled(thunk1),
        [thunk1.rejected.type]: adapter.handleRejected(thunk1),
        [thunk2.pending.type]: adapter.handlePending(thunk2),
        [thunk2.fulfilled.type]: adapter.handleFulfilled(thunk2),
        [thunk2.rejected.type]: adapter.handleRejected(thunk2),
      }),
    });

    store.dispatch(thunk1());
    store.dispatch(thunk2());
    await flushPromises();

    const result = adapter.getSelectors().selectAllFinished(store.getState());
    expect(result).toBe(true);
  });

  it('returns false if there is a thunk loading', async () => {
    const adapter = createAsyncAdapter();
    const thunk1 = createAsyncThunk(
      'thunk1',
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    const thunk2 = createAsyncThunk('thunk2', () => {});

    const store = configureStore({
      reducer: createReducer(adapter.getInitialState({}), {
        [thunk1.pending.type]: adapter.handlePending(thunk1),
        [thunk1.fulfilled.type]: adapter.handleFulfilled(thunk1),
        [thunk1.rejected.type]: adapter.handleRejected(thunk1),
        [thunk2.pending.type]: adapter.handlePending(thunk2),
        [thunk2.fulfilled.type]: adapter.handleFulfilled(thunk2),
        [thunk2.rejected.type]: adapter.handleRejected(thunk2),
      }),
    });

    store.dispatch(thunk1());
    store.dispatch(thunk2());

    const result = adapter.getSelectors().selectAllFinished(store.getState());
    expect(result).toBe(false);

    await flushPromises();
  });

  it('returns false if all thunks are loading', async () => {
    const adapter = createAsyncAdapter();
    const thunk1 = createAsyncThunk(
      'thunk1',
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    const thunk2 = createAsyncThunk(
      'thunk2',
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    const store = configureStore({
      reducer: createReducer(adapter.getInitialState({}), {
        [thunk1.pending.type]: adapter.handlePending(thunk1),
        [thunk1.fulfilled.type]: adapter.handleFulfilled(thunk1),
        [thunk1.rejected.type]: adapter.handleRejected(thunk1),
        [thunk2.pending.type]: adapter.handlePending(thunk2),
        [thunk2.fulfilled.type]: adapter.handleFulfilled(thunk2),
        [thunk2.rejected.type]: adapter.handleRejected(thunk2),
      }),
    });

    store.dispatch(thunk1());
    store.dispatch(thunk2());

    const result = adapter.getSelectors().selectAllFinished(store.getState());
    expect(result).toBe(false);

    await flushPromises();
  });
});
