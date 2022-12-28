import type { RESTGetAPIUserResult, Snowflake } from 'discord-api-types/v10';
import { MapProvider } from 'providers/MapStorage';
import Authorization from 'structures/Authorization';
import RESTManager from 'structures/RESTManager';
import TokenStorage, { DatabaseProvider } from 'structures/TokenStorage';
import type { ApplicationMetadata } from 'types/ApplicationMetadata';

export type ApplicationOptions = {
  token: string;
  id: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
  databaseProvider?: DatabaseProvider;
};

class Application {
  token: string;
  id: string;
  clientSecret: string;
  redirectUri: string;
  auth: Authorization;
  tokenStorage: TokenStorage;
  restManager: RESTManager;

  constructor(options: ApplicationOptions) {
    this.token = options.token;
    this.id = options.id;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;

    if (!this.token) throw new Error('A token is required in the application options');
    if (!this.id) throw new Error('A application ID is required in the application options');
    if (!this.clientSecret) throw new Error('A client secret is required in the application options');
    if (!this.redirectUri) throw new Error('A redirect URI is required in the application options');

    this.auth = new Authorization(this, options.scopes);
    this.restManager = new RESTManager(this);
    this.tokenStorage = new TokenStorage((options.databaseProvider as DatabaseProvider) || new MapProvider());
  }

  async registerMetadata(metadata: ApplicationMetadata[]) {
    if (!metadata) throw new Error('Metadata is required to register it in the application.');
    if (metadata.length < 1) throw new Error('At least one metadata is required to register it in the application.');
    if (metadata.length > 5) throw new Error('You can only register 5 metadata fields in the application.');

    return this.restManager.registerApplicationMetadata(metadata);
  }

  async getUserMetadata(userId: Snowflake) {
    const tokens = await this.tokenStorage.get(userId);
    if (!tokens) throw new Error('No tokens found for the user');
    return this.restManager.getMetadata();
  }

  async setUserMetadata(userId: Snowflake, platformName: string, metadata: { [key: string]: string }) {
    const tokens = await this.tokenStorage.get(userId);
    if (!tokens) throw new Error('No tokens found for the user');

    return this.restManager.putUserMetadata(platformName, metadata);
  }

  // TODO fix types
  async fetchUser(userId: Snowflake, access_token?: string): Promise<RESTGetAPIUserResult> {
    let tokens = await this.tokenStorage.get(userId);
    if (!tokens && !access_token) throw new Error('No tokens found for the user');
    if (!tokens && access_token) tokens = { access_token: access_token, refresh_token: '' } as any;

    return this.restManager.getCurrentAuthorization().then((x: any) => x.user) as any;
  }
}

export default Application;
