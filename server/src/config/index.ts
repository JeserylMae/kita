import path from 'path';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

const requiredEnv = ( key: string ) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export default {
  port: requiredEnv('PORT'),
  domain: requiredEnv('DOMAIN'),

  databaseURL: requiredEnv('DATABASE_URL'),
  dbSecret: requiredEnv('DB_SECRET_KEY'),

  mailAPI: requiredEnv('MAIL_API'),
  mailAddress: requiredEnv('MAIL_ADDRESS'),

  tokenIss: requiredEnv('TOKEN_ISS'),
  tokenAud: requiredEnv('TOKEN_AUD'),
  signingAlg: requiredEnv('SIGNING_ALG'),
  expDuration: requiredEnv('EXP_DURATION'),

  privateKey: readFileSync(
    path.resolve( process.cwd(), 'private.pem'),
    'utf-8'
  ),
};
