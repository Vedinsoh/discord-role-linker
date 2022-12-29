import type { Snowflake } from 'discord-api-types/globals';
import mongoose, { Schema } from 'mongoose';
import { ProviderCalls } from '../types/DatabaseProvider';
import type { OAuthTokensData } from '../types/OAuthTokensData';

export type MongoDBProviderOptions = {
  mongoUri: string;
  schemaName?: string;
};

export class MongoDBProvider {
  private _UserModel;

  constructor(options: MongoDBProviderOptions) {
    this._UserModel = mongoose.model(
      options.schemaName ?? 'user_tokens',
      new Schema(
        {
          id: String,
          tokenData: {
            access_token: String,
            refresh_token: String,
            expires_at: Number,
          },
        },
        { collection: options.schemaName ?? 'user_tokens' }
      )
    );

    mongoose.connect(options.mongoUri);
  }

  public async [ProviderCalls.getUserTokens](userId: Snowflake) {
    const user = await this._UserModel.findOne({ id: userId });
    if (!user) return null;
    return user.tokenData;
  }

  public async [ProviderCalls.createOrUpdateUser](userId: Snowflake, tokenData: OAuthTokensData) {
    //*  Check if user exits
    const user = await this._UserModel.findOne({ id: userId });

    if (!user) {
      // * Create new user
      const newUser = new this._UserModel({
        id: userId,
        tokens: tokenData,
      });
      await newUser.save();
    } else {
      // * Update user
      user.tokenData = tokenData;
      await user.save();
    }
    return tokenData;
  }

  public async [ProviderCalls.deleteUser](userId: Snowflake) {
    return this._UserModel.deleteOne({
      id: userId,
    });
  }

  public async [ProviderCalls.fetchAllUsers]() {
    return this._UserModel.find();
  }
}
