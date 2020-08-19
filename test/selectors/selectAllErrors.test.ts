import {
  createAsyncThunk,
  createReducer,
  configureStore,
} from '@reduxjs/toolkit';
import createAsyncAdapter from '../../src/index';
import { getMatchingSerializedError } from '../../src/utils';

describe('selectAllErrors', () => {
  it('should return an empty array if no thunks have been dispatched', () => {
    const adapter = createAsyncAdapter();
    const store = configureStore({
      reducer: () => adapter.getInitialState({}),
    });
    const result = adapter.getSelectors().selectAllErrors(store.getState());
    expect(result.length).toBe(0);
  });

  it('should 1 error if there is 1 rejected thunk', () => {
    const adapter = createAsyncAdapter();
    const error = new Error();
    const thunk1 = createAsyncThunk('thunk 1', () => {
      throw error;
    });

    const store = configureStore({
      reducer: createReducer(adapter.getInitialState({}), {
        [thunk1.pending.type]: adapter.handlePending(thunk1),
        [thunk1.fulfilled.type]: adapter.handleFulfilled(thunk1),
        [thunk1.rejected.type]: adapter.handleRejected(thunk1),
      }),
    });

    store.dispatch(thunk1());

    const result = adapter.getSelectors().selectAllErrors(store.getState());
    expect(result).toEqual([getMatchingSerializedError(error)]);
  });

  it('should 1 error if there is a rejected thunk and a finished thunk', () => {
    const adapter = createAsyncAdapter();
    const error = new Error();
    const thunk1 = createAsyncThunk('thunk 1', () => {
      throw error;
    });
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

    const result = adapter.getSelectors().selectAllErrors(store.getState());
    expect(result).toEqual([getMatchingSerializedError(error)]);
  });

  it('should return all failed errors', () => {
    const adapter = createAsyncAdapter();
    const error = new Error();
    const thunk1 = createAsyncThunk('thunk1', () => {
      throw error;
    });
    const thunk2 = createAsyncThunk('thunk2', () => {
      throw error;
    });

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

    const result = adapter.getSelectors().selectAllErrors(store.getState());
    expect(result).toEqual([
      getMatchingSerializedError(error),
      getMatchingSerializedError(error),
    ]);
  });
});
