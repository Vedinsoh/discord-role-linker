import type { Snowflake } from 'discord-api-types/globals';
import type { OAuthTokenData } from './OAuthTokenData';

export type DatabaseProvider = {
  findAll: () => Promise<{ tokens: OAuthTokenData; id: string }>;
  fetchUser: (userId: Snowflake) => Promise<OAuthTokenData | undefined>;
  createOrUpdate: (userId: Snowflake, token: OAuthTokenData) => Promise<void>;
  deleteUser: (userId: Snowflake) => Promise<void>;
};
