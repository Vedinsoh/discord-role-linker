import type { Snowflake } from 'discord-api-types/v10';
import type { ApplicationMetadata } from '../types/ApplicationMetadata';
import type { DatabaseProvider } from '../types/DatabaseProvider';
import type { OAuthTokensData } from '../types/OAuthTokensData';
import Authorization from './Authorization';
import { RESTManager, RESTManagerOptions } from './RESTManager';
import { TokenStore } from './TokenStore';

export type RoleLinkerOptions = RESTManagerOptions & {
  databaseProvider?: DatabaseProvider;
};

export class RoleLinker {
  public auth = new Authorization(this);
  public tokenStore: TokenStore;
  public restManager: RESTManager;

  constructor(options: RoleLinkerOptions) {
    this.tokenStore = new TokenStore(options.databaseProvider);
    this.restManager = new RESTManager({
      token: options.token,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      redirectUri: options.redirectUri,
    });
  }

  public async registerMetadata(metadata: ApplicationMetadata[]) {
    if (!metadata) throw new Error('Metadata is required to register it in the application.');
    if (metadata.length < 1) throw new Error('At least one metadata is required to register it in the application.');
    if (metadata.length > 5) throw new Error('You can only register 5 metadata fields in the application.');

    return this.restManager.registerApplicationMetadata(metadata).then((value: unknown) => {
      // eslint-disable-next-line no-console
      console.log('Registered application metadata successfully!');
      return value;
    });
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

  public async getUserData(tokens: OAuthTokensData) {
    return this.restManager.getUserData(tokens);
  }
}
