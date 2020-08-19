import { AsyncState } from 'types';

export const getInitialState = <T>(initialData: T):AsyncState<T> => ({
  status: {},
  data: initialData
})