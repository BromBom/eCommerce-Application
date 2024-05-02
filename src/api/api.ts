import fetch from 'node-fetch';
import {
    ClientBuilder,
    type AuthMiddlewareOptions,
    type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: 'jsfe2023q4shop',
    credentials: {
        clientId: "FQcuZeXiU_ie88Defv3aTBsG",
        clientSecret: "Nv2RGFA94mE_mcurbgLMBRdoImwp0wTH",
    },
    scopes: ['create_anonymous_token:jsfe2023q4shop manage_my_business_units:jsfe2023q4shop manage_my_quote_requests:jsfe2023q4shop manage_my_profile:jsfe2023q4shop manage_my_quotes:jsfe2023q4shop manage_my_orders:jsfe2023q4shop manage_my_shopping_lists:jsfe2023q4shop manage_my_payments:jsfe2023q4shop view_categories:jsfe2023q4shop view_published_products:jsfe2023q4shop'],
    fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();