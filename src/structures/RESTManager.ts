import { GatewayVersion, RESTGetAPIUserResult, Routes } from 'discord-api-types/v10';
import type { ApplicationMetadata } from '../types/ApplicationMetadata';
import type { OAuthTokensData } from '../types/OAuthTokensData';
import { OAuthManager, OAuthManagerOptions } from './OAuthManager';
import { REST } from '@discordjs/rest';

const jsonHeaders = {
  'Content-Type': 'application/json',
};
const createAuthorizationHeader = (tokenData: OAuthTokensData) => ({
  Authorization: `Bearer ${tokenData.access_token}`,
});

export type RESTManagerOptions = OAuthManagerOptions & {
  clientId: string;
  token: string;
};

export class RESTManager {
  public rest: REST;
  public clientId: string;
  public oauthManager: OAuthManager;

  constructor(options: RESTManagerOptions) {
    this.rest = new REST({ version: GatewayVersion }).setToken(options.token);

    if (!options.token) throw new Error('A token is required in the application options');
    if (!options.clientId) throw new Error('A application ID is required in the application options');

    this.clientId = options.clientId;

    this.oauthManager = new OAuthManager(
      {
        clientSecret: options.clientSecret,
        redirectUri: options.redirectUri,
        scopes: options.scopes,
      },
      this
    );
  }

  public async registerApplicationMetadata(metadata: ApplicationMetadata[]) {
    return this.rest
      .put(Routes.applicationRoleConnectionMetadata(this.clientId), {
        headers: jsonHeaders,
        body: metadata,
      })
      .catch((error: Error) => {
        throw new Error(`Failed to register application metadata: ${error.message}`);
      });
  }

  public async getUserMetadata(tokenData: OAuthTokensData) {
    return this.rest.get(Routes.applicationRoleConnectionMetadata(this.clientId), {
      headers: {
        ...createAuthorizationHeader(tokenData),
      },
    });
  }

  public async setUserMetadata(tokenData: OAuthTokensData, platformName: string, metadata: { [key: string]: string }) {
    return this.rest.put(Routes.userApplicationRoleConnection(this.clientId), {
      headers: {
        ...jsonHeaders,
        ...createAuthorizationHeader(tokenData),
      },
      body: {
        platform_name: platformName,
        metadata: metadata,
      },
    });
  }

  public async getUserData(tokenData: OAuthTokensData) {
    return this.rest.get(Routes.oauth2CurrentAuthorization(), {
      headers: {
        ...createAuthorizationHeader(tokenData),
      },
    }) as Promise<RESTGetAPIUserResult>;
  }
}
