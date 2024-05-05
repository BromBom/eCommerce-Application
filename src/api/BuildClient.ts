import fetch from 'node-fetch';
import { ClientBuilder, type AuthMiddlewareOptions, type HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey: 'jsfe2023q4shop',
  credentials: {
    clientId: 'QOVU7-WB1ds0e3pySCwjJzsX',
    clientSecret: 'LZYnjQEACoIp0bf3ANZ2poRnYjoQiKjC',
  },
  scopes: [
    'manage_my_shopping_lists:jsfe2023q4shop:the-good-store view_shopping_lists:jsfe2023q4shop:the-good-store view_orders:jsfe2023q4shop:the-good-store manage_shopping_lists:jsfe2023q4shop:the-good-store view_api_clients:jsfe2023q4shop manage_orders:jsfe2023q4shop:the-good-store manage_cart_discounts:jsfe2023q4shop:the-good-store manage_project:jsfe2023q4shop manage_my_orders:jsfe2023q4shop:the-good-store view_cart_discounts:jsfe2023q4shop:the-good-store view_customers:jsfe2023q4shop:the-good-store manage_my_profile:jsfe2023q4shop:the-good-store manage_customers:jsfe2023q4shop:the-good-store manage_api_clients:jsfe2023q4shop',
  ],
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export default ctpClient;
