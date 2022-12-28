import type { Snowflake } from 'discord-api-types/globals';
import type { OAuthTokensData } from './OAuthTokensData';
import type { Nullable } from './UtilTypes';

export enum ProviderCalls {
  getUserTokens = 'getUserTokens',
  fetchAllUsers = 'fetchAllUsers',
  createOrUpdateUser = 'createOrUpdateUser',
  deleteUser = 'deleteUser',
}

export type DatabaseProvider = {
  [ProviderCalls.getUserTokens]: (userId: Nullable<Snowflake>) => Promise<OAuthTokensData | null>;
  [ProviderCalls.fetchAllUsers]: () => Promise<{ userId: Snowflake; tokenData: OAuthTokensData }[]>;
  [ProviderCalls.createOrUpdateUser]: (userId: Snowflake, token: OAuthTokensData) => Promise<OAuthTokensData>;
  [ProviderCalls.deleteUser]: (userId: Snowflake) => Promise<boolean>;
};
