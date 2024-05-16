interface PagesProps {
  REGISTRATION: string;
  LOGIN: string;
  PRODUCT: string;
  NOT_FOUND: string;
  [key: string]: string;
}

const Pages: PagesProps = {
  REGISTRATION: 'registration',
  LOGIN: 'login',
  PRODUCT: 'product',
  NOT_FOUND: 'not-found',
};

const ID_SELECTOR = '{id}';

export { Pages, ID_SELECTOR };
