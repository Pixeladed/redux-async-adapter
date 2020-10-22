import { SerializedError, AsyncThunk, AnyAction } from '@reduxjs/toolkit';

export interface AsyncAdapterOptions {
  usePayloadAsError?: boolean;
  onPending?: PendingHandlerHook;
  onFulfilled?: FulfilledHandlerHook;
  onRejected?: RejectedHandlerHook;
  onReset?: ResetHandlerHook;
}

export interface AsyncState<T> {
  status: { [name: string]: AsyncStatus | undefined };
  data: T;
}

export interface BaseAsyncStatus {
  name: string;
  loading: boolean;
  loaded: boolean;
  error: SerializedError | any | undefined;
  lastLoaded: string | undefined;
}

export type AsyncStatus = BaseAsyncStatus & { [key: string]: any };

export type PendingHandlerHook = (
  action: ReturnType<AsyncThunk<any, any, any>['pending']>,
  status: AsyncStatus
) => AsyncStatus;

export type FulfilledHandlerHook = (
  action: ReturnType<AsyncThunk<any, any, any>['fulfilled']>,
  status: AsyncStatus
) => AsyncStatus;

export type RejectedHandlerHook = (
  action: ReturnType<AsyncThunk<any, any, any>['rejected']>,
  status: AsyncStatus
) => AsyncStatus;

export type ResetHandlerHook = (
  action: AnyAction,
  status: AsyncStatus
) => AsyncStatus;

export type HandlerHook =
  | PendingHandlerHook
  | FulfilledHandlerHook
  | RejectedHandlerHook
  | ResetHandlerHook;
