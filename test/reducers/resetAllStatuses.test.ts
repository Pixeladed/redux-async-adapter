import createAsyncAdapter from '../../src/index';
import { AsyncState } from '../../src/types';
import { getDefaultStatus } from '../../src/utils';

describe('resetAllStatuses', () => {
  it('removes all statuses', () => {
    const adapter = createAsyncAdapter();

    const state: AsyncState<{}> = {
      data: {},
      status: {
        a: getDefaultStatus('a'),
        b: getDefaultStatus('b'),
        c: getDefaultStatus('c'),
      },
    };

    adapter.resetAllStatuses(state);
    expect(state.status).toStrictEqual({});
  });
});
