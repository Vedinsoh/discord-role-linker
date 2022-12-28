import type { Snowflake } from 'discord-api-types/v10';
import type { Request, Response } from 'express';
import type { RoleLinker } from './RoleLinker';

export class Authorization {
  private _application: RoleLinker;

  constructor(application: RoleLinker) {
    this._application = application;
  }

  /**
   * To start the flow, generate the OAuth2 consent dialog URL for Discord,
   * and redirect the user there.
   */
  public init(_req: Request, res: Response) {
    const { state, url } = this._application.restManager.oauthManager.getOAuthUrl();
    res.cookie('clientState', state, {
      maxAge: 1000 * 60 * 5, // * 5 minutes
      signed: true,
    });
    return res.redirect(url);
  }

  /**
   * Verifies the code and state parameters
   * @returns The code if the state parameter is valid, otherwise null
   */
  public verifyCode(req: Request) {
    const code = req.query['code'];
    const discordState = req.query['state'];

    // * Make sure the state parameter exists
    const { clientState } = req.signedCookies;

    if (clientState !== discordState) return null;
    return code;
  }

  public async getOAuthTokens(code: string) {
    return this._application.restManager.oauthManager.getOAuthTokens(code);
  }

  public async getUserAndStoreToken(code: string) {
    const tokens = await this.getOAuthTokens(code);
    const user = await this._application.getUserData(tokens);

    await this._application.tokenStore.set(user.id, tokens);
    return user;
  }

  public async getAccessToken(userId: Snowflake) {
    const tokens = await this._application.tokenStore.get(userId);
    if (!tokens) throw new Error('No tokens found for user');

    if (tokens.expires_at < Date.now()) {
      // TODO fix any type
      const response: any = await this._application.restManager.oauthManager.refreshOAuthToken(tokens.refresh_token);
      if (response) {
        const tokens = response;
        tokens.expires_at = Date.now() + tokens.expires_in * 1000;

        // * Store Tokens
        this._application.tokenStore.set(userId, tokens);
        return tokens.access_token;
      } else {
        throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
      }
    }
    return tokens.access_token;
  }
}

export default Authorization;
