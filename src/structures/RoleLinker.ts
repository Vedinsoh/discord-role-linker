import type { DatabaseProvider } from '../types/DatabaseProvider';
import type { OAuthTokensData } from '../types/OAuthTokensData';
import AuthManager from './AuthManager';
import { MetadataManager } from './MetadataManager';
import { RESTManager, RESTManagerOptions } from './RESTManager';
import { TokenStore } from './TokenStore';

export type RoleLinkerOptions = RESTManagerOptions & {
  /**
   * The database provider to use for storing tokens.
   * @default MapProvider
   */
  databaseProvider?: DatabaseProvider;
};

export class RoleLinker {
  public auth = new AuthManager(this);
  public metadata = new MetadataManager(this);

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

  public async getUserData(tokens: OAuthTokensData) {
    return (await this.restManager.getUserData(tokens)) ?? null;
  }
}
