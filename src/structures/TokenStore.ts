import type { Snowflake } from 'discord-api-types/globals';
import { MapProvider } from '../providers/MapProvider';
import type { DatabaseProvider } from '../types/DatabaseProvider';
import type { OAuthTokensData } from '../types/OAuthTokensData';
import type { Nullable } from '../types/UtilTypes';

export class TokenStore {
  private _provider: DatabaseProvider = new MapProvider();

  constructor(provider?: DatabaseProvider) {
    if (provider) this._provider = provider;
  }

  public async get(userId: Nullable<Snowflake>) {
    return this._provider.getUserTokens(userId);
  }

  public async set(userId: Snowflake, tokenData: OAuthTokensData) {
    return this._provider.createOrUpdateUser(userId, tokenData);
  }

  public async delete(userId: Snowflake) {
    return this._provider.deleteUser(userId);
  }

  public async getAllUsers() {
    return this._provider.fetchAllUsers();
  }
}
