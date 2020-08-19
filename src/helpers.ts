import { AsyncStatus } from 'types';

export const getDefaultStatus = (typePrefix: string): AsyncStatus => ({
  name: typePrefix,
  error: undefined,
  lastLoaded: undefined,
  loaded: false,
  loading: false,
});
