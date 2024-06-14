import { apiRoot } from '../../api/BuildClient';
import { getCartByID, addDiscountCodeToCart } from '../../api/cart';
import { CartItem } from '../types/types';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
  isAdmin: boolean;
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

  // Обновление анонимной корзины на сервере
  try {
    const anonymousCartId = localStorage.getItem('anonymousCartId');
    const anonymousCart = await getCartByID(anonymousCartId!);
    const foundLineItem = anonymousCart.lineItems.find((lineItem) => lineItem.productId === item.product);
    if (foundLineItem) {
      await apiRoot
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
    } else {
      await apiRoot
        .carts()
        .withId({ ID: anonymousCart.id })
        .post({
          body: {
            version: anonymousCart.version,
            actions: [
              {
                action: 'addLineItem',
                productId: item.product,
                quantity: item.quantityInStock,
              },
            ],
          },
        })
        .execute();
    }
  } catch (error) {
    console.error('Error adding item to anonymous cart:', error);
  }
};

const removeFromCart = async (id: string): Promise<void> => {
  setCartItems(getCartItems().filter((x: CartItem) => x.product !== id));

  // Обновление анонимной корзины на сервере
  try {
    const anonymousCartId = localStorage.getItem('anonymousCartId');
    const anonymousCart = await getCartByID(anonymousCartId!);
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

export async function applyDiscountCode() {
  const discountCode = 'ADIDASFORUS';
  const cart = await getCartByID('anonymousCartId');
  await addDiscountCodeToCart(cart, discountCode);
}

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
