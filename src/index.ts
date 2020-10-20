import * as selectors from './selectors';
import * as reducers from './reducers';
import { getInitialState } from './state';
import { AsyncAdapterOptions } from './types';
import { setSettings } from './settings';

const createAsyncAdapter = (options?: Partial<AsyncAdapterOptions>) => {
  if (options) setSettings(options);
  return {
    ...reducers,
    getSelectors: () => selectors,
    getInitialState,
  };
};

export * from './types';
export default createAsyncAdapter;
