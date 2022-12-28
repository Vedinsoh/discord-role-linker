export class MapProvider {
    constructor() {
        Object.defineProperty(this, "tokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    async fetchUser(userId) {
        return this.tokens.get(userId);
    }
    async createOrUpdate(userId, tokens) {
        this.tokens.set(userId, tokens);
        return tokens;
    }
    async deleteUser(userId) {
        const isDeleted = this.tokens.delete(userId);
        if (!isDeleted)
            throw 'User not found';
        return isDeleted;
    }
    async findAll() {
        return Object.entries(this.tokens).map(([key, value]) => ({
            id: key,
            tokens: value,
        }));
    }
}
//# sourceMappingURL=MapStorage.js.map