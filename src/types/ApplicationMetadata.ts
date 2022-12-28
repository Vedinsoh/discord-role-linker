import type { MetadataTypes } from 'constants/MetadataTypes';

export type ApplicationMetadata = {
  key: string;
  name: string;
  description: string;
  type: typeof MetadataTypes;
};
