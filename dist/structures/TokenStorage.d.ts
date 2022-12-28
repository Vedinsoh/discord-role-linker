import type { Snowflake } from 'discord-api-types/globals';
import type { OAuthTokens } from 'types/OAuthTokens';
declare class TokenStorage {
    provider: DatabaseProvider;
    tokens: Map<string, OAuthTokens>;
    constructor(provider: DatabaseProvider);
    get(userId: Snowflake): Promise<OAuthTokens | undefined>;
    set(userId: Snowflake, token: OAuthTokens): Promise<void>;
    delete(userId: Snowflake): Promise<void>;
    getAllUsers(): Promise<{
        tokens: OAuthTokens;
        id: string;
    }>;
}
export type DatabaseProvider = {
    findAll(): Promise<{
        tokens: OAuthTokens;
        id: string;
    }>;
    fetchUser: (userId: Snowflake) => Promise<OAuthTokens | undefined>;
    createOrUpdate: (userId: Snowflake, token: OAuthTokens) => Promise<void>;
    deleteUser: (userId: Snowflake) => Promise<void>;
};
export default TokenStorage;
//# sourceMappingURL=TokenStorage.d.ts.map