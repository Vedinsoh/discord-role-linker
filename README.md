# Discord Role Linker
A powerful library to easily manage your Discord linked roles!

## Basic usage
### Create your Discord application
- Create a new application on the [Discord Developer Portal](https://discord.com/developers/applications)
- Create a new bot and copy the bot token
- Go to the **General Information** tab and set the following: `http://localhost:3000/linked-role` in the **Linked roles verification URL** field
- Go to the **OAuth2** tab and add the following URI in the **Redirects** section: `http://localhost:3000/auth-callback`
- On the same page, copy your **Client Secret**, above the Redirects section

### Install Discord Role Linker:
```
npm install discord-role-linker
yarn add discord-role-linker
pnpm add discord-role-linker
```

### Create your application
Instantiate the role linker by filling in your application parameters like so:
```js
const { RoleLinker } = require('discord-role-linker');

const roleLinker = new RoleLinker({
    token: 'YOUR BOT TOKEN',
    clientId: 'YOUR CLIENT ID',
    clientSecret: 'YOUR CLIENT SECRET',
    redirectUri: 'YOUR REDIRECT URI',
});
```
In order for your application to work, you need to register your metadata first. Metadata is what will show in your Links tab in Roles settings, as well as user's Linked Roles modal when they link their accounts. You can register up to 5 metadata entries:
```js
const { MetadataTypes } = require('discord-role-linker');

roleLinker.registerMetaData([
    {
        key: 'level',
        name: 'Level',
        description: 'Minimum user level',
        type: MetadataTypes.Number.GreaterThanOrEqual,
    },
    {
        key: 'account_age',
        name: 'Account age',
        description: 'Minimum days since account creation',
        type: MetadataTypes.DateTime.GreaterThanOrEqual,
    }
]);
```

## Setting up your backend
In the example below, we will use [Express](https://expressjs.com/) and [cookie-parser](https://www.npmjs.com/package/cookie-parser) to set up our backend
```
npm install express cookie-parser
yarn add express cookie-parser
pnpm add express cookie-parser
```
```js
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('node:crypto');

// ...your RoleLinker instance

const app = express();

app.use(cookieParser(crypto.randomUUID()));

// Set the cookie and redirect to the Discord OAuth2 page
app.get('/linked-role', roleLinker.auth.setCookieAndRedirect.bind(roleLinker.auth));

app.get('/auth-callback', async (req, res) => {
    try {
        // Verifies if the cookie matches the one given on the /linked-role route
        const code = roleLinker.auth.verifyCookieAndReturnCode(req, res);
        if (!code) return res.sendStatus(403);

        // Gets the user and stores the tokens
        const user = await roleLinker.auth.getUserAndStoreToken(code);
        
        // Set user's metadata
        roleLinker.setUserMetadata(user.id, user.username ,{ level: 24, account_age: Date.now() })
        res.send("Your account has been linked successfully!")
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

// Start the server on port 3000
app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
```


## Getting the user's metadata
- You can get the user metadata by using the `getUserMetadata` method.
```js
const metadata = await roleLinker.getUserMetaData(userId);
```
## Fetching the user
- You can fetch the user by using the `fetchUser` method
```js
const user = await roleLinker.fetchUser(userId);
```


## Updating metadata of the users
- From time to time, you might want to update your user's metadata
- In the background, the library stores the user's metadata in a database, or in memory if you are not using a database provider (more info on that below)
```js
const updateUser = async (userId) => {
    const user = await roleLinker.fetchUser(userId);
    roleLinker.setUserMetadata(user.id, user.username, { level: 123, account_age: Date.now() })
}

const updateAllUsers = async () => {
    const users = await roleLinker.tokenStore.getAllUsers();

    // Make sure to handle your update calls accordingly to avoid hitting rate limits. You could either use setTimeout or a promise queue manager of your choice, such as p-queue
    users.forEach(async (user) => {
        await updateMetadata(user.id);
    })
}
```
## Persistent storage of the access tokens
- By default, the library stores the access tokens in memory using Maps. This means that if you restart your application, all the access tokens will be lost. You can overcome this by using a database provider in your RoleLinker constructor:

```js
const { RoleLinker } = require('discord-role-linker');
const { MongoDBProvider } = require('discord-role-linker');

const roleLinker = new RoleLinker({
    token: 'YOUR BOT TOKEN',
    clientId: 'YOUR CLIENT ID',
    clientSecret: 'YOUR CLIENT SECRET',
    redirectUri: 'YOUR REDIRECT URI',
    databaseProvider: new MongoDBProvider('mongodb://localhost:27017/linked-roles')
});
```
You can use one of the following built-in providers to store the access tokens in a database:
- MongoDB
- Redis
- Your custom provider (coming soon)


# Bugs, glitches and issues

If you encounter any problems feel free to open an issue or message me on Discord: `Vedinsoh#0001`</a>
