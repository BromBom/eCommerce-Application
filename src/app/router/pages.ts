interface PagesProps {
  REGISTRATION: string;
  LOGIN: string;
  PRODUCT: string;
  DETAILS: string;
  NOT_FOUND: string;
  CART: string;
  PROFILE: string;
  [key: string]: string;
}

const Pages: PagesProps = {
  REGISTRATION: 'registration',
  LOGIN: 'login',
  PRODUCT: 'product',
  DETAILS: 'details',
  NOT_FOUND: 'not-found',
  PROFILE: 'profile',
  LOGOUT: 'logout',
  CART: 'cart',
};

const ID_SELECTOR = '{id}';

export { Pages, ID_SELECTOR };
