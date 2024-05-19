import Footer from './components/footer/footer';
import Header from './components/header/header';
import Layout from './layout/layout';
import Main from './pages/main/main';
import NotFound from './pages/not-found/not-found';
import Registration from './pages/registration/registration';
import { Pages } from './router/pages';
import Router, { RouterParams } from './router/router';
import State from './state/state';

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

    this.router.onNavigate((path) => {
      if (path === Pages.PRODUCT) {
        const isLoggedIn = this.checkIfUserIsLoggedIn();

        this.updateHeaderLinksBasedOnLoginStatus(isLoggedIn);
      }
    });
  }

  // function handleLogin() {
  // // Perform login actions...

  // // After successful login, update the header links
  // const header = document.querySelector('.header'); // Adjust selector as needed
  // if (header instanceof Header) {
  //   header.updateLinks(NamePagesAuthUser);
  // }
}

  createView() {
    this.header = new Header(this.router, this.state);
    this.main = new Main();
    const footer = new Footer();
    console.log(this.header, 'header');
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
          this.setContent(Pages.LOGIN, new NotFound());
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
    this.header?.setSelectedItem(page);
    this.main?.setContent(view);
  }
}
