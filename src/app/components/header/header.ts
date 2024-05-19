import './header.scss';
import BaseComponent from '../baseComponent/baseComponent';
import LinkView from '../controls/link/link';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import Layout from '../../layout/layout';

const NamePages: { [key: string]: string } = {
  LOGIN: 'Авторизация',
  REGISTRATION: 'Регистрация',
};

export interface Page {
  name: string;
  callback: (() => void) | null;
}

export default class Header extends Layout {
  headerLinkElements: Map<string, LinkView>;

  constructor(router: Router) {
    const params = {
      tag: 'header' as keyof HTMLElementTagNameMap,
      classNames: ['header'],
    };
    super(params);

    this.headerLinkElements = new Map();
    this.configureView(router);
  }

  configureView(router: Router) {
    const logoParams = {
      tag: 'img' as keyof HTMLElementTagNameMap,
      classNames: ['logo'],
      text: '',
      callback: () => {
        router.navigate(Pages.PRODUCT);
        this.clearSelectedItems();
      },
    };

    const logoCreator = new BaseComponent(logoParams);
    this.viewElementCreator.addInnerElement(logoCreator);

    const navParams = {
      tag: 'nav' as keyof HTMLElementTagNameMap,
      classNames: ['nav'],
      text: '',
      callback: () => null,
    };

    const creatorNav = new BaseComponent(navParams);
    this.viewElementCreator.addInnerElement(creatorNav);

    Object.keys(NamePages).forEach((key: string) => {
      const pageParams = {
        name: NamePages[key],
        callback: () => router.navigate(Pages[key]),
      };

      const linkElement = new LinkView(pageParams, this.headerLinkElements);
      creatorNav.addInnerElement(linkElement.getHtmlElement());

      this.headerLinkElements.set(Pages[key].toUpperCase(), linkElement);
    });

    this.viewElementCreator.addInnerElement(creatorNav);
  }

  setSelectedItem(namePage: string) {
    if (namePage) {
      const linkItem = this.headerLinkElements.get(namePage.toUpperCase());
      if (linkItem instanceof LinkView) {
        linkItem.setSelectedStatus();
      }
    }
  }

  clearSelectedItems() {
    this.headerLinkElements.forEach((linkElement: LinkView) => {
      linkElement.setNotSelectedStatus();
    });
  }
}
