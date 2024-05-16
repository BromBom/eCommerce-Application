import HistoryRouterHandler from './handler/history-router-handler';
import { Pages, ID_SELECTOR } from './pages';

interface RequestParams {
  path: string;
  resource: string;
}
export interface RouterParams {
  path: string;
  callback: (resource: RequestParams['resource']) => void;
}

export default class Router {
  routes: RouterParams[];

  handler: HistoryRouterHandler;

  constructor(routes: RouterParams[]) {
    this.routes = routes;

    this.handler = new HistoryRouterHandler(this.urlChangedHandler.bind(this));

    document.addEventListener('DOMContentLoaded', () => {
      this.handler.navigate(null);
    });
  }

  navigate(url: string | PopStateEvent) {
    this.handler.navigate(url);
  }

  urlChangedHandler(requestParams: RequestParams) {
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
