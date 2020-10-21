import { configureStore } from '@reduxjs/toolkit';
import createAsyncAdapter, { AsyncState } from '../../src/index';

describe('selectData', () => {
  it('select the state data', () => {
    const data = {};
    const adapter = createAsyncAdapter();
    const store = configureStore({
      reducer: () => adapter.getInitialState(data),
    });

    const status = adapter.getSelectors().selectData(store.getState());
    expect(status).toEqual(data);
  });

  it('return undefined if state is malformed', () => {
    const adapter = createAsyncAdapter();
    const state: Partial<AsyncState<{}>> = { status: {} };

    const status = adapter.getSelectors().selectData(state);
    expect(status).toBe(undefined);
  });
});
