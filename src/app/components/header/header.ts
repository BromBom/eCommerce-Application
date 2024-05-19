import './header.scss';
import BaseComponent from '../baseComponent/baseComponent';
import LinkView from '../controls/link/link';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import Layout from '../../layout/layout';
import State from '../../state/state';

const NamePages: { [key: string]: string } = {
  LOGIN: 'Login',
  REGISTRATION: 'Registration',
};

// const NamePagesAuthUser: { [key: string]: string } = {
//   AUTHENTICATED: 'AUTHENTICATED',
//   LOGOUT: 'Logout',
// };

export interface Page {
  name: string;
  callback: (() => void) | null;
}

export default class Header extends Layout {
  headerLinkElements: Map<string, LinkView>;

  state: State;

  router: Router;

  constructor(router: Router, state: State) {
    const params = {
      tag: 'header' as keyof HTMLElementTagNameMap,
      classNames: ['header'],
    };
    super(params);

    this.router = router;

    this.headerLinkElements = new Map();
    this.state = state;
    this.configureView(router);
  }

  configureView(router: Router, pages?: { [key: string]: string }) {
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

    // const userID = this.state.loadState();

    // const pages = userID.size > 0 ? NamePagesAuthUser : NamePages;

    const currentPages = pages || NamePages;

    Object.keys(currentPages).forEach((key: string) => {
      const pageParams = {
        name: currentPages[key],
        callback: () => router.navigate(Pages[key]),
      };

      const linkElement = new LinkView(pageParams, this.headerLinkElements);
      creatorNav.addInnerElement(linkElement.getHtmlElement());

      this.headerLinkElements.set(Pages[key].toUpperCase(), linkElement);
    });

    this.viewElementCreator.addInnerElement(creatorNav);
  }

  updateLinks(pages: { [key: string]: string }) {
    this.headerLinkElements.clear();

    const navParams = {
      tag: 'nav' as keyof HTMLElementTagNameMap,
      classNames: ['nav'],
      text: '',
      callback: () => null,
    };

    const creatorNav = new BaseComponent(navParams);
    this.viewElementCreator.addInnerElement(creatorNav);

    Object.keys(pages).forEach((key) => {
      const pageParams = {
        name: pages[key],
        callback: () => this.router.navigate(Pages[key]),
      };

      const linkElement = new LinkView(pageParams, this.headerLinkElements);
      creatorNav.addInnerElement(linkElement.getHtmlElement());

      this.headerLinkElements.set(Pages[key].toUpperCase(), linkElement);
    });

    this.renderNavigationBar(pages);
  }

  renderNavigationBar(pages: { [key: string]: string }) {
    this.viewElementCreator.removeElement();

    this.updateLinks(pages);
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
