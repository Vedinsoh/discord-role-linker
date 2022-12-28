import type { Snowflake } from 'discord-api-types/globals';
import { MapProvider } from '../providers/Map';
import type { DatabaseProvider } from '../types/DatabaseProvider';
import type { OAuthTokenData } from '../types/OAuthTokenData';

export class TokenStore {
  private _tokenStore = new Map<Snowflake, OAuthTokenData>();
  private _provider: DatabaseProvider;

  constructor(provider?: DatabaseProvider) {
    const defaultProvider = new MapProvider() as unknown as DatabaseProvider;
    this._provider = provider ?? defaultProvider;
  }

  async get(userId: Snowflake) {
    if (!this._tokenStore.has(userId)) {
      const token = await this._provider.fetchUser(userId);
      if (token) this._tokenStore.set(userId, token);
    }
    return this._tokenStore.get(userId);
  }

  async set(userId: Snowflake, tokenData: OAuthTokenData) {
    this._tokenStore.set(userId, tokenData);
    await this._provider.createOrUpdate(userId, tokenData);
  }

  async delete(userId: Snowflake) {
    this._tokenStore.delete(userId);
    await this._provider.deleteUser(userId);
  }

  async getAllUsers() {
    return this._provider.findAll();
  }
}
