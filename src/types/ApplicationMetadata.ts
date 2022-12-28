import type { MetadataTypes } from '../constants/MetadataTypes';

export type ApplicationMetadata = {
  key: string; // TODO max 50 chars, a-z, 0-9, or _
  name: string; // TODO max 100 chars
  // name_localizations: { [key: string]: string }; // TODO support only available locales
  description: string;
  // description_localizations: { [key: string]: string }; // TODO support only available locales
  type: typeof MetadataTypes;
};
