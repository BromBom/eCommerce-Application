import { Customer } from '@commercetools/platform-sdk';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Layout from './layout/layout';
import Main from './pages/main/main';
import NotFound from './pages/not-found/not-found';
import Registration from './pages/registration/registration';
import PersonalData from './pages/personalData/personalData';
import { Pages } from './router/pages';
import Router, { RouterParams } from './router/router';
import State from './state/state';
import LoginPageLayout from './layout/loginLayout';
import { showLoading, hideLoading, handleError } from './utils/showmessage';
import Navbar from './components/navbar/navbar';
import Modal from './components/modal/modal';
import Products from './pages/main/products/products';

export default class App {
  header?: null | Header;

  main: null | Main;

  router: Router;

<<<<<<< HEAD
=======
  navbar: null | Navbar;

  modal: Modal;

>>>>>>> profile-listeners
  state: State;

  products: Products;

  constructor() {
    this.header = null;
    this.main = null;
<<<<<<< HEAD

=======
    this.navbar = null;
    this.modal = new Modal(null);
>>>>>>> profile-listeners
    this.state = new State();
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.products = new Products(this.router);
  }

  createView() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.classList.add('loading-overlay');

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    loadingOverlay.appendChild(spinner);

    const messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';

<<<<<<< HEAD
    this.header = new Header(this.router, this.state);
    this.main = new Main(this.router);
=======
    App.createNavbarContainer();

    this.header = new Header(this.router, this.state, this.products);
    this.main = new Main();
    this.navbar = new Navbar();

>>>>>>> profile-listeners
    const footer = new Footer();

    document.body.append(
      this.header.getHtmlElement(),
      this.main.getHtmlElement(),
      footer.getHtmlElement(),
      this.modal.getHtmlElement(),
      loadingOverlay,
      messageContainer
    );

    Main.addFilterEventListeners();
  }

  createRoutes(): RouterParams[] {
    return [
      {
        path: '',
        callback: async () => {
          showLoading();
          try {
<<<<<<< HEAD
            const { default: Products } = await import('./pages/main/products/products');
            const navbar = new Navbar(this.router);
            const productsPage = new Products(this.router);
            this.setContent(Pages.PRODUCT, productsPage, navbar);
=======
            this.setContent(Pages.Product, this.products);
>>>>>>> profile-listeners
          } catch (error) {
            if (error instanceof Error) {
              handleError(error, 'Failed to load product page.');
            }
          } finally {
            hideLoading();
          }
        },
      },
      {
        path: `${Pages.PRODUCT}`,
        callback: async () => {
          showLoading();
          try {
<<<<<<< HEAD
            const { default: Products } = await import('./pages/main/products/products');
            const navbar = new Navbar(this.router);
            const productsPage = new Products(this.router);
            this.setContent(Pages.PRODUCT, productsPage, navbar);
=======
            const productsPage = this.products;
            this.setContent(Pages.PRODUCT, productsPage);
>>>>>>> profile-listeners
          } catch (error) {
            if (error instanceof Error) {
              handleError(error, 'Failed to load products page.');
            }
          } finally {
            hideLoading();
          }
        },
      },
      {
        path: `${Pages.DETAILS}`,
        callback: async () => {
          showLoading();
          try {
            const { default: ProductDetail } = await import('./pages/main/products/productDetail/productDetail');
            const mainContainer = this.main!.getHtmlElement();
            const cardID = localStorage.getItem('cardId');
            if (!cardID) {
              throw new Error('No card ID found in localStorage');
            }
<<<<<<< HEAD
            const productDetailPage = new ProductDetail(cardID);
            await productDetailPage.init();
=======
            const productDetailPage = new ProductDetail(cardID, this.modal);
            await productDetailPage.init(); // Ensure init completes
>>>>>>> profile-listeners
            mainContainer.innerHTML = '';
            mainContainer.append(productDetailPage.getElement()!);
          } catch (error) {
            if (error instanceof Error) {
              handleError(error, 'Failed to load product detail page.');
            }
          } finally {
            hideLoading();
          }
        },
      },
      {
        path: `${Pages.LOGIN}`,
        callback: async () => {
          showLoading();
          try {
            const loginLayout = new LoginPageLayout(this.header!, this.state, this.router);
            this.setContent(Pages.LOGIN, loginLayout);
          } catch (error) {
            if (error instanceof Error) {
              handleError(error, 'Failed to load login page.');
            }
          } finally {
            hideLoading();
          }
        },
      },
      {
        path: `${Pages.REGISTRATION}`,
        callback: async () => {
          showLoading();
          try {
            this.header!.setSelectedItem(Pages.REGISTRATION);
            const mainContainer = this.main!.getHtmlElement();
            const registrationPage = new Registration(this.router, this.state).getElement();
            mainContainer.innerHTML = '';
            mainContainer.append(registrationPage);
          } catch (error) {
            if (error instanceof Error) {
              handleError(error, 'Failed to load registration page.');
            }
          } finally {
            hideLoading();
          }
        },
      },
      {
        path: `${Pages.PROFILE}`,
        callback: async () => {
          showLoading();
          try {
            const customer = JSON.parse(localStorage.getItem('newCustomer')!) as Customer;
            const mainContainer = this.main!.getHtmlElement();
            const personalData = new PersonalData(customer, this.modal).element;
            mainContainer.innerHTML = '';
            mainContainer.append(personalData);
          } catch (error) {
            if (error instanceof Error) {
              console.log(error);
              handleError(error, 'Page not found.');
            }
          } finally {
            hideLoading();
          }
        },
      },
      {
        path: `${Pages.CART}`,
        callback: async () => {
          showLoading();
          try {
            const { default: CartScreen } = await import('./pages/main/cart/cart');
            this.setContent(Pages.CART, new CartScreen(this.router));
          } catch (error) {
            if (error instanceof Error) {
              handleError(error, 'Failed to load product page.');
            }
          } finally {
            hideLoading();
          }
        },
      },
      {
        path: `${Pages.NOT_FOUND}`,
        callback: async () => {
          showLoading();
          try {
            this.setContent(Pages.NOT_FOUND, new NotFound(this.router));
          } catch (error) {
            if (error instanceof Error) {
              handleError(error, 'Page not found.');
            }
          } finally {
            hideLoading();
          }
        },
      },
    ];
  }

  updateMainContent(categoryId: string) {
    console.log('Updating main content with categoryId:', categoryId);
    this.main?.renderProducts(categoryId);
  }

  setContent(page: string, view: Layout, navbar?: Navbar) {
    console.log('Setting content for page:', page, 'with view:', view);
    const isLoggedIn = this.state.loadState().size > 0;

    this.header?.setSelectedItem(page);
    const mainContainer = this.main!.getHtmlElement();
    mainContainer.innerHTML = '';

    if (navbar) {
      mainContainer.appendChild(navbar.getHtmlElement());
    }

    mainContainer.appendChild(view.getHtmlElement());

    if (isLoggedIn) {
      this.header?.configureView();
    }
  }
}
