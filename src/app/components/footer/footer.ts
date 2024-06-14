import Layout from '../../layout/layout';
import BaseComponent from '../baseComponent/baseComponent';
import './footer.scss';

export default class Footer extends Layout {
  constructor() {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['footer'],
    };
    super(params);
    this.configureView();
  }

  configureView() {
    const logoParams = {
      tag: 'a' as keyof HTMLElementTagNameMap,
      classNames: ['rs-logo'],
      text: '',
      attributes: {
        target: '_blank',
        href: 'https://rs.school/',
      },
      callback: () => null,
    };
    const logoCreator = new BaseComponent<HTMLElement>(logoParams);

    const logoContainer = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['logo-container'],
      text: '',
      callback: () => null,
    });
    logoContainer.addInnerElement(logoCreator);

    const mainContainer = new BaseComponent<HTMLElement>({
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['footer-container'],
      text: '',
      callback: () => null,
    });

    const copyright = new BaseComponent<HTMLElement>({
      tag: 'p' as keyof HTMLElementTagNameMap,
      classNames: ['copyright'],
      text: `©RSSchool. All rights reserved. ${new Date().getFullYear()}`,
      callback: () => null,
    });

    this.viewElementCreator.addInnerElement(mainContainer);
    mainContainer.addInnerElement(logoContainer);
    mainContainer.addInnerElement(copyright);
  }
}
