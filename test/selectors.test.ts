import * as selectors from 'selectors';
import {
  createAsyncThunk,
  createReducer,
  configureStore,
} from '@reduxjs/toolkit';
import { getInitialState } from 'state';
import { getDefaultStatus } from 'utils';
import { handlePending, handleFulfilled, handleRejected } from 'reducers';
import { AsyncStatus } from 'types';
import flushPromises from 'flush-promises';

describe('selectStatus', () => {
  it('select the default status if there is no previous requests', () => {
    const thunk = createAsyncThunk('example thunk', async () => {});
    const store = configureStore({ reducer: () => getInitialState({}) });

    const status = selectors.selectStatus(store.getState(), thunk);
    expect(status).toEqual(getDefaultStatus(thunk.typePrefix));
  });

  it('select the current status if a thunk has been dispatched', async () => {
    const thunk = createAsyncThunk('example thunk', async () => {});
    const store = configureStore({
      reducer: createReducer(getInitialState({}), {
        [thunk.pending.type]: handlePending(thunk),
        [thunk.fulfilled.type]: handleFulfilled(thunk),
        [thunk.rejected.type]: handleRejected(thunk),
      }),
    });

    store.dispatch(thunk());
    await flushPromises();

    const status = selectors.selectStatus(store.getState(), thunk);
    const result: Partial<AsyncStatus> = {
      name: thunk.typePrefix,
      error: undefined,
      loaded: true,
      loading: false,
    };
    expect(status).toEqual(expect.objectContaining(result));
  });
});
