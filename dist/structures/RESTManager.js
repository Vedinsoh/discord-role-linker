/* eslint-disable no-console */
import { GatewayVersion, Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
const jsonHeaders = {
    'Content-Type': 'application/json',
};
class RESTManager {
    constructor(application) {
        Object.defineProperty(this, "_application", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_rest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._application = application;
        this._rest = new REST({ version: GatewayVersion }).setToken(this._application.token);
    }
    async createOauth2Token(code) {
        const body = new URLSearchParams({
            client_id: this._application.id,
            client_secret: this._application.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: this._application.redirectUri,
            code,
        });
        return this._rest.post(Routes.oauth2TokenExchange(), {
            body,
            passThroughBody: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    }
    async refreshOauth2Token(refreshToken) {
        const body = new URLSearchParams({
            client_id: this._application.id,
            client_secret: this._application.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });
        return this._rest.post(Routes.oauth2TokenExchange(), {
            body,
            passThroughBody: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    }
    async registerApplicationMetadata(metadata) {
        return this._rest
            .put(Routes.applicationRoleConnectionMetadata(this._application.id), {
            headers: jsonHeaders,
            body: metadata,
        })
            .then((value) => {
            console.log('Registered application metadata successfully!');
            return value;
        })
            .catch((error) => {
            console.error('Failed to register application metadata!');
            return error;
        });
    }
    async getMetadata() {
        return this._rest.get(Routes.applicationRoleConnectionMetadata(this._application.id), {
            auth: false,
        });
    }
    async putUserMetadata(platformName, metadata) {
        return this._rest.put(Routes.userApplicationRoleConnection(this._application.id), {
            headers: jsonHeaders,
            body: {
                platform_name: platformName,
                metadata: metadata,
            },
            auth: false,
        });
    }
    async getCurrentAuthorization() {
        return this._rest.get(Routes.oauth2CurrentAuthorization(), {
            auth: false,
        });
    }
}
export default RESTManager;
//# sourceMappingURL=RESTManager.js.map