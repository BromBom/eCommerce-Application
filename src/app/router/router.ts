import HashRouterHandler from './handler/hash/hash-router-handler';
import HistoryRouterHandler from './handler/history-router-handler';
import { Pages, ID_SELECTOR } from './pages';

export interface RouterParams {
  path: string;
  callback: () => void;
}
export default class Router {
  routes: RouterParams[];
  handler: HistoryRouterHandler | HashRouterHandler;
  constructor(routes: RouterParams[]) {
    this.routes = routes;

    this.handler = new HistoryRouterHandler(this.urlChangedHandler.bind(this));

    document.addEventListener('DOMContentLoaded', () => {
      this.handler.navigate(null);
    });
  }

  setHashHandler() {
    this.handler.disable();
    this.handler = new HashRouterHandler(this.urlChangedHandler.bind(this));
  }

  /**
   * @param {string} url
   */
  navigate(url) {
    this.handler.navigate(url);
  }

  /**
   * @param {import('./handler/history-router-handler.js').RequestParams} requestParams
   */
  urlChangedHandler(requestParams) {
    const pathForFind = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/${ID_SELECTOR}`;
    const route = this.routes.find((item) => item.path === pathForFind);

    if (!route) {
      this.redirectToNotFoundPage();
      return;
    }

    route.callback(requestParams.resource);
  }

  redirectToNotFoundPage() {
    const notFoundPage = this.routes.find((item) => item.path === Pages.NOT_FOUND);
    if (notFoundPage) {
      this.navigate(notFoundPage.path);
    }
  }
}
