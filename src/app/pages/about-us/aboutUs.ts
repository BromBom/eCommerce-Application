import BaseComponent from '../../components/baseComponent/baseComponent';
import Layout from '../../layout/layout';
import Router from '../../router/router';
import './aboutUs.scss';

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
    const logoParams = {
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['rs-logo'],
      text: '',
      callback: () => null,
    };
    const logoCreator = new BaseComponent<HTMLElement>(logoParams);
    logoCreator.getElement()?.addEventListener('click', () => {
      window.location.href = 'https://rs.school/';
    });

    const logoContainer = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['logo-container'],
      text: '',
      callback: () => null,
    });
    logoContainer.addInnerElement(logoCreator);

    const mainContainer = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['main-container'],
      text: '',
      callback: () => null,
    });

    this.viewElementCreator.addInnerElement(logoContainer);

    this.viewElementCreator.addInnerElement(mainContainer);
  }
}
