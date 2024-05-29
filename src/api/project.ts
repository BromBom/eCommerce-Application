import {
  createApiBuilderFromCtpClient,
  ProductProjectionPagedSearchResponse,
  ClientResponse,
} from '@commercetools/platform-sdk';
import { ctpClient } from './BuildClient';

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: 'jsfe2023q4shop' });

export const getProject = () => {
  return apiRoot.get().execute();
};

getProject().then(console.log).catch(console.error);

apiRoot
  .shoppingLists()
  .withId({ ID: 'a-shoppinglist-id' })
  .get()
  .execute()
  .then(({ body }) => {
    console.log(JSON.stringify(body));
  })
  .catch(console.error);

export const queryProduct = (categoryId?: string): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  const filter = categoryId ? `categories.id:"${categoryId}"` : 'productType.id:"c86ff9d5-286f-4c4f-bbb2-4dec15255c7c"';
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter,
      },
    })
    .execute();
};

export const sortProductClothing = () => {
  return queryProduct('8da9d730-fdd3-4313-8814-20cd01dc7efd');
};

export const sortProductShoes = () => {
  return queryProduct('292321b7-b3d4-42d5-b150-b1fecde7d470');
};

export const sortProductAccessories = () => {
  return queryProduct('8cf8b1ac-7dfd-4405-9318-1582a38b6b26');
};
