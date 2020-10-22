import { AsyncStatus, HandlerHook } from './types';
import { SerializedError } from '@reduxjs/toolkit';

export const getDefaultStatus = (typePrefix: string): AsyncStatus => ({
  name: typePrefix,
  error: undefined,
  lastLoaded: undefined,
  loaded: false,
  loading: false,
});

export const getMatchingSerializedError = (error: Error) => {
  const data: Partial<SerializedError> = {
    message: error.message,
    name: error.name,
    stack: error.stack,
  };
  return expect.objectContaining(data);
};

export const processStatusWithHook = (
  status: AsyncStatus,
  hook: HandlerHook | undefined | null,
  action?: Parameters<HandlerHook>[0]
) => {
  if (hook) {
    return (hook as Function)(action, status);
  } else {
    return status;
  }
};
