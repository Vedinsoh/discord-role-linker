import type { Snowflake } from 'discord-api-types/globals';
import type { OAuthTokenData } from '../types/OAuthTokenData';

export class MapProvider {
  private _tokens = new Map<Snowflake, OAuthTokenData>();

  public async fetchUser(userId: Snowflake) {
    return this._tokens.get(userId);
  }

  public async createOrUpdate(userId: Snowflake, tokenData: OAuthTokenData) {
    this._tokens.set(userId, tokenData);
    return tokenData;
  }

  public async deleteUser(userId: Snowflake) {
    const isDeleted = this._tokens.delete(userId);
    if (!isDeleted) throw 'User not found';
    return isDeleted;
  }

  public async findAll() {
    return Object.entries(this._tokens).map(([key, value]) => ({
      id: key,
      tokens: value,
    }));
  }
}
