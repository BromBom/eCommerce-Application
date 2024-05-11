import BaseComponent from '../baseComponent/baseComponent';
import LinkView from '../controls/link/link';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import Layout from '../../layout/layout';

const NamePages = {
  INDEX: 'Главная',
  PRODUCT: 'Карточки',
};

export interface Page {
  name: string;
  callback: () => void;
}

export default class Header extends Layout {
  headerLinkElements: any;

  constructor(router: Router) {
    const params = {
      tag: 'header' as keyof HTMLElementTagNameMap,
      classNames: ['header'],
    };
    super(params);
    // сохраним линки в Map, чтобы линки знали о состоянии друг друга
    this.headerLinkElements = new Map();
    this.configureView(router);
  }

  configureView(router: Router) {
    const navParams = {
      tag: 'nav' as keyof HTMLElementTagNameMap,
      classNames: ['nav'],
      textContent: '',
      callback: null,
    };

    // создаем объект навигаци
    const creatorNav = new BaseComponent(navParams);
    this.viewElementCreator.addInnerElement(creatorNav);

    Object.keys(NamePages).forEach((key) => {
      const pageParams = {
        name: NamePages[key],
        callback: () => router.navigate(Pages[key]),
      };

      // создаем объект ссылки и добавляем в объект навигаци
      const linkElement = new LinkView(pageParams, this.headerLinkElements);

      creatorNav.addInnerElement(linkElement.getHtmlElement());
      this.headerLinkElements.set(Pages[key].toUpperCase(), linkElement);
    });

    this.viewElementCreator.addInnerElement(creatorNav);
  }

  // метод для выделения активной ссылки
  setSelectedItem(namePage: string) {
    const linkItem = this.headerLinkElements.get(namePage.toUpperCase());
    if (linkItem instanceof LinkView) {
      linkItem.setSelectedStatus();
    }
  }
}
