import { SerializedError } from '@reduxjs/toolkit';

export interface AsyncState<T> {
  status: { [name: string]: AsyncStatus | undefined };
  data: T;
}

export interface AsyncStatus {
  name: string;
  loading: boolean;
  loaded: boolean;
  error: SerializedError | undefined;
  lastLoaded: Date | undefined;
}
