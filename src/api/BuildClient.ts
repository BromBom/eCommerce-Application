import { ClientBuilder, type AuthMiddlewareOptions, type HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

type UserAuthOptions = {
  username: string;
  password: string;
};

type TokenCache = {
  accessToken: string;
  refreshToken: string;
};

type Credentials = {
  clientId: string;
  clientSecret: string;
  token?: string;
};

type PasswordAuthMiddlewareOptions = AuthMiddlewareOptions & {
  credentials: {
    clientId: string;
    clientSecret: string;
    user: UserAuthOptions;
    token?: string;
  };
  tokenCache?: TokenCache;
};

type RefreshAuthMiddlewareOptions = AuthMiddlewareOptions & {
  credentials: Credentials;
  refreshToken: string;
  oauthUri?: string;
  fetch?: typeof fetch;
  tokenCache?: TokenCache;
};

// Configure authMiddlewareOptions
export const authMiddlewareOptions: AuthMiddlewareOptions & { token: string } = {
  host: process.env.CTP_AUTH_URL || '',
  projectKey: process.env.CTP_PROJECT_KEY || '',
  credentials: {
    clientId: process.env.CTP_CLIENT_ID || '',
    clientSecret: process.env.CTP_CLIENT_SECRET || '',
  },
  scopes: [process.env.CTP_SCOPES || ''],
  token: 'YOUR_ACCESS_TOKEN',
};

// Configure httpMiddlewareOptions
export const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL || '',
  fetch,
};

const username = 'username';
const password = 'userPassword';

const passwordAuthOptions: PasswordAuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL || '',
  projectKey: process.env.CTP_PROJECT_KEY || '',
  credentials: {
    clientId: process.env.CTP_CLIENT_ID || '',
    clientSecret: process.env.CTP_CLIENT_SECRET || '',
    user: {
      username,
      password,
    },
    token: process.env.CTP_AUTH_TOKEN || '',
  },
  scopes: [process.env.CTP_SCOPES || ''],
  fetch,
};

export const anonymousAuthOptions: AuthMiddlewareOptions = {
  ...authMiddlewareOptions,
  credentials: {
    ...authMiddlewareOptions.credentials,
    anonymousId: process.env.CTP_ANONYMOUS_ID || '',
  },
};

const refreshTokenAuthOptions: RefreshAuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL || '',
  projectKey: process.env.CTP_PROJECT_KEY || '',
  credentials: {
    clientId: process.env.CTP_CLIENT_ID || '',
    clientSecret: process.env.CTP_CLIENT_SECRET || '',
  },
  refreshToken: process.env.CTP_REFR_TOKEN || '',
  scopes: [process.env.CTP_SCOPES || ''],
  fetch,
};

export const ctpClientWithPasswordFlow = new ClientBuilder()
  .withPasswordFlow(passwordAuthOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const ctpClientWithAnonymousSession = new ClientBuilder()
  .withAnonymousSessionFlow(anonymousAuthOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const ctpClientWithRefreshTokenFlow = new ClientBuilder()
  .withRefreshTokenFlow(refreshTokenAuthOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient);
