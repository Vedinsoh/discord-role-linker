import type { Snowflake } from 'discord-api-types/globals';
import mongoose, { Schema } from 'mongoose';
import { ProviderCalls } from '../types/DatabaseProvider';
import type { OAuthTokensData } from '../types/OAuthTokensData';

const UserModel = mongoose.model(
  'user_tokens',
  new Schema(
    {
      id: String,
      tokenData: {
        access_token: String,
        refresh_token: String,
        expires_at: Number,
      },
    },
    { collection: 'user_tokens' }
  )
);

export class MongoDBProvider {
  constructor(mongoUri: string) {
    mongoose.connect(mongoUri);
  }

  public async [ProviderCalls.getUserTokens](userId: Snowflake) {
    const user = await UserModel.findOne({ id: userId });
    if (!user) return null;
    return user.tokenData;
  }

  public async [ProviderCalls.createOrUpdateUser](userId: Snowflake, tokenData: OAuthTokensData) {
    //*  Check if user exits
    const user = await UserModel.findOne({ id: userId });

    if (!user) {
      // * Create new user
      const newUser = new UserModel({
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
    return UserModel.deleteOne({
      id: userId,
    });
  }

  public async [ProviderCalls.fetchAllUsers]() {
    return UserModel.find();
  }
}
