/// <reference types="qs" />
import type { Snowflake } from 'discord-api-types/v10';
import type { Request, Response } from 'express';
import type Application from 'structures/Application';
import type { OAuthTokens } from 'types/OAuthTokens';
export declare const defaultScopes: string[];
declare class Authorization {
    private _application;
    private _scopes;
    constructor(application: Application, scopes?: string[]);
    getOAuthUrl(): {
        state: string;
        url: string;
    };
    getOAuthTokens(code: string): Promise<OAuthTokens>;
    getUserAndStoreToken(code: string): Promise<import("discord-api-types/v10").APIUser>;
    getAccessToken(userId: Snowflake): Promise<any>;
    setCookieAndRedirect(_req: Request, res: Response): void;
    verifyCookieAndReturnCode(req: Request): string | string[] | import("qs").ParsedQs | import("qs").ParsedQs[] | null | undefined;
}
export default Authorization;
//# sourceMappingURL=Authorization.d.ts.map