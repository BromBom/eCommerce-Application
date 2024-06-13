import { CartAddDiscountCodeAction } from '@commercetools/platform-sdk';
import { apiRoot } from './BuildClient';

interface LineItem {
  id: string;
  productId: string;
  variant: {
    sku?: string;
  };
  quantity: number;
}

interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
}

export const getOrCreateAnonymousCart = async (): Promise<Cart> => {
  const existingCartId = localStorage.getItem('anonymousCartId');
  if (existingCartId) {
    try {
      const response = await apiRoot.carts().withId({ ID: existingCartId }).get().execute();
      if (response.body) {
        console.log('Existing Anonymous Cart:', response.body);
        return response.body as Cart;
      }
    } catch (error) {
      console.error('Error fetching existing anonymous cart:', error);
      localStorage.removeItem('anonymousCartId');
    }
  }
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
    return response.body as Cart;
  } catch (error) {
    console.error('Error creating anonymous cart:', error);
    throw error;
  }
};

export const createCustomerCart = async (customerId: string): Promise<Cart> => {
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

    const customerCart = await createCustomerCart(customerId);

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
  } catch (error) {
    console.error('Error adding discount code to cart:', error);
  }
};
