import type { Snowflake } from 'discord-api-types/globals';
import mongoose from 'mongoose';
import type { OAuthTokenData } from '../types/OAuthTokenData';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: String,
    tokenData: {
      access_token: String,
      refresh_token: String,
      expires_at: Number,
    },
  },
  { collection: 'userTokens' }
);

export const UserModel = mongoose.model('userTokens', userSchema);

export class MongoDBProvider {
  constructor(mongoUri: string) {
    mongoose.connect(mongoUri);
  }

  public async fetchUser(userId: Snowflake) {
    const user = await UserModel.findOne({ id: userId });
    if (!user) return undefined;
    return user.tokenData;
  }

  public async createOrUpdate(userId: Snowflake, tokenData: OAuthTokenData) {
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

  public async deleteUser(userId: Snowflake) {
    return UserModel.deleteOne({
      id: userId,
    });
  }

  public async findAll() {
    return UserModel.find();
  }
}
