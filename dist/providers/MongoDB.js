import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const userSchema = new Schema({
    id: String,
    tokens: {
        access_token: String,
        refresh_token: String,
        expires_at: Number,
    },
}, { collection: 'userTokens' });
export const UserModel = mongoose.model('userTokens', userSchema);
class MongoDBProvider {
    constructor(mongoUri) {
        mongoose.connect(mongoUri);
    }
    async fetchUser(userId) {
        const user = await UserModel.findOne({ id: userId });
        if (!user)
            return undefined;
        return user.tokens;
    }
    async createOrUpdate(userId, tokens) {
        //*  Check if user exits
        const user = await UserModel.findOne({ id: userId });
        if (!user) {
            // * Create new user
            const newUser = new UserModel({
                id: userId,
                tokens: tokens,
            });
            await newUser.save();
        }
        else {
            // * Update user
            user.tokens = tokens;
            await user.save();
        }
        return tokens;
    }
    async deleteUser(userId) {
        return UserModel.deleteOne({
            id: userId,
        });
    }
    async findAll() {
        return UserModel.find();
    }
}
export default MongoDBProvider;
//# sourceMappingURL=MongoDB.js.map