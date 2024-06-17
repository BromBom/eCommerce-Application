import BaseComponent from '../../components/baseComponent/baseComponent';
import Layout from '../../layout/layout';
import { Pages } from '../../router/pages';
import Router from '../../router/router';

import './not-found.scss';

const TEXT_NOT_FOUND = '404 | Page is not found';

export default class NotFound extends Layout {
  navElement: BaseComponent<HTMLElement>;

  router: Router;

  constructor(router: Router) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['not-found'],
    };
    super(params);

    this.router = router;
    this.navElement = new BaseComponent<HTMLElement>({
      tag: 'nav' as keyof HTMLElementTagNameMap,
      classNames: ['nav-link'],
      text: 'Return to Main Page',
      callback: () => this.router.navigate(Pages.PRODUCT),
    });

    this.configureView();
  }

  configureView() {
    this.viewElementCreator.setTextContent(TEXT_NOT_FOUND);
    this.viewElementCreator.addInnerElement(this.navElement);
  }
}
