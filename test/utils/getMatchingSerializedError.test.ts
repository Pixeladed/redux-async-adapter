import { getMatchingSerializedError } from '../../src/utils';
import { SerializedError } from '@reduxjs/toolkit';

describe('getMatchingSerializedError', () => {
  it('should return the correct serialized error', () => {
    const message = 'custom error message';
    const error = new Error(message);
    const serializedError = getMatchingSerializedError(error);
    const errorShape: SerializedError = {
      name: 'Error',
      message,
      stack: error.stack,
    };

    expect(serializedError).toStrictEqual(errorShape);
  });
});
