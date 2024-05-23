import {
  createClient,
  createAuthForClientCredentialsFlow,
  createHttpClient,
  MethodType,
  ClientRequest,
} from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';
import { anonymousAuthOptions, authMiddlewareOptions, ctpClientWithAnonymousSession } from './BuildClient';

async function getAnonymousToken() {
  try {
    const { clientId, clientSecret } = anonymousAuthOptions.credentials;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch(
      'https://auth.europe-west1.gcp.commercetools.com/oauth/jsfe2023q4shop/anonymous/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch anonymous token: ${response.status} ${response.statusText}`);
    }

    const tokenData = await response.json();
    if (!tokenData || typeof tokenData !== 'object' || !('access_token' in tokenData)) {
      throw new Error('Invalid token data received');
    }

    return tokenData.access_token;
  } catch (error) {
    console.error('Error fetching anonymous token:', error);
    throw error;
  }
}

async function getDataWithAnonymousSession() {
  try {
    const response = await ctpClientWithAnonymousSession.execute({
      uri: 'https://api.europe-west1.gcp.commercetools.com/jsfe2023q4shop/',
      method: 'GET' as MethodType,
    });

    console.log('Response:', response.body);
  } catch (error) {
    console.error('Error:', error);
  }
}

getDataWithAnonymousSession();

export async function getClientAnonymous() {
  const token = await getAnonymousToken();
  const authMiddleware = createAuthForClientCredentialsFlow({
    ...anonymousAuthOptions,
    fetch,
  });

  const httpMiddleware = createHttpClient({
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
  });

  const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
  });

  const request: ClientRequest = {
    uri: 'https://api.europe-west1.gcp.commercetools.com/jsfe2023q4shop/',
    method: 'GET' as MethodType,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const result = await client.execute(request);
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  return client;
}

export async function getClientWithCredentials() {
  const authMiddleware = createAuthForClientCredentialsFlow({
    ...authMiddlewareOptions,
    fetch,
  });

  const httpMiddleware = createHttpClient({
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
  });

  const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
  });

  const request: ClientRequest = {
    uri: 'https://api.europe-west1.gcp.commercetools.com/jsfe2023q4shop/',
    method: 'GET' as MethodType,
    headers: {
      Authorization: `Bearer ${await getAnonymousToken()}`,
    },
  };

  try {
    const result = await client.execute(request);
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  return client;
}
console.log(getClientAnonymous, getClientWithCredentials);
