import crypto from 'node:crypto';
import { DefaultRestOptions as RestOptions } from '@discordjs/rest';
export const defaultScopes = ['role_connections.write', 'identify'];
class Authorization {
    constructor(application, scopes) {
        Object.defineProperty(this, "_application", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_scopes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: defaultScopes
        });
        this._application = application;
        if (scopes)
            this._scopes = scopes;
    }
    getOAuthUrl() {
        const uuid = crypto.randomUUID(); // TODO
        const url = new URL(`${RestOptions.api}/oauth2/authorize`);
        url.searchParams.set('client_id', this._application.id);
        url.searchParams.set('prompt', 'consent');
        url.searchParams.set('redirect_uri', this._application.redirectUri);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('state', uuid);
        url.searchParams.set('scope', this._scopes.join(' '));
        return { state: uuid, url: url.toString() };
    }
    async getOAuthTokens(code) {
        return this._application.restManager.createOauth2Token(code);
    }
    async getUserAndStoreToken(code) {
        const tokens = await this.getOAuthTokens(code);
        // TODO: Fix this
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const user = await this._application.fetchUser(null, tokens.access_token);
        this._application.tokenStorage.set(user.id, tokens);
        return user;
    }
    async getAccessToken(userId) {
        const tokens = await this._application.tokenStorage.get(userId);
        if (!tokens)
            throw new Error('No tokens found for user');
        if (tokens.expires_at < Date.now()) {
            // TODO fix any type
            const response = await this._application.restManager.refreshOauth2Token(tokens.refresh_token);
            if (response) {
                const tokens = response;
                tokens.expires_at = Date.now() + tokens.expires_in * 1000;
                // * Store Tokens
                this._application.tokenStorage.set(userId, tokens);
                return tokens.access_token;
            }
            else {
                throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
            }
        }
        return tokens.access_token;
    }
    setCookieAndRedirect(_req, res) {
        const { state, url } = this.getOAuthUrl();
        // * Store the signed state param in the user's cookies so we can verify the value later. See: https://discord.com/developers/docs/topics/oauth2#state-and-security
        res.cookie('clientState', state, {
            maxAge: 1000 * 60 * 5,
            signed: true,
        });
        return res.redirect(url);
    }
    verifyCookieAndReturnCode(req) {
        const code = req.query['code'];
        const discordState = req.query['state'];
        // * Make sure the state parameter exists
        const { clientState } = req.signedCookies;
        if (clientState !== discordState)
            return null;
        return code;
    }
}
export default Authorization;
//# sourceMappingURL=Authorization.js.map