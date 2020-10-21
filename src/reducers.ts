import { AsyncThunk } from '@reduxjs/toolkit';
import { AsyncState, AsyncStatus } from './types';
import { getDefaultStatus } from './utils';
import { getSettings } from './settings';

/**
 * Handle async status updates for an async thunk pending action
 */
export const handlePending = <Data, Returned, ThunkArg, ThunkApiConfig>(
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => (state: Partial<AsyncState<Data>>) => {
  if (!state.status) {
    state.status = {};
  }

  const { typePrefix } = asyncThunk;
  const currentStatus =
    state.status[typePrefix] || getDefaultStatus(typePrefix);
  const newStatus: AsyncStatus = {
    ...currentStatus,
    error: undefined,
    loaded: false,
    loading: true,
  };

  state.status[typePrefix] = newStatus;
};

/**
 * Handle async status updates for an async thunk fulfilled action
 */
export const handleFulfilled = <Data, Returned, ThunkArg, ThunkApiConfig>(
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => (state: Partial<AsyncState<Data>>) => {
  if (!state.status) {
    state.status = {};
  }

  const { typePrefix } = asyncThunk;
  const currentStatus =
    state.status[typePrefix] || getDefaultStatus(typePrefix);
  const newStatus: AsyncStatus = {
    ...currentStatus,
    error: undefined,
    loaded: true,
    loading: false,
    lastLoaded: new Date().toISOString(),
  };

  state.status[typePrefix] = newStatus;
};

/**
 * Handle async status updates for an async thunk rejected action
 */
export const handleRejected = <Data, Returned, ThunkArg, ThunkApiConfig>(
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
  const settings = getSettings();
  const error = settings.usePayloadAsError ? action.payload : action.error;

  const newStatus: AsyncStatus = {
    ...currentStatus,
    error,
    loaded: false,
    loading: false,
  };

  state.status[typePrefix] = newStatus;
};

/**
 * Reset the status of an async thunk
 */
export const handleReset = <Data, Returned, ThunkArg, ThunkApiConfig>(
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => (state: Partial<AsyncState<Data>>) => {
  if (!state.status) {
    state.status = {};
  }

  const { typePrefix } = asyncThunk;
  const newStatus = getDefaultStatus(typePrefix);
  state.status[typePrefix] = newStatus;
};

/**
 * Reset the status of all async thunks
 */
export const resetAllStatuses = <Data>(state: Partial<AsyncState<Data>>) => {
  state.status = {};
};
