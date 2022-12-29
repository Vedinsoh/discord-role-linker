import { GatewayVersion, RESTGetAPIOAuth2CurrentAuthorizationResult, Routes, Snowflake } from 'discord-api-types/v10';
import type { ApplicationMetadata, MetadataValues } from '../types/ApplicationMetadata';
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
  /**
   * The client ID of your application.
   */
  clientId: Snowflake;
  /**
   * The bot token of your application.
   */
  token: string;
};

export class RESTManager {
  public rest: REST;
  public clientId: Snowflake;
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

  /**
   * Get the information about the user.
   * @param tokenData The token data of the user
   * @returns APIUser object
   */
  public async getUserData(tokenData: OAuthTokensData) {
    return this.rest
      .get(Routes.oauth2CurrentAuthorization(), {
        headers: {
          ...createAuthorizationHeader(tokenData),
        },
        auth: false,
      })
      .then((res: unknown) => res as RESTGetAPIOAuth2CurrentAuthorizationResult)
      .then((res) => res.user);
  }

  /**
   * Get the metadata of a user on behalf of the current user.
   * @param tokenData The token data of the user
   * @returns The metadata of the user.
   */
  public async getUserMetadata(tokenData: OAuthTokensData) {
    return this.rest.get(Routes.userApplicationRoleConnection(this.clientId), {
      headers: {
        ...createAuthorizationHeader(tokenData),
      },
      auth: false,
    });
  }

  /**
   * Set the metadata of a user on behalf of the current user if the registered
   * metadata schema matches. This will overwrite the existing metadata.
   * @param tokenData The token data of the user
   * @param platformName The platform name of the user. This is the name that will be displayed in the Discord client on top of the conneciton.
   * @param metadata The metadata of the user.
   */
  public async setUserMetadata(tokenData: OAuthTokensData, platformName: string, metadata: MetadataValues) {
    return this.rest.put(Routes.userApplicationRoleConnection(this.clientId), {
      headers: {
        ...jsonHeaders,
        ...createAuthorizationHeader(tokenData),
      },
      body: {
        platform_name: platformName,
        metadata: metadata,
      },
      auth: false,
    });
  }
}
