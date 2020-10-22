import { SerializedError } from '@reduxjs/toolkit';

export interface AsyncAdapterOptions {
  usePayloadAsError?: boolean;
  onPending?: HandlerHook;
  onFulfilled?: HandlerHook;
  onRejected?: HandlerHook;
  onReset?: HandlerHook;
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

export type HandlerHook = <I extends AsyncStatus, O extends I>(status: I) => O;
