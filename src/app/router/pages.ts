interface PagesProps {
  REGISTRATION: string;
  LOGIN: string;
  PRODUCT: string;
  PRODUCTS: string;
  NOT_FOUND: string;
  PROFILE: string;
  CART: string;
  [key: string]: string;
}

const Pages: PagesProps = {
  REGISTRATION: 'registration',
  LOGIN: 'login',
  PRODUCT: 'product',
  PRODUCTS: 'details',
  NOT_FOUND: 'not-found',
  PROFILE: 'Profile',
  LOGOUT: 'Logout',
  CART: 'cart',
};

const ID_SELECTOR = '{id}';

export { Pages, ID_SELECTOR };
