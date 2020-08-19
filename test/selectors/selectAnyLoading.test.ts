import {
  createAsyncThunk,
  createReducer,
  configureStore,
} from '@reduxjs/toolkit';
import flushPromises from 'flush-promises';
import createAsyncAdapter from 'index';

describe('selectAnyLoading', () => {
  it('should return false if no thunks have been dispatched', () => {
    const adapter = createAsyncAdapter();
    const store = configureStore({
      reducer: () => adapter.getInitialState({}),
    });
    const result = adapter.getSelectors().selectAnyLoading(store.getState());
    expect(result).toBe(false);
  });

  it('should return true if there is 1 loading async thunk', async () => {
    const adapter = createAsyncAdapter();
    const thunk1 = createAsyncThunk(
      'thunk 1',
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    const store = configureStore({
      reducer: createReducer(adapter.getInitialState({}), {
        [thunk1.pending.type]: adapter.handlePending(thunk1),
        [thunk1.fulfilled.type]: adapter.handleFulfilled(thunk1),
        [thunk1.rejected.type]: adapter.handleRejected(thunk1),
      }),
    });

    store.dispatch(thunk1());

    const result = adapter.getSelectors().selectAnyLoading(store.getState());
    expect(result).toBe(true);

    await flushPromises();
  });

  it('should return true if there is a loading async thunk and a finished thunk', async () => {
    const adapter = createAsyncAdapter();
    const thunk1 = createAsyncThunk(
      'thunk 1',
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

    const result = adapter.getSelectors().selectAnyLoading(store.getState());
    expect(result).toBe(true);

    await flushPromises();
  });

  it('should return false if all thunks are finished', async () => {
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

    const result = adapter.getSelectors().selectAnyLoading(store.getState());
    expect(result).toBe(false);
  });
});
