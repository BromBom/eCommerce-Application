import './header.scss';
import BaseComponent from '../baseComponent/baseComponent';
import LinkView from '../controls/link/link';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import Layout from '../../layout/layout';
import State, { KEY_USER_ID } from '../../state/state';

const NamePages: { [key: string]: string } = {
  LOGIN: 'Login',
  REGISTRATION: 'Registration',
};

export const NamePagesAuthUser: { [key: string]: string } = {
  PROFILE: 'Profile',
  LOGOUT: 'Logout',
};

export interface Page {
  name: string;
  callback: (() => void) | null;
}

// export default class Header extends Layout {
//   headerLinkElements: Map<string, LinkView>;

//   state: State;

//   router: Router;

//   constructor(router: Router, state: State) {
//     const params = {
//       tag: 'header' as keyof HTMLElementTagNameMap,
//       classNames: ['header'],
//     };
//     super(params);

//     this.router = router;

//     this.headerLinkElements = new Map();
//     this.state = state;
//     this.configureView(router);

//     this.listenForStorageChanges();
//   }

//   configureView(router: Router) {
//     const logoParams = {
//       tag: 'img' as keyof HTMLElementTagNameMap,
//       classNames: ['logo'],
//       text: '',
//       callback: () => {
//         router.navigate(Pages.PRODUCT);
//         this.clearSelectedItems();
//       },
//     };

//     const logoCreator = new BaseComponent(logoParams);
//     this.viewElementCreator.addInnerElement(logoCreator);

//     const navParams = {
//       tag: 'nav' as keyof HTMLElementTagNameMap,
//       classNames: ['nav'],
//       text: '',
//       callback: () => null,
//     };

//     const creatorNav = new BaseComponent(navParams);
//     this.viewElementCreator.addInnerElement(creatorNav);

//     const user = this.state.loadState();

//     console.log(user.size);

//     const currentPages = user.size > 0 ? NamePagesAuthUser : NamePages;

//     Object.keys(currentPages).forEach((key: string) => {
//       const pageParams = {
//         name: currentPages[key],
//         callback: () => {
//           if (currentPages[key] === 'Logout') {
//             this.state.clearState();

//             this.router.navigate(Pages.LOGIN);
//           } else {
//             this.router.navigate(Pages[key]);
//           }
//         },
//       };

//       const linkElement = new LinkView(pageParams, this.headerLinkElements);
//       creatorNav.addInnerElement(linkElement.getHtmlElement());

//       this.headerLinkElements.set(Pages[key].toUpperCase(), linkElement);
//       console.log(this.headerLinkElements);
//     });

//     this.viewElementCreator.addInnerElement(creatorNav);
//   }

//   handleStorageChange(event: StorageEvent) {
//     console.log(event.key, event.newValue);
//     if (event.key === KEY_USER_ID) {
//       const user = this.state.loadState();
//       const currentPages = user.size > 0 ? NamePagesAuthUser : NamePages;
//       this.updateLinks(currentPages);
//     }
//   }

//   listenForStorageChanges() {
//     window.addEventListener('storage', this.handleStorageChange.bind(this));
//   }

//   componentWillUnmount() {
//     window.removeEventListener('storage', this.handleStorageChange);
//   }

//   updateLinks(pages: { [key: string]: string }) {
//     this.headerLinkElements.clear();

//     const navElement = this.viewElementCreator.getElement();

//     console.log({ navElement });

//     if (navElement !== null) {
//       navElement.innerHTML = '';
//     }

//     Object.keys(pages).forEach((key) => {
//       const pageParams = {
//         name: pages[key],
//         callback: () => {
//           if (pages[key] === 'Logout') {
//             this.state.clearState();
//             this.router.navigate(Pages.LOGIN);
//           } else {
//             this.router.navigate(Pages[key]);
//           }
//         },
//       };

//       const linkElement = new LinkView(pageParams, this.headerLinkElements);

//       if (navElement !== null) {
//         navElement.appendChild(linkElement.getHtmlElement());
//       }

//       this.headerLinkElements.set(Pages[key].toUpperCase(), linkElement);
//     });

//     this.renderNavigationBar(pages);
//   }

//   renderNavigationBar(pages: { [key: string]: string }) {
//     this.viewElementCreator.removeElement();
//     this.updateLinks(pages);
//   }

//   setSelectedItem(namePage: string) {
//     if (namePage) {
//       const linkItem = this.headerLinkElements.get(namePage.toUpperCase());
//       if (linkItem instanceof LinkView) {
//         linkItem.setSelectedStatus();
//       }
//     }
//   }

//   clearSelectedItems() {
//     this.headerLinkElements.forEach((linkElement: LinkView) => {
//       linkElement.setNotSelectedStatus();
//     });
//   }
// }

export default class Header extends Layout {
  headerLinkElements: Map<string, LinkView>;

  state: State;

  router: Router;

  navElement: BaseComponent<HTMLElement>;

  constructor(router: Router, state: State) {
    const params = {
      tag: 'header' as keyof HTMLElementTagNameMap,
      classNames: ['header'],
    };
    super(params);

    this.router = router;
    this.headerLinkElements = new Map();
    this.state = state;

    const logoParams = {
      tag: 'img' as keyof HTMLElementTagNameMap,
      classNames: ['logo'],
      text: '',
      callback: () => {
        router.navigate(Pages.PRODUCT);
        this.clearSelectedItems();
      },
    };

    const logoCreator = new BaseComponent<HTMLElement>(logoParams);
    this.viewElementCreator.addInnerElement(logoCreator);

    const navParams = {
      tag: 'nav' as keyof HTMLElementTagNameMap,
      classNames: ['nav'],
      text: '',
      callback: () => null,
    };
    this.navElement = new BaseComponent<HTMLElement>(navParams);
    this.viewElementCreator.addInnerElement(this.navElement);

    this.configureView();
    this.listenForStorageChanges();
  }

  configureView() {
    this.updateLinksBasedOnState();
  }

  updateLinksBasedOnState() {
    const user = this.state.loadState();
    const currentPages = user.size > 0 ? NamePagesAuthUser : NamePages;
    this.updateLinks(currentPages);
  }

  updateLinks(pages: { [key: string]: string }) {
    const navElement = this.navElement.getElement();
    console.log(navElement, 'current element');
    if (navElement) {
      navElement.innerHTML = '';
      this.headerLinkElements.clear();

      Object.keys(pages).forEach((key) => {
        const pageParams = {
          name: pages[key],
          callback: () => {
            if (pages[key] === 'Logout') {
              this.state.clearState();
              this.router.navigate(Pages.LOGIN);
            } else {
              this.router.navigate(Pages[key]);
            }
          },
        };

        const linkElement = new LinkView(pageParams, this.headerLinkElements);
        this.navElement.addInnerElement(linkElement.getHtmlElement());

        this.headerLinkElements.set(Pages[key].toUpperCase(), linkElement);
      });
    }
  }

  handleStorageChange(event: StorageEvent) {
    if (event.key === KEY_USER_ID) {
      this.updateLinksBasedOnState();
    }
  }

  listenForStorageChanges() {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
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
