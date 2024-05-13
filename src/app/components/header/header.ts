/* eslint-disable @typescript-eslint/no-explicit-any */
import './header.scss';
import BaseComponent from '../baseComponent/baseComponent';
import LinkView from '../controls/link/link';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import Layout from '../../layout/layout';

const NamePages = {
  // INDEX: 'Товары',
  LOGIN: 'Авторизация',
  REGISTRATION: 'Регистрация',
  // PRODUCT: 'Товары',
};

export interface Page {
  name: string;
  callback: (() => void) | null;
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
    const logoParams = {
      tag: 'img' as keyof HTMLElementTagNameMap,
      classNames: ['logo'],
      text: '',
      callback: () => {
        router.navigate(Pages.INDEX);
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

    // создаем объект навигаци
    const creatorNav = new BaseComponent(navParams);
    this.viewElementCreator.addInnerElement(creatorNav);

    Object.keys(NamePages).forEach((key: any) => {
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

  clearSelectedItems() {
    this.headerLinkElements.forEach((linkElement: LinkView) => {
      linkElement.setNotSelectedStatus();
    });
  }
}
