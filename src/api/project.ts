import {
  createApiBuilderFromCtpClient,
  ProductProjectionPagedSearchResponse,
  ClientResponse,
} from '@commercetools/platform-sdk';
import { ctpClient } from './BuildClient';

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: 'jsfe2023q4shop' });

export const searchProduct = async (query: string): Promise<ProductProjectionPagedSearchResponse> => {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: `productType.id:"c86ff9d5-286f-4c4f-bbb2-4dec15255c7c"`,
        'text.en-US': query,
        fuzzy: true,
        limit: 60,
      },
    })
    .execute()
    .then((response) => response.body)
    .catch((error) => {
      console.log('ERROR during search:', error);
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
        limit: 60,
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
        limit: 60,
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

export const sortProductbyASC = async (): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: `productType.id:"c86ff9d5-286f-4c4f-bbb2-4dec15255c7c"`,
        sort: 'price asc',
        limit: 60,
      },
    })
    .execute();
};

export const filterProductListColor = async (
  color: string
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  const colorFilters = `variants.attributes.colortype:"${color}"`;

  const filters = [`productType.id:"c86ff9d5-286f-4c4f-bbb2-4dec15255c7c"`, colorFilters];

  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: filters,
      },
    })
    .execute();
};

export const filterProductListSize = async (
  size: string
): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> => {
  const sizeFilters = `variants.attributes.sizeClothing.key:"${encodeURIComponent(size)}"`;

  const filters = [`productType.id:"c86ff9d5-286f-4c4f-bbb2-4dec15255c7c"`, sizeFilters];

  return apiRoot
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: filters,
      },
    })
    .execute();
};
