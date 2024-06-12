import { Cart, LineItem } from '@commercetools/platform-sdk';
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
    localStorage.setItem('anonymousCartId', response.body.id);
    return response.body;
  } catch (error) {
    console.error('Error creating anonymous cart:', error);
    throw error;
  }
};

export const getAnonymousCart = async (anonymousCartId: string) => {
  try {
    const response = await apiRoot.carts().withId({ ID: anonymousCartId }).get().execute();
    console.log('Existing Anonymous Cart:', response.body);
    return response.body;
  } catch (error) {
    console.error('Error getting anonymous cart:', error);
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

const addLineItemsToCustomerCart = async (customerCart: Cart, lineItems: LineItem[]) => {
  const addLineItemPromises = lineItems.map(async (lineItem) => {
    const sku = lineItem.variant?.sku || '';
    await apiRoot
      .carts()
      .withId({ ID: customerCart.id })
      .post({
        body: {
          version: customerCart.version,
          actions: [
            {
              action: 'addLineItem',
              sku,
              quantity: lineItem.quantity,
            },
          ],
        },
      })
      .execute();
  });

  await Promise.all(addLineItemPromises);
};

export const mergeCarts = async (anonymousCartId: string, customerId: string) => {
  try {
    const anonymousCartResponse = await apiRoot.carts().withId({ ID: anonymousCartId }).get().execute();
    const anonymousCart = anonymousCartResponse.body;

    const customerCartResponse = await createCustomerCart(customerId);
    const customerCart = customerCartResponse;

    await addLineItemsToCustomerCart(customerCart, anonymousCart.lineItems);

    await apiRoot
      .carts()
      .withId({ ID: anonymousCart.id })
      .delete({
        queryArgs: { version: anonymousCart.version },
      })
      .execute();

    console.log('Merged Cart:', customerCart);
    localStorage.removeItem('anonymousCartId');
    return customerCart;
  } catch (error) {
    console.error('Error merging carts:', error);
    throw error;
  }
};
