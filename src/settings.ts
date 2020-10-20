import { AsyncAdapterOptions } from './types';

const settings: AsyncAdapterOptions = {
  usePayloadAsError: false,
};

export const getSettings = () => Object.freeze(settings);

export const setSettings = (newSettings: Partial<AsyncAdapterOptions>) => {
  for (const property in newSettings) {
    const key = property as keyof AsyncAdapterOptions;
    settings[key] = newSettings[key]!;
  }
};
