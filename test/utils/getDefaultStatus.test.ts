import { AsyncStatus } from '../../src/types';
import { getDefaultStatus } from '../../src/utils';

describe('getDefaultStatus', () => {
  it('should return the correct status shape', () => {
    const name = 'type/prefix';
    const status = getDefaultStatus(name);
    const statusShape: AsyncStatus = {
      name,
      error: undefined,
      lastLoaded: undefined,
      loaded: false,
      loading: false,
    };

    expect(status).toStrictEqual(statusShape);
  });
});
