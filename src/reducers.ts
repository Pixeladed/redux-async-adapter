import { AsyncThunk } from '@reduxjs/toolkit';
import { AsyncState, AsyncStatus } from './types';
import { getDefaultStatus } from './utils';

/**
 * Handle async status updates for an async thunk pending action
 */
export const handlePending = <Data, Returned, ThunkArg, ThunkApiConfig>(
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => (state: AsyncState<Data>) => {
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
) => (state: AsyncState<Data>) => {
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
  state: AsyncState<Data>,
  action: ReturnType<typeof asyncThunk['rejected']>
) => {
  const { typePrefix } = asyncThunk;
  const currentStatus =
    state.status[typePrefix] || getDefaultStatus(typePrefix);
  const newStatus: AsyncStatus = {
    ...currentStatus,
    error: action.error,
    loaded: false,
    loading: false,
  };

  state.status[typePrefix] = newStatus;
};
