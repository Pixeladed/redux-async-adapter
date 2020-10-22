import { configureStore } from '@reduxjs/toolkit';
import createAsyncAdapter from '../../src/index';

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
});
