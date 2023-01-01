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
  public rest: RESTManager;
  public tokenStore: TokenStore;

  constructor(options: RoleLinkerOptions) {
    this.rest = new RESTManager(
      {
        token: options.token,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        redirectUri: options.redirectUri,
      },
      this
    );
    this.tokenStore = new TokenStore(options.databaseProvider);
  }

  /**
   * Get the user data and store the tokens in the database.
   * @param code The code from the OAuth2 redirect.
   * @returns The user data.
   * @example
   * ```js
   * const code = roleLinker.auth.verifyCode(req);
   * if (!code) return res.sendStatus(403);
   * const user = await roleLinker.auth.getUserAndStoreToken(code);
   * ```
   */
  public async getUserAndStoreToken(code: string) {
    const tokens = await this.auth.getOAuthTokens(code);
    const user = await this.getUserData(tokens);
    if (!user) throw new Error('No user found');
    await this.tokenStore.set(user.id, tokens);
    return user;
  }

  /**
   * Get the user data using the tokens.
   * @param tokens The tokens associated with the user.
   * @returns The user data.
   */
  public async getUserData(tokens: OAuthTokensData) {
    return (await this.rest.getUserData(tokens)) ?? null;
  }
}
