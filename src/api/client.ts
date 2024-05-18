import { createClient, createHttpClient, createAuthForClientCredentialsFlow } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import fetch from 'node-fetch';

const projectKey: string | undefined = process.env.CTP_PROJECT_KEY;

const getClient = () => {
  const authMiddleware = createAuthForClientCredentialsFlow({
    host: process.env.CTP_AUTH_URL || '',
    projectKey: projectKey || '',
    credentials: {
      clientId: process.env.CTP_CLIENT_ID || '',
      clientSecret: process.env.CTP_CLIENT_SECRET || '',
    },
    fetch,
  });

  const httpMiddleware = createHttpClient({
    host: process.env.CTP_API_URL || '',
    fetch,
  });

  const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
  });

  return client;
};

export const apiRoot = createApiBuilderFromCtpClient(getClient());

export { projectKey };
