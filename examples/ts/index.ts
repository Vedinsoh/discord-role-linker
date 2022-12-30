// @ts-nocheck
import cookieParser from 'cookie-parser';
import { MetadataTypes, RoleLinker } from 'discord-role-linker';
import 'dotenv/config';
import express from 'express';
import crypto from 'node:crypto';

const roleLinker = new RoleLinker({
  token: process.env.BOT_TOKEN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

roleLinker.metadata.register([
  {
    key: 'level',
    name: 'Level',
    description: 'Minimum user level',
    type: MetadataTypes.Integer.GreaterThanOrEqual,
  },
]);

const app = express();

app.use(cookieParser(crypto.randomUUID()));
app.get('/linked-role', roleLinker.auth.init.bind(roleLinker.auth));
app.get('/oauth-callback', async (req, res) => {
  try {
    // Verifies if the cookie equals the one given on the /linked-role route
    const code = roleLinker.auth.verifyCode(req);
    // Invalid Cookie
    if (!code) return res.sendStatus(403);

    // Gets the user and stores the tokens
    const user = await roleLinker.getUserAndStoreToken(code);

    // Set user's metadata
    await roleLinker.metadata.setUserData(user.id, user.username, {
      level: 24,
    });

    setTimeout(async () => {
      console.log(await roleLinker.getUserMetadata(user.id));
    }, 5000);
    res.send('Successfully linked your account!');
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
