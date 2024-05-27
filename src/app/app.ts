import Footer from './components/footer/footer';
import Header from './components/header/header';
import Layout from './layout/layout';
import Main from './pages/main/main';
import NotFound from './pages/not-found/not-found';
import Registration from './pages/registration/registration';
import { Pages } from './router/pages';
import Router, { RouterParams } from './router/router';
import State from './state/state';
import LoginPageLayout from './layout/loginLayout';
import { showLoading, hideLoading, handleError } from './utils/showmessage';

export default class App {
  header?: null | Header;

  main: null | Main;

  router: Router;

  state: State;

  constructor() {
    this.header = null;

    this.main = null;

    this.state = new State();

    const routes = this.createRoutes(this.state);

    this.router = new Router(routes);
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

    this.header = new Header(this.router, this.state);
    this.main = new Main();
    const footer = new Footer();

    document.body.append(
      this.header.getHtmlElement(),
      this.main.getHtmlElement(),
      footer.getHtmlElement(),
      loadingOverlay,
      messageContainer
    );
  }

  createRoutes(state: State): RouterParams[] {
    console.log(state);
    return [
      {
        path: '',
        callback: async () => {
          showLoading();
          try {
            const { default: Products } = await import('./pages/main/products/products');
            this.setContent(Pages.Product, new Products());
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
            const { default: Products } = await import('./pages/main/products/products');
            this.setContent(Pages.Product, new Products());
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
        path: `${Pages.CART}`,
        callback: async () => {
          showLoading();
          try {
            const { default: Cart } = await import('./pages/main/cart/cart');
            this.setContent(Pages.Cart, new Cart());
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

  setContent(page: string, view: Layout) {
    const isLoggedIn = this.state.loadState().size > 0;

    this.header?.setSelectedItem(page);
    this.main?.setContent(view);

    if (isLoggedIn) {
      this.header?.configureView();
    }
  }
}
