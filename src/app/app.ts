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
    this.header = new Header(this.router, this.state);
    this.main = new Main();
    const footer = new Footer();

    document.body.append(this.header.getHtmlElement(), this.main.getHtmlElement(), footer.getHtmlElement());
  }

  createRoutes(state: State): RouterParams[] {
    console.log(state);
    return [
      {
        path: '',
        callback: async () => {
          const { default: Products } = await import('./pages/main/products/products');
          this.setContent(Pages.Product, new Products());
        },
      },
      {
        path: `${Pages.PRODUCT}`,
        callback: async () => {
          const { default: Products } = await import('./pages/main/products/products');
          this.setContent(Pages.Product, new Products());
        },
      },
      {
        path: `${Pages.LOGIN}`,
        callback: async () => {
          this.setContent(Pages.LOGIN, new LoginPageLayout());
        },
      },
      {
        path: `${Pages.REGISTRATION}`,
        callback: async () => {
          this.header!.setSelectedItem(Pages.REGISTRATION);
          const mainContainer = this.main!.getHtmlElement();
          const registrationPage = new Registration(this.router, this.state).getElement();
          mainContainer.innerHTML = '';
          mainContainer.append(registrationPage);
          mainContainer.append(registrationPage);
        },
      },
      {
        path: `${Pages.NOT_FOUND}`,
        callback: async () => {
          this.setContent(Pages.NOT_FOUND, new NotFound());
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
