import { AsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { AsyncState, AsyncStatus } from 'types';
import { createSelector } from 'reselect';
import { getDefaultStatus } from 'utils';

/**
 * Select the async status for a particular async thunk
 * @param state the async state to select the status from
 * @param asyncThunk the async thunk created by createAsyncThunk
 */
export const selectStatus = <
  Data,
  Returned = unknown,
  ThunkArg = unknown,
  ThunkApiConfig extends {} = {}
>(
  state: AsyncState<Data>,
  asyncThunk: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => {
  const status =
    state.status[asyncThunk.typePrefix] ||
    getDefaultStatus(asyncThunk.typePrefix);
  return status;
};

/**
 * Select all async statuses in the state
 * @param state the async state to select the statuses from
 */
export const selectAllStatuses = <Data>(state: AsyncState<Data>) => {
  const statuses = Object.values(state.status)
    .filter(Boolean)
    .map(status => status!);
  return statuses;
};

/**
 * Return a boolean value for whether any
 * async thunk is currently loading in this state
 * @param state the async state to select the statuses from
 */
export const selectAnyLoading = createSelector<
  AsyncState<any>,
  AsyncStatus[],
  boolean
>(selectAllStatuses, statuses => {
  const isAnyLoading = statuses.some(status => status.loading);
  return isAnyLoading;
});

/**
 * Select all async errors in the state
 * @param state the async state to select the statuses from
 */
export const selectAllErrors = createSelector<
  AsyncState<any>,
  AsyncStatus[],
  SerializedError[]
>(selectAllStatuses, statuses => {
  const errors = statuses
    .map(status => status.error)
    .filter(Boolean)
    .map(error => error!);
  return errors;
});

/**
 * Return whether or not all async actions have finished
 * @param state the async state to select the statuses from
 */
export const selectAllFinished = createSelector<
  AsyncState<any>,
  AsyncStatus[],
  boolean
>(selectAllStatuses, statuses => {
  const loaded = statuses.every(status => status.loaded);
  return loaded;
});
