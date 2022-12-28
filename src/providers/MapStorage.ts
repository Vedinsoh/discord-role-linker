import type { Snowflake } from 'discord-api-types/globals';
import type { OAuthTokens } from 'types/OAuthTokens';

export class MapProvider {
  tokens = new Map<string, OAuthTokens>();

  async fetchUser(userId: Snowflake) {
    return this.tokens.get(userId);
  }
  async createOrUpdate(userId: Snowflake, tokens: OAuthTokens) {
    this.tokens.set(userId, tokens);
    return tokens;
  }
  async deleteUser(userId: Snowflake) {
    const isDeleted = this.tokens.delete(userId);
    if (!isDeleted) throw 'User not found';
    return isDeleted;
  }

  async findAll() {
    return Object.entries(this.tokens).map(([key, value]) => ({
      id: key,
      tokens: value,
    }));
  }
}
