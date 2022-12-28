import type { RESTGetAPIUserResult, Snowflake } from 'discord-api-types/v10';
import type { ApplicationMetadata } from '../types/ApplicationMetadata';
import type { DatabaseProvider } from '../types/DatabaseProvider';
import type { OAuthTokenData } from '../types/OAuthTokenData';
import Authorization from './Authorization';
import { RESTManager, RESTManagerOptions } from './RESTManager';
import { TokenStore } from './TokenStore';

export type RoleLinkerOptions = RESTManagerOptions & {
  databaseProvider?: DatabaseProvider;
};

export class RoleLinker {
  auth = new Authorization(this);
  tokenStore: TokenStore;
  restManager: RESTManager;

  constructor(options: RoleLinkerOptions) {
    this.restManager = new RESTManager({
      token: options.token,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      redirectUri: options.redirectUri,
    });
    this.tokenStore = new TokenStore(options.databaseProvider);
  }

  public async registerMetadata(metadata: ApplicationMetadata[]) {
    if (!metadata) throw new Error('Metadata is required to register it in the application.');
    if (metadata.length < 1) throw new Error('At least one metadata is required to register it in the application.');
    if (metadata.length > 5) throw new Error('You can only register 5 metadata fields in the application.');

    return this.restManager.registerApplicationMetadata(metadata);
  }

  public async getUserMetadata(userId: Snowflake) {
    const tokens = await this.tokenStore.get(userId);
    if (!tokens) throw new Error('No tokens found for the user');
    return this.restManager.getUserMetadata(tokens);
  }

  public async setUserMetadata(userId: Snowflake, platformName: string, metadata: { [key: string]: string }) {
    const tokens = await this.tokenStore.get(userId);
    if (!tokens) throw new Error('No tokens found for the user');
    return this.restManager.setUserMetadata(tokens, platformName, metadata);
  }

  // TODO fix types
  public async fetchUser(userId: Snowflake, access_token?: string): Promise<RESTGetAPIUserResult> {
    let tokens = await this.tokenStore.get(userId);
    if (!tokens && !access_token) throw new Error('No tokens found for the user');
    if (!tokens && access_token) tokens = { access_token: access_token, refresh_token: '', expires_at: 0 };

    return this.restManager.getCurrentAuthorization(tokens as OAuthTokenData).then((x: any) => x.user) as any;
  }
}
