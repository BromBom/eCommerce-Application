import { CartAddLineItemAction } from '@commercetools/platform-sdk';
import { apiRoot } from '../../api/BuildClient';
import { getOrCreateAnonymousCart } from '../../api/cart';
import { CartItem } from '../types/types';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
  isAdmin: boolean;
}

interface LineItem {
  id: string;
  productId: string;
  quantity: number;
}

interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
}

export const parseRequestUrl = () => {
  const address = document.location.hash.slice(1).split('?')[0];

  const queryString =
    document.location.hash.slice(1).split('?').length === 2 ? document.location.hash.slice(1).split('?')[1] : '';

  const url = address.toLowerCase();
  const r = url.split('/');
  const q = queryString.split('=');
  return {
    resource: r[1],
    id: r[2],
    verb: r[3],
    name: q[0],
    value: q[1],
  };
};

export interface Component {
  render: () => Promise<string>;
  after_render: () => Promise<void> | void;
}

export const rerender = async (component: Component): Promise<void> => {
  const mainContainer = document.getElementById('main-container');
  if (mainContainer) {
    mainContainer.innerHTML = await component.render();
    await component.after_render();
  } else {
    console.error('Main container not found');
  }
};

const getCartItems = (): CartItem[] => {
  const cartItemsString: string | null = localStorage.getItem('cartItems');
  const cartItems: CartItem[] = cartItemsString ? JSON.parse(cartItemsString) : [];
  return cartItems;
};

const setCartItems = (cartItems: CartItem[]): void => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

const addToCart = async (item: CartItem, forceUpdate = false): Promise<void> => {
  const cartItems = getCartItems();
  const existItemIndex = cartItems.findIndex((x: CartItem) => x.product === item.product);

  if (existItemIndex !== -1) {
    if (forceUpdate) {
      cartItems[existItemIndex] = item;
    } else {
      cartItems[existItemIndex].quantityInStock += item.quantityInStock;
    }
  } else {
    cartItems.push(item);
  }
  setCartItems(cartItems);

  const updateCart = async (anonymousCart: Cart, retryCount = 0, maxRetries = 5): Promise<void> => {
    if (retryCount >= maxRetries) {
      console.error('Failed to update cart after multiple attempts due to concurrent modification.');
      return;
    }

    try {
      const foundLineItem = anonymousCart.lineItems.find((lineItem) => lineItem.productId === item.product);
      let updatedCart;

      if (foundLineItem) {
        const response = await apiRoot
          .carts()
          .withId({ ID: anonymousCart.id })
          .post({
            body: {
              version: anonymousCart.version,
              actions: [
                {
                  action: 'changeLineItemQuantity',
                  lineItemId: foundLineItem.id,
                  quantity: item.quantityInStock,
                },
              ],
            },
          })
          .execute();
        updatedCart = response.body;
      } else {
        const addAction: CartAddLineItemAction = {
          action: 'addLineItem',
          productId: item.product,
          quantity: item.quantityInStock,
        };
        const response = await apiRoot
          .carts()
          .withId({ ID: anonymousCart.id })
          .post({
            body: {
              version: anonymousCart.version,
              actions: [addAction],
            },
          })
          .execute();
        updatedCart = response.body;
      }

      localStorage.setItem('anonymousCartId', updatedCart.id);
      localStorage.setItem('anonymousCartVersion', String(updatedCart.version));
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('ConcurrentModification')) {
        console.warn('Concurrent modification detected. Retrying with latest version.');
        const newAnonymousCart = await getOrCreateAnonymousCart();
        await updateCart(newAnonymousCart, retryCount + 1, maxRetries);
      } else {
        throw error;
      }
    }
  };

  try {
    const anonymousCart = await getOrCreateAnonymousCart();
    await updateCart(anonymousCart);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error adding item to anonymous cart:', error.message);
    } else {
      console.error('Unknown error adding item to anonymous cart');
    }
  }
};

const removeFromCart = async (id: string): Promise<void> => {
  setCartItems(getCartItems().filter((x: CartItem) => x.product !== id));

  // Обновление анонимной корзины на сервере
  try {
    const anonymousCart = await getOrCreateAnonymousCart();
    const foundLineItem = anonymousCart.lineItems.find((lineItem) => lineItem.productId === id);
    if (foundLineItem) {
      await apiRoot
        .carts()
        .withId({ ID: anonymousCart.id })
        .post({
          body: {
            version: anonymousCart.version,
            actions: [
              {
                action: 'removeLineItem',
                lineItemId: foundLineItem.id,
              },
            ],
          },
        })
        .execute();
    }
  } catch (error) {
    console.error('Error removing item from anonymous cart:', error);
  }
};

export { addToCart, removeFromCart };

export const setUserInfo = ({
  _id = '',
  name = '',
  email = '',
  password = '',
  token = '',
  isAdmin = false,
}: Partial<UserInfo>): void => {
  localStorage.setItem(
    'userInfo',
    JSON.stringify({
      _id,
      name,
      email,
      password,
      token,
      isAdmin,
    })
  );
};

export const clearUser = (): void => {
  localStorage.removeItem('userInfo');
};

export const getUserInfo = (): UserInfo => {
  const userInfoString: string | null = localStorage.getItem('userInfo');
  const userInfo: UserInfo = userInfoString
    ? JSON.parse(userInfoString)
    : {
        _id: '',
        name: '',
        email: '',
        password: '',
        token: '',
        isAdmin: false,
      };
  return userInfo;
};
