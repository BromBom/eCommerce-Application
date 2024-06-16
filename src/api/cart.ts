import { Cart, CartAddDiscountCodeAction } from '@commercetools/platform-sdk';
import { apiRoot } from './BuildClient';
import { CustomError } from '../app/types/types';

export const createAnonymousCart = async () => {
  try {
    const response = await apiRoot
      .carts()
      .post({
        body: {
          currency: 'USD',
          anonymousId: 'anonymous-session-id',
        },
      })
      .execute();

    console.log('New Anonymous Cart created:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error creating anonymous cart:', error);
    throw error;
  }
};

export const getCartByID = async (cartId: string) => {
  try {
    const response = await apiRoot.carts().withId({ ID: cartId }).get().execute();
    console.log('Existing Cart by ID:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error getting cart by ID:', error);
    throw error;
  }
};

export const createCustomerCart = async (customerId: string) => {
  try {
    const response = await apiRoot
      .carts()
      .post({
        body: {
          currency: 'USD',
          customerId,
        },
      })
      .execute();

    console.log('Customer Cart created:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error creating customer cart:', error);
    throw error;
  }
};

export const addProductToCart = async (cart: Cart, productId: string) => {
  try {
    const response = await apiRoot
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: 'addLineItem',
              productId,
              quantity: 1,
            },
          ],
        },
      })
      .execute();

    console.log('Product added in cart:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error adding product in cart:', error);
    throw error;
  }
};

export const changeQuantityProductsInCart = async (cart: Cart, lineItemId: string, quantity: number) => {
  try {
    const response = await apiRoot
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId,
              quantity,
            },
          ],
        },
      })
      .execute();

    console.log('Quantity changed in cart:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error changing quantity in cart:', error);
    throw error;
  }
};

export const removeProductFromCart = async (cart: Cart, lineItemId: string) => {
  try {
    const response = await apiRoot
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId,
            },
          ],
        },
      })
      .execute();

    console.log('Product added in cart:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error adding product in cart:', error);
    throw error;
  }
};

export const removeCart = async (cart: Cart) => {
  try {
    const response = await apiRoot
      .carts()
      .withId({ ID: cart.id })
      .delete({
        queryArgs: {
          version: cart.version,
        },
      })
      .execute();

    console.log('Product added in cart:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error adding product in cart:', error);
    throw error;
  }
};

export const addDiscountCodeToCart = async (cart: Cart, discountCode: string): Promise<void> => {
  try {
    const addDiscountCodeAction: CartAddDiscountCodeAction = {
      action: 'addDiscountCode',
      code: discountCode,
    };

    const response = await apiRoot
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [addDiscountCodeAction],
        },
      })
      .execute();

    const updatedCart = response.body;
    console.log('Discount code added successfully:', updatedCart);
  } catch (error: unknown) {
    const customError = error as CustomError;
    console.error('Error adding discount code to cart:', customError);
    throw new Error(customError.body?.message || 'Failed to add discount code');
  }
};
