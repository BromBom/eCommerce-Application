import { Cart } from '@commercetools/platform-sdk';
import { apiRoot } from './BuildClient';

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

export const mergeCartByCustomerID = async (cart: Cart, customerId: string) => {
  try {
    const response = await apiRoot
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: 'setCustomerId',
              customerId,
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

export const getCartByCustomerID = async (customerId: string) => {
  try {
    const response = await apiRoot.carts().withCustomerId({ customerId }).get().execute();
    console.log('Existing Cart by ID:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error getting cart by ID:', error);
    throw error;
  }
};

// const addLineItemsToCustomerCart = async (customerCart: Cart, lineItems: LineItem[]) => {
//   const addLineItemPromises = lineItems.map(async (lineItem) => {
//     const sku = lineItem.variant?.sku || '';
//     await apiRoot
//       .carts()
//       .withId({ ID: customerCart.id })
//       .post({
//         body: {
//           version: customerCart.version,
//           actions: [
//             {
//               action: 'addLineItem',
//               sku,
//               quantity: lineItem.quantity,
//             },
//           ],
//         },
//       })
//       .execute();
//   });

//   await Promise.all(addLineItemPromises);
// };

// export const mergeCarts = async (anonymousCartId: string, customerId: string) => {
//   try {
//     const anonymousCartResponse = await apiRoot.carts().withId({ ID: anonymousCartId }).get().execute();
//     const anonymousCart = anonymousCartResponse.body;

//     const customerCartResponse = await createCustomerCart(customerId);
//     const customerCart = customerCartResponse;

//     await addLineItemsToCustomerCart(customerCart, anonymousCart.lineItems);

//     await apiRoot
//       .carts()
//       .withId({ ID: anonymousCart.id })
//       .delete({
//         queryArgs: { version: anonymousCart.version },
//       })
//       .execute();

//     console.log('Merged Cart:', customerCart);
//     localStorage.removeItem('anonymousCartId');
//     return customerCart;
//   } catch (error) {
//     console.error('Error merging carts:', error);
//     throw error;
//   }
// };
