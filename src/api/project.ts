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

export const queryProduct = (): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: 'productType.id:"c86ff9d5-286f-4c4f-bbb2-4dec15255c7c"',
      },
    })
    .execute();
};

queryProduct()
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
