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

// getProject().then(console.log).catch(console.error);

// apiRoot
//   .shoppingLists()
//   .withId({ ID: 'a-shoppinglist-id' })
//   .get()
//   .execute()
//   .then(({ body }) => {
//     console.log(JSON.stringify(body));
//   })
//   .catch(console.error);

export const searchProduct = async (query: string): Promise<ProductProjectionPagedSearchResponse> => {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        'text.en-US': query,
        fuzzy: true,
      },
    })
    .execute()
    .then((response) => response.body)
    .catch((error) => {
      console.error('ERROR during search:', error);
      throw error;
    });
};

export const searchProductbyID = async (
  productId: string
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: `id:"${productId}"`,
      },
    })
    .execute();
};

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

// export const filterProductList = async (): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
//   return (
//     apiRoot
//       // .productProjections()
//       // .search()
//       // .get({
//       // queryArgs: {
//       // filter: 'masterData.current.masterVariant.attributes'
//       // },
//       // })
//       // .execute();
//       .productProjections()
//       .search()
//       .get({
//         queryArgs: {
//           limit: 500,
//           // where: 'variants.prices.discounted:exists',
//           // where: 'masterVariant(attributes(color = "#F00000"))',
//           // where: 'masterVariant.attributes.[1].color: "#FECB69"',
//           'filter.query': 'variants.attributes.color_attributes.key:"black"',
//           // facet: 'm'
//         },
//       })
//       .execute()
//   );
// };
