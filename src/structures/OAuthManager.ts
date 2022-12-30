import { OAuth2Scopes, RESTPostOAuth2AccessTokenResult, Routes } from 'discord-api-types/v10';
import crypto from 'node:crypto';
import type { OAuthTokensData } from '../types/OAuthTokensData';
import type { RoleLinker } from './RoleLinker';
import { DefaultRestOptions as RestOptions } from '@discordjs/rest';

export type OAuthManagerOptions = {
  /**
   * The client secret of your application.
   */
  clientSecret: string;
  /**
   * The redirect URI Discord will redirect to after the user approves the bot.
   */
  redirectUri: string;
  /**
   * The scopes the bot will request.
   * @accepts OAuth2Scopes
   */
  scopes?: OAuth2Scopes[];
};

export class OAuthManager {
  private _clientSecret: string;
  private _redirectUri: string;
  private _scopes: OAuth2Scopes[] = [OAuth2Scopes.RoleConnectionsWrite, OAuth2Scopes.Identify];

  constructor(options: OAuthManagerOptions, private _client: RoleLinker) {
    if (!options.clientSecret) throw new Error('A client secret is required in the application options');
    if (!options.redirectUri) throw new Error('A redirect URI is required in the application options');

    this._clientSecret = options.clientSecret;
    this._redirectUri = options.redirectUri;
    if (options.scopes) this._scopes = options.scopes;
  }

  private get _defaultBody() {
    return {
      client_id: this._client.rest.clientId,
      client_secret: this._clientSecret,
    };
  }

  /**
   * Generate the URL which the user will be directed to in order to approve the
   * bot, and see the list of requested scopes.
   */
  public getOAuthUrl() {
    // * More info on state: https://discord.com/developers/docs/topics/oauth2#state-and-security
    const state = crypto.randomUUID();
    const url = new URL(`${RestOptions.api}/oauth2/authorize`);

    url.searchParams.set('client_id', this._client.rest.clientId);
    url.searchParams.set('redirect_uri', this._redirectUri);
    url.searchParams.set('prompt', 'consent');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', state);
    url.searchParams.set('scope', this._scopes.join(' '));

    return { state: state, url: url.toString() };
  }

  private _parseOAuthTokenExchangeResponse(res: RESTPostOAuth2AccessTokenResult): OAuthTokensData {
    const { access_token, expires_in, refresh_token } = res;
    return {
      access_token: access_token,
      expires_at: Date.now() + expires_in * 1000,
      refresh_token: refresh_token,
    };
  }

  private async _postOAuthTokenExchange(body: URLSearchParams) {
    const res = (await this._client.rest.post(Routes.oauth2TokenExchange(), {
      body,
      passThroughBody: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })) as RESTPostOAuth2AccessTokenResult;

    return this._parseOAuthTokenExchangeResponse(res);
  }

  public async getOAuthTokens(code: string) {
    const body = new URLSearchParams({
      ...this._defaultBody,
      redirect_uri: this._redirectUri,
      grant_type: 'authorization_code',
      code,
    });

    return this._postOAuthTokenExchange(body);
  }

  public async refreshOAuthToken(refreshToken: string) {
    const body = new URLSearchParams({
      ...this._defaultBody,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return this._postOAuthTokenExchange(body);
  }
}
