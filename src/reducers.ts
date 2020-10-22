import { AsyncThunk, AnyAction } from '@reduxjs/toolkit';
import { AsyncState, AsyncStatus, AsyncAdapterOptions } from './types';
import { getDefaultStatus, processStatusWithHook } from './utils';

/**
 * Handle async status updates for an async thunk pending action
 */
export const createPendingHandler = (options: AsyncAdapterOptions) => <
  Data,
  Returned,
  ThunkArg,
  ThunkApiConfig
>(
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => (
  state: Partial<AsyncState<Data>>,
  action?: ReturnType<typeof asyncThunk['pending']>
) => {
  if (!state.status) {
    state.status = {};
  }

  const { typePrefix } = asyncThunk;
  const currentStatus =
    state.status[typePrefix] || getDefaultStatus(typePrefix);

  const baseStatus: AsyncStatus = {
    ...currentStatus,
    error: undefined,
    loaded: false,
    loading: true,
  };
  const newStatus = processStatusWithHook(
    baseStatus,
    options.onPending,
    action
  );

  state.status[typePrefix] = newStatus;
};

/**
 * Handle async status updates for an async thunk fulfilled action
 */
export const createFulfilledHandler = (options: AsyncAdapterOptions) => <
  Data,
  Returned,
  ThunkArg,
  ThunkApiConfig
>(
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => (
  state: Partial<AsyncState<Data>>,
  action?: ReturnType<typeof asyncThunk['fulfilled']>
) => {
  if (!state.status) {
    state.status = {};
  }

  const { typePrefix } = asyncThunk;
  const currentStatus =
    state.status[typePrefix] || getDefaultStatus(typePrefix);

  const baseStatus: AsyncStatus = {
    ...currentStatus,
    error: undefined,
    loaded: true,
    loading: false,
    lastLoaded: new Date().toISOString(),
  };
  const newStatus = processStatusWithHook(
    baseStatus,
    options.onFulfilled,
    action
  );

  state.status[typePrefix] = newStatus;
};

/**
 * Handle async status updates for an async thunk rejected action
 */
export const createRejectedHandler = (options: AsyncAdapterOptions) => <
  Data,
  Returned,
  ThunkArg,
  ThunkApiConfig
>(
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => (
  state: Partial<AsyncState<Data>>,
  action: ReturnType<typeof asyncThunk['rejected']>
) => {
  if (!state.status) {
    state.status = {};
  }

  const { typePrefix } = asyncThunk;
  const currentStatus =
    state.status[typePrefix] || getDefaultStatus(typePrefix);
  const error = options.usePayloadAsError ? action.payload : action.error;

  const baseStatus: AsyncStatus = {
    ...currentStatus,
    error,
    loaded: false,
    loading: false,
  };
  const newStatus = processStatusWithHook(
    baseStatus,
    options.onRejected,
    action
  );

  state.status[typePrefix] = newStatus;
};

/**
 * Reset the status of an async thunk
 */
export const createResetHandler = (options: AsyncAdapterOptions) => <
  Data,
  Returned,
  ThunkArg,
  ThunkApiConfig
>(
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => (state: Partial<AsyncState<Data>>, action?: AnyAction) => {
  if (!state.status) {
    state.status = {};
  }

  const { typePrefix } = asyncThunk;
  const baseStatus = getDefaultStatus(typePrefix);
  const newStatus = processStatusWithHook(baseStatus, options.onReset, action);
  state.status[typePrefix] = newStatus;
};

/**
 * Reset the status of all async thunks
 */
export const resetAllStatuses = <Data>(state: Partial<AsyncState<Data>>) => {
  state.status = {};
};
