import Layout from '../../layout/layout';
import Router from '../../router/router';

const TEXT = 'ABOUT US';

export default class AboutUs extends Layout {
  router: Router;

  constructor(router: Router) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['about-us'],
    };
    super(params);

    this.router = router;

    this.configureView();
  }

  configureView() {
    this.viewElementCreator.setTextContent(TEXT);
  }
}
