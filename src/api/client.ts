import { createClient, createHttpClient, createAuthForClientCredentialsFlow } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import dotenv from 'dotenv';
import * as path from 'path';

const dotenvPath = path.resolve(__dirname, '.env');
dotenv.config({ path: dotenvPath });

const getClient = () => {
  const authMiddleware = createAuthForClientCredentialsFlow({
    host: process.env.CTP_AUTH_URL || '',
    projectKey: process.env.CTP_PROJECT_KEY || '',
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

export const projectKey: string | undefined = process.env.CTP_PROJECT_KEY;

// Функция для создания клиента кастомеров
export const createCustomerClient = () => {
  return getClient();
};

// Функция для создания API кастомеров
export const createCustomerApi = () => {
  return createApiBuilderFromCtpClient(getClient());
};
