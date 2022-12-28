import type { RESTGetAPIUserResult, Snowflake } from 'discord-api-types/v10';
import { MapProvider } from 'providers/MapStorage';
import Authorization from 'structures/Authorization';
import RESTManager, { RESTManagerOptions } from 'structures/RESTManager';
import TokenStorage, { DatabaseProvider } from 'structures/TokenStorage';
import type { ApplicationMetadata } from 'types/ApplicationMetadata';

export type ApplicationOptions = RESTManagerOptions & {
  databaseProvider?: DatabaseProvider;
};

class Application {
  auth: Authorization = new Authorization(this);
  tokenStorage: TokenStorage;
  restManager: RESTManager;

  constructor(options: ApplicationOptions) {
    this.restManager = new RESTManager({
      token: options.token,
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      redirectUri: options.redirectUri,
    });
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
