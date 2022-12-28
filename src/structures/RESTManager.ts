/* eslint-disable no-console */
import { GatewayVersion, Routes } from 'discord-api-types/v10';
import type Application from 'structures/Application';
import type { ApplicationMetadata } from 'types/ApplicationMetadata';
import type { OAuthTokens } from 'types/OAuthTokens';
import { REST } from '@discordjs/rest';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

class RESTManager {
  private _application: Application;
  private _rest: REST;

  constructor(application: Application) {
    this._application = application;
    this._rest = new REST({ version: GatewayVersion }).setToken(this._application.token);
  }

  public async createOauth2Token(code: string) {
    const body = new URLSearchParams({
      client_id: this._application.id,
      client_secret: this._application.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this._application.redirectUri,
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
      client_id: this._application.id,
      client_secret: this._application.clientSecret,
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
      .put(Routes.applicationRoleConnectionMetadata(this._application.id), {
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
    return this._rest.get(Routes.applicationRoleConnectionMetadata(this._application.id), {
      auth: false,
    });
  }

  public async putUserMetadata(platformName: string, metadata: { [key: string]: string }) {
    return this._rest.put(Routes.userApplicationRoleConnection(this._application.id), {
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
