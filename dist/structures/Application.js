import { MapProvider } from 'providers/MapStorage';
import Authorization from 'structures/Authorization';
import RESTManager from 'structures/RESTManager';
import TokenStorage from 'structures/TokenStorage';
class Application {
    constructor(options) {
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clientSecret", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "redirectUri", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tokenStorage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "restManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.token = options.token;
        this.id = options.id;
        this.clientSecret = options.clientSecret;
        this.redirectUri = options.redirectUri;
        if (!this.token)
            throw new Error('A token is required in the application options');
        if (!this.id)
            throw new Error('A application ID is required in the application options');
        if (!this.clientSecret)
            throw new Error('A client secret is required in the application options');
        if (!this.redirectUri)
            throw new Error('A redirect URI is required in the application options');
        this.auth = new Authorization(this, options.scopes);
        this.restManager = new RESTManager(this);
        this.tokenStorage = new TokenStorage(options.databaseProvider || new MapProvider());
    }
    async registerMetadata(metadata) {
        if (!metadata)
            throw new Error('Metadata is required to register it in the application.');
        if (metadata.length < 1)
            throw new Error('At least one metadata is required to register it in the application.');
        if (metadata.length > 5)
            throw new Error('You can only register 5 metadata fields in the application.');
        return this.restManager.registerApplicationMetadata(metadata);
    }
    async getUserMetadata(userId) {
        const tokens = await this.tokenStorage.get(userId);
        if (!tokens)
            throw new Error('No tokens found for the user');
        return this.restManager.getMetadata();
    }
    async setUserMetadata(userId, platformName, metadata) {
        const tokens = await this.tokenStorage.get(userId);
        if (!tokens)
            throw new Error('No tokens found for the user');
        return this.restManager.putUserMetadata(platformName, metadata);
    }
    // TODO fix types
    async fetchUser(userId, access_token) {
        let tokens = await this.tokenStorage.get(userId);
        if (!tokens && !access_token)
            throw new Error('No tokens found for the user');
        if (!tokens && access_token)
            tokens = { access_token: access_token, refresh_token: '' };
        return this.restManager.getCurrentAuthorization().then((x) => x.user);
    }
}
export default Application;
//# sourceMappingURL=Application.js.map