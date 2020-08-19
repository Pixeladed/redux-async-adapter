import createAsyncAdapter from '../../src/index';
import { AsyncState } from '../../src/types';

describe('getInitialState', () => {
  it('should return the expected state shape', () => {
    const adapter = createAsyncAdapter();
    const result = adapter.getInitialState({});

    const stateShape: AsyncState<{}> = {
      data: {},
      status: {},
    };
    expect(result).toStrictEqual(stateShape);
  });

  it('should preserve initial data', () => {
    const adapter = createAsyncAdapter();
    const initialData = { hello: 'world' };
    const result = adapter.getInitialState(initialData);

    expect(result.data).toStrictEqual(initialData);
  });
});
