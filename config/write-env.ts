import * as fs from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

const dotenv = config()?.parsed;

const ENV_KEY_API_KEY = 'GOOGLE_API_KEY';
const ENV_KEY_CLINET_ID = 'GOOGLE_API_CLIENT_ID';

const env = {
  apiKey: process.env[ENV_KEY_API_KEY],
  clientId: process.env[ENV_KEY_CLINET_ID],
};

if (dotenv) {
  env.apiKey = dotenv[ENV_KEY_API_KEY];
  env.clientId = dotenv[ENV_KEY_CLINET_ID];
}

const contents = 'export const googleApi = ' + JSON.stringify(env);
fs.writeFileSync(
  join(__dirname, '../src/environments/google-api.ts'),
  contents
);
