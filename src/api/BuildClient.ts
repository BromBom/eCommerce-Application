import fetch from 'node-fetch';
import { ClientBuilder, type AuthMiddlewareOptions, type HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';

import dotenv from 'dotenv';

dotenv.config();

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL || '',
  projectKey: process.env.CTP_PROJECT_KEY || '',
  credentials: {
    clientId: process.env.CTP_CLIENT_ID || '',
    clientSecret: process.env.CTP_CLIENT_SECRET || '',
  },
  scopes: [process.env.CTP_SCOPES || ''],
  fetch,
};

console.log('Project Key:', process.env.CTP_PROJECT_KEY);
console.log('Auth URL:', process.env.CTP_AUTH_URL);
console.log('API URL:', process.env.CTP_API_URL);

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL || '',
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export default ctpClient;
