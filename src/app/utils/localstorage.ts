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

export const getCartItems = (): CartItem[] => {
  const cartItemsString: string | null = localStorage.getItem('cartItems');
  const cartItems: CartItem[] = cartItemsString ? JSON.parse(cartItemsString) : [];
  return cartItems;
};

export const setCartItems = (cartItems: CartItem[]): void => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

const addToCart = (item: CartItem, forceUpdate = false): void => {
  const cartItems = getCartItems();
  const existItemIndex = cartItems.findIndex((x: CartItem) => x.product === item.product);
  if (existItemIndex !== -1) {
    if (forceUpdate) {
      cartItems[existItemIndex] = item;
    }
  } else {
    cartItems.push(item);
  }
  setCartItems(cartItems);
};

const removeFromCart = (id: string): void => {
  setCartItems(getCartItems().filter((x: CartItem) => x.product !== id));
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
