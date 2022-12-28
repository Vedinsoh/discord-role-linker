import type Application from 'structures/Application';
import type { ApplicationMetadata } from 'types/ApplicationMetadata';
import type { OAuthTokens } from 'types/OAuthTokens';
declare class RESTManager {
    private _application;
    private _rest;
    constructor(application: Application);
    createOauth2Token(code: string): Promise<OAuthTokens>;
    refreshOauth2Token(refreshToken: string): Promise<OAuthTokens>;
    registerApplicationMetadata(metadata: ApplicationMetadata[]): Promise<unknown>;
    getMetadata(): Promise<unknown>;
    putUserMetadata(platformName: string, metadata: {
        [key: string]: string;
    }): Promise<unknown>;
    getCurrentAuthorization(): Promise<unknown>;
}
export default RESTManager;
//# sourceMappingURL=RESTManager.d.ts.map