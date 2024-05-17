// import fetch from 'node-fetch';
import { ClientBuilder, AuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

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

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL || '',
  fetch,
};

// Create ctpClient using ClientBuilder
const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient);

export const projectKey: string | undefined = process.env.CTP_PROJECT_KEY;

// Функция для создания клиента кастомеров
export const createCustomerClient = () => {
  return ctpClient;
};

// Функция для создания API кастомеров
export const createCustomerApi = () => {
  return createApiBuilderFromCtpClient(ctpClient);
};

export default ctpClient;
