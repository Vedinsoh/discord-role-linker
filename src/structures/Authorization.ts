import type { Snowflake } from 'discord-api-types/v10';
import type { Request, Response } from 'express';
import type { OAuthTokenData } from '../types/OAuthTokenData';
import type { Application } from './Application';

export class Authorization {
  private _application: Application;

  constructor(application: Application) {
    this._application = application;
  }

  private async _getOAuthTokenData(code: string): Promise<OAuthTokenData> {
    return this._application.restManager.createOauth2Token(code);
  }

  public async getUserAndStoreToken(code: string) {
    const tokens = await this._getOAuthTokenData(code);

    // TODO: Fix this
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = await this._application.fetchUser(null, tokens.access_token);

    this._application.tokenStore.set(user.id, tokens);
    return user;
  }

  public async getAccessToken(userId: Snowflake) {
    const tokens = await this._application.tokenStore.get(userId);
    if (!tokens) throw new Error('No tokens found for user');

    if (tokens.expires_at < Date.now()) {
      // TODO fix any type
      const response: any = await this._application.restManager.refreshOauth2Token(tokens.refresh_token);
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

  public setCookieAndRedirect(_req: Request, res: Response) {
    const { state, url } = this._application.restManager.getOauth2Url();
    // * Store the signed state param in the user's cookies so we can verify the value later. See: https://discord.com/developers/docs/topics/oauth2#state-and-security
    res.cookie('clientState', state, {
      maxAge: 1000 * 60 * 5, // * 5 minutes
      signed: true,
    });
    return res.redirect(url);
  }

  public verifyCookieAndReturnCode(req: Request) {
    const code = req.query['code'];
    const discordState = req.query['state'];

    // * Make sure the state parameter exists
    const { clientState } = req.signedCookies;

    if (clientState !== discordState) return null;
    return code;
  }
}

export default Authorization;
