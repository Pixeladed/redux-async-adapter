import * as selectors from 'selectors';
import * as reducers from 'reducers';
import { getInitialState } from 'state';

const createAsyncAdapter = () => ({
  getInitialState,
  ...reducers,
  getSelectors: () => selectors,
});

export * from 'types';
export default createAsyncAdapter;
