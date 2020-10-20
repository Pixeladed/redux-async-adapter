import * as selectors from './selectors';
import * as reducers from './reducers';
import { getInitialState } from './state';

const createAsyncAdapter = () => ({
  ...reducers,
  getSelectors: () => selectors,
  getInitialState,
});

export * from './types';
export default createAsyncAdapter;
