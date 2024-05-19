interface UserInfo {
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
  isAdmin: boolean;
}

interface CartItem {
  // свойства корзины
}

export const getCartItems = (): CartItem[] => {
  const cartItemsString: string | null = localStorage.getItem('cartItems');
  const cartItems: CartItem[] = cartItemsString ? JSON.parse(cartItemsString) : [];
  return cartItems;
};

export const setCartItems = (cartItems: CartItem[]): void => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

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
