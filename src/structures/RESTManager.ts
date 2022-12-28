/* eslint-disable no-console */
import { GatewayVersion, OAuth2Scopes, Routes } from 'discord-api-types/v10';
import crypto from 'node:crypto';
import type { ApplicationMetadata } from 'types/ApplicationMetadata';
import type { OAuthTokens } from 'types/OAuthTokens';
import { REST } from '@discordjs/rest';
import { DefaultRestOptions as RestOptions } from '@discordjs/rest';

export const defaultScopes = [OAuth2Scopes.RoleConnectionsWrite, OAuth2Scopes.Identify];

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export type RESTManagerOptions = {
  token: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
};

class RESTManager {
  private _rest: REST;
  private _clientId: string;
  private _clientSecret: string;
  private _redirectUri: string;
  private _scopes: string[] = defaultScopes;

  constructor(options: RESTManagerOptions) {
    this._rest = new REST({ version: GatewayVersion }).setToken(options.token);

    if (!options.token) throw new Error('A token is required in the application options');
    if (!options.clientId) throw new Error('A application ID is required in the application options');
    if (!options.clientSecret) throw new Error('A client secret is required in the application options');
    if (!options.redirectUri) throw new Error('A redirect URI is required in the application options');

    this._clientId = options.clientId;
    this._clientSecret = options.clientSecret;
    this._redirectUri = options.redirectUri;
    if (options.scopes) this._scopes = options.scopes;
  }

  private get _defaultBody() {
    return {
      client_id: this._clientId,
      client_secret: this._clientSecret,
    };
  }

  public getOauth2Url() {
    const uuid = crypto.randomUUID(); // TODO
    const url = new URL(`${RestOptions.api}/oauth2/authorize`);

    url.searchParams.set('client_id', this._clientId);
    url.searchParams.set('redirect_uri', this._redirectUri);
    url.searchParams.set('prompt', 'consent');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', uuid);
    url.searchParams.set('scope', this._scopes.join(' '));

    return { state: uuid, url: url.toString() };
  }

  public async createOauth2Token(code: string) {
    const body = new URLSearchParams({
      ...this._defaultBody,
      redirect_uri: this._redirectUri,
      grant_type: 'authorization_code',
      code,
    });

    return this._rest.post(Routes.oauth2TokenExchange(), {
      body,
      passThroughBody: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }) as Promise<OAuthTokens>;
  }

  public async refreshOauth2Token(refreshToken: string) {
    const body = new URLSearchParams({
      ...this._defaultBody,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return this._rest.post(Routes.oauth2TokenExchange(), {
      body,
      passThroughBody: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }) as Promise<OAuthTokens>;
  }

  public async registerApplicationMetadata(metadata: ApplicationMetadata[]) {
    return this._rest
      .put(Routes.applicationRoleConnectionMetadata(this._clientId), {
        headers: jsonHeaders,
        body: metadata,
      })
      .then((value: unknown) => {
        console.log('Registered application metadata successfully!');
        return value;
      })
      .catch((error: Error) => {
        console.error('Failed to register application metadata!');
        return error;
      });
  }

  public async getMetadata() {
    return this._rest.get(Routes.applicationRoleConnectionMetadata(this._clientId), {
      auth: false,
    });
  }

  public async putUserMetadata(platformName: string, metadata: { [key: string]: string }) {
    return this._rest.put(Routes.userApplicationRoleConnection(this._clientId), {
      headers: jsonHeaders,
      body: {
        platform_name: platformName,
        metadata: metadata,
      },
      auth: false,
    });
  }

  public async getCurrentAuthorization() {
    return this._rest.get(Routes.oauth2CurrentAuthorization(), {
      auth: false,
    });
  }
}

export default RESTManager;
