import { LocalizedString } from '@commercetools/platform-sdk';

export interface OptionsListener {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

export type InputType =
  | 'text'
  | 'button'
  | 'email'
  | 'password'
  | 'checkbox'
  | 'color'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'number'
  | 'search'
  | 'submit'
  | 'time';

export interface ProductType {
  id: string;
  version: number;
  productType: {
    typeId: string;
    id: string;
  };
  name: LocalizedString;
  description?: LocalizedString;
  categories: {
    typeId: string;
    id: string;
  }[];
  slug: LocalizedString;
  masterVariant: {
    attributes: {
      name: string;
      value: string;
    }[];
    images: {
      url: string;
      dimensions: {
        w: number;
        h: number;
      };
    }[];
    prices: {
      id: string;
      discount: string;
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
    }[];
    sku: string;
  };
  key: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface ProductResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: ProductType[];
}

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantityInStock: number;
  qty: number;
  description: string;
}

export interface CustomError extends Error {
  body?: {
    message?: string;
  };
}
