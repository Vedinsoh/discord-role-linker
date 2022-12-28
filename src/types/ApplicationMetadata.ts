import type { ValueTypes } from 'constants/ValueTypes';

export type ApplicationMetadata = {
  key: string;
  name: string;
  description: string;
  type: typeof ValueTypes;
};
