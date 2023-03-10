import type { Snowflake } from 'discord-api-types/globals';
import type { ApplicationMetadata, MetadataValues } from '../types/ApplicationMetadata';
import type { RoleLinker } from './RoleLinker';

export class MetadataManager {
  constructor(private _client: RoleLinker) {}

  /**
   * Register metadata to the application.
   * @param metadata The metadata to register.
   */
  public async register(metadata: ApplicationMetadata[]) {
    if (!metadata) throw new Error('Metadata is required to register it in the application.');
    if (metadata.length < 1) throw new Error('At least one metadata is required to register it in the application.');
    if (metadata.length > 5) throw new Error('You can only register 5 metadata fields in the application.');

    return this._client.rest.registerApplicationMetadata(metadata).then((value: unknown) => {
      // eslint-disable-next-line no-console
      console.log('Registered application metadata successfully!');
      return value;
    });
  }

  /**
   * Get the metadata of the user.
   * @param userId The user ID who's metadata you want to get.
   * @returns The metadata of the user.
   */
  public async getUserData(userId: Snowflake) {
    const tokens = await this._client.tokenStore.get(userId);
    if (!tokens) throw new Error('No tokens found for the user');
    return (await this._client.rest.getUserMetadata(tokens)) ?? null;
  }

  /**
   * Set the metadata of the user.
   * @param userId The user ID who's metadata you want to set.
   * @param platformName The platform name you want to set. This is the name that will show in the user's profile.
   * @param metadata The metadata you want to set.
   */
  public async setUserData(userId: Snowflake, platformName: string, metadata: MetadataValues) {
    const tokens = await this._client.tokenStore.get(userId);
    if (!tokens) throw new Error('No tokens found for the user');
    return this._client.rest.setUserMetadata(tokens, platformName, metadata);
  }
}
