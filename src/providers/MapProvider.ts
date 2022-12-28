import type { Snowflake } from 'discord-api-types/globals';
import { ProviderCalls } from '../types/DatabaseProvider';
import type { OAuthTokensData } from '../types/OAuthTokensData';
import type { Nullable } from '../types/UtilTypes';

export class MapProvider {
  private _tokens = new Map<Snowflake, OAuthTokensData>();

  public async [ProviderCalls.getUserTokens](userId: Nullable<Snowflake>) {
    if (!userId) return null;
    return this._tokens.get(userId) ?? null;
  }

  public async [ProviderCalls.fetchAllUsers]() {
    return Array.from(this._tokens).map(([userId, tokenData]) => ({
      userId,
      tokenData,
    }));
  }

  public async [ProviderCalls.createOrUpdateUser](userId: Snowflake, tokenData: OAuthTokensData) {
    this._tokens.set(userId, tokenData);
    return tokenData;
  }

  public async [ProviderCalls.deleteUser](userId: Snowflake) {
    const isDeleted = this._tokens.delete(userId);
    if (!isDeleted) throw 'User not found';
    return isDeleted;
  }
}
