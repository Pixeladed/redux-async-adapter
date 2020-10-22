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

export interface AsyncStatus {
  name: string;
  loading: boolean;
  loaded: boolean;
  error: SerializedError | any | undefined;
  lastLoaded: string | undefined;
}

export type PendingHandlerHook = <I extends AsyncStatus, O extends I>(
  action: ReturnType<AsyncThunk<any, any, any>['pending']>,
  status: I
) => O;

export type FulfilledHandlerHook = <I extends AsyncStatus, O extends I>(
  action: ReturnType<AsyncThunk<any, any, any>['fulfilled']>,
  status: I
) => O;

export type RejectedHandlerHook = <I extends AsyncStatus, O extends I>(
  action: ReturnType<AsyncThunk<any, any, any>['rejected']>,
  status: I
) => O;

export type ResetHandlerHook = <I extends AsyncStatus, O extends I>(
  action: AnyAction,
  status: I
) => O;

export type HandlerHook =
  | PendingHandlerHook
  | FulfilledHandlerHook
  | RejectedHandlerHook
  | ResetHandlerHook;
