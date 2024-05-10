// import Main from './pages/main/main';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Main from './pages/main/main';
import { Pages } from './router/pages';
import Router from './router/router';
import State from './state/state';

// export default class App {
//   root: HTMLDivElement;

//   Main: Main;

//   mainPage: HTMLDivElement;

//   constructor() {
//     this.root = this.init();
//     this.Main = new Main();
//     this.mainPage = this.Main.getElement();
//   }

//   private init() {
//     this.root = document.createElement('div');
//     this.root.classList.add('root');
//     return this.root;
//   }

//   render() {
//     document.body.append(this.root);
//     this.root.append(this.mainPage);
//   }
// }

export default class App {
  header?: null | Header;
  main: null | Main;
  router: Router;
  constructor() {
    this.header = null;
    this.main = null;

    const state = new State();

    const routes = this.createRoutes(state);
    this.router = new Router(routes);

    this.createView();
  }

  createView() {
    this.header = new Header(this.router);
    this.main = new Main();
    const footer = new Footer();

    document.body.append(this.header.getElement(), this.main.getElement(), footer.getElement());
  }

  /**
   * @param {State} state
   * @return {Array<import('./router/router').Route>}
   */
  createRoutes(state) {
    return [
      {
        path: ``,
        callback: async () => {
          const { default: IndexView } = await import('./pages/registration/registration');
          this.setContent(Pages.INDEX, new IndexView(state));
        },
      },
      {
        path: `${Pages.INDEX}`,
        callback: async () => {
          const { default: IndexView } = await import('./pages/registration/registration');
          this.setContent(Pages.INDEX, new IndexView(state));
        },
      },
      {
        path: `${Pages.PRODUCT}`,
        callback: async () => {
          const { default: ProductView } = await import('./pages/main/main');
          this.setContent(Pages.PRODUCT, new ProductView(this.router));
        },
      },
    ];
  }

  /**
   * @param {string} page
   * @param {import('./view/view').default} view
   */
  setContent(page, view) {
    this.header.setSelectedItem(page);
    this.main.setContent(view);
  }
}
