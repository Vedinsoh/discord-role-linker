import type { RESTGetAPIUserResult, Snowflake } from 'discord-api-types/v10';
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
declare class Application {
    token: string;
    id: string;
    clientSecret: string;
    redirectUri: string;
    auth: Authorization;
    tokenStorage: TokenStorage;
    restManager: RESTManager;
    constructor(options: ApplicationOptions);
    registerMetadata(metadata: ApplicationMetadata[]): Promise<unknown>;
    getUserMetadata(userId: Snowflake): Promise<unknown>;
    setUserMetadata(userId: Snowflake, platformName: string, metadata: {
        [key: string]: string;
    }): Promise<unknown>;
    fetchUser(userId: Snowflake, access_token?: string): Promise<RESTGetAPIUserResult>;
}
export default Application;
//# sourceMappingURL=Application.d.ts.map