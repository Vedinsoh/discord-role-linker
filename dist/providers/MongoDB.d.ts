import type { Snowflake } from 'discord-api-types/globals';
import mongoose from 'mongoose';
import type { OAuthTokens } from 'types/OAuthTokens';
export declare const UserModel: mongoose.Model<{
    tokens?: {
        access_token?: string | undefined;
        refresh_token?: string | undefined;
        expires_at?: number | undefined;
    } | undefined;
    id?: string | undefined;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.ResolveSchemaOptions<{
    collection: string;
}>, {
    tokens?: {
        access_token?: string | undefined;
        refresh_token?: string | undefined;
        expires_at?: number | undefined;
    } | undefined;
    id?: string | undefined;
}>>;
declare class MongoDBProvider {
    constructor(mongoUri: string);
    fetchUser(userId: Snowflake): Promise<{
        access_token?: string | undefined;
        refresh_token?: string | undefined;
        expires_at?: number | undefined;
    } | undefined>;
    createOrUpdate(userId: Snowflake, tokens: OAuthTokens): Promise<OAuthTokens>;
    deleteUser(userId: Snowflake): Promise<import("mongodb").DeleteResult>;
    findAll(): Promise<(mongoose.Document<unknown, any, {
        tokens?: {
            access_token?: string | undefined;
            refresh_token?: string | undefined;
            expires_at?: number | undefined;
        } | undefined;
        id?: string | undefined;
    }> & {
        tokens?: {
            access_token?: string | undefined;
            refresh_token?: string | undefined;
            expires_at?: number | undefined;
        } | undefined;
        id?: string | undefined;
    } & {
        _id: mongoose.Types.ObjectId;
    })[]>;
}
export default MongoDBProvider;
//# sourceMappingURL=MongoDB.d.ts.map