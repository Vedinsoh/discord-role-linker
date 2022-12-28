import type { Snowflake } from 'discord-api-types/globals';
import type { OAuthTokens } from 'types/OAuthTokens';
export declare class MapProvider {
    tokens: Map<string, OAuthTokens>;
    fetchUser(userId: Snowflake): Promise<OAuthTokens | undefined>;
    createOrUpdate(userId: Snowflake, tokens: OAuthTokens): Promise<OAuthTokens>;
    deleteUser(userId: Snowflake): Promise<true>;
    findAll(): Promise<{
        id: string;
        tokens: any;
    }[]>;
}
//# sourceMappingURL=MapStorage.d.ts.map