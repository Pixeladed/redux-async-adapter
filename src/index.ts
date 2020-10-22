import * as selectors from './selectors';
import {
  createPendingHandler,
  createFulfilledHandler,
  createRejectedHandler,
  createResetHandler,
  resetAllStatuses,
} from './reducers';
import { getInitialState } from './state';
import { AsyncAdapterOptions } from './types';

const defaultOptions: AsyncAdapterOptions = {
  usePayloadAsError: false,
};

const createAsyncAdapter = (options: AsyncAdapterOptions = defaultOptions) => {
  return {
    handlePending: createPendingHandler(options),
    handleFulfilled: createFulfilledHandler(options),
    handleRejected: createRejectedHandler(options),
    handleReset: createResetHandler(options),
    resetAllStatuses,
    getSelectors: () => selectors,
    getInitialState,
  };
};

export * from './types';
export default createAsyncAdapter;
