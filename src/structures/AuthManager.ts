import type { Snowflake } from 'discord-api-types/v10';
import type { Request, Response } from 'express';
import type { RoleLinker } from './RoleLinker';

export class AuthManager {
  constructor(private _client: RoleLinker) {}

  /**
   * To start the flow, generate the OAuth2 consent dialog URL for Discord,
   * and redirect the user there.
   */
  public init(_req: Request, res: Response) {
    const { state, url } = this._client.rest.oauthManager.getOAuthUrl();
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

  /**
   * Given an OAuth2 code from the scope approval page, make a request to Discord's
   * OAuth2 service to retreive an access token, refresh token, and expiration.
   */
  public async getOAuthTokens(code: string) {
    return this._client.rest.oauthManager.getOAuthTokens(code);
  }

  public async getAccessToken(userId: Snowflake) {
    const tokens = await this._client.tokenStore.get(userId);
    if (!tokens) throw new Error('No tokens found for user');

    if (tokens.expires_at < Date.now()) {
      const resTokens = await this._client.rest.oauthManager.refreshOAuthToken(tokens.refresh_token);
      if (resTokens) {
        this._client.tokenStore.set(userId, resTokens);
        return tokens.access_token;
      } else {
        throw new Error(`Error refreshing access token for user ${userId}`);
      }
    }
    return tokens.access_token;
  }
}

export default AuthManager;
