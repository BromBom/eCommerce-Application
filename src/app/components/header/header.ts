import './header.scss';
import BaseComponent from '../baseComponent/baseComponent';
import LinkView from '../controls/link/link';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import Layout from '../../layout/layout';
import State, { KEY_USER_ID } from '../../state/state';
import { searchProduct } from '../../../api/project';
import Products from '../../pages/main/products/products';

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

export default class Header extends Layout {
  headerLinkElements: Map<string, LinkView>;

  state: State;

  router: Router;

  navElement: BaseComponent<HTMLElement>;

  searchInput!: HTMLInputElement;

  searchButton!: HTMLButtonElement;

  additionalButtons: HTMLElement[];

  cartCreator: BaseComponent<HTMLElement>;

  constructor(
    router: Router,
    state: State,
    public products: Products
  ) {
    const params = {
      tag: 'header' as keyof HTMLElementTagNameMap,
      classNames: ['header'],
    };
    super(params);

    this.router = router;
    this.headerLinkElements = new Map();
    this.state = state;
    this.additionalButtons = [];

    const cartParams = {
      tag: 'a' as keyof HTMLElementTagNameMap,
      classNames: ['cart'],
      text: '',
      callback: () => {
        this.router.navigate(Pages.CART);
        this.clearSelectedItems();
      },
    };
    this.cartCreator = new BaseComponent<HTMLElement>(cartParams);

    const topContainer = new BaseComponent<HTMLElement>({
      tag: 'div',
      classNames: ['top-container'],
      callback: () => null,
    });

    const bottomContainer = new BaseComponent<HTMLElement>({
      tag: 'div',
      classNames: ['bottom-container'],
      callback: () => null,
    });

    this.viewElementCreator.addInnerElement(topContainer);
    this.viewElementCreator.addInnerElement(bottomContainer);

    const logoParams = {
      tag: 'div' as keyof HTMLElementTagNameMap,
      classNames: ['logo'],
      text: '',
      callback: () => {
        console.log('Logo clicked');
        this.router.navigate(Pages.PRODUCT);
        this.clearSelectedItems();
      },
    };

    const logoCreator = new BaseComponent<HTMLElement>(logoParams);
    logoCreator.getElement()?.addEventListener('click', () => {
      this.router.navigate(Pages.PRODUCT);
      this.clearSelectedItems();
    });
    topContainer.addInnerElement(logoCreator);

    const navParams = {
      tag: 'nav' as keyof HTMLElementTagNameMap,
      classNames: ['nav'],
      text: '',
      callback: () => null,
    };
    this.navElement = new BaseComponent<HTMLElement>(navParams);
    topContainer.addInnerElement(this.navElement);

    this.createAdditionalButtons(bottomContainer);
    this.createSearchBar(bottomContainer);

    this.configureView();
    this.listenForStorageChanges();
  }

  createSearchBar(container: BaseComponent<HTMLElement>) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search_container';

    this.searchInput = document.createElement('input');
    this.searchInput.className = 'search_input';
    this.searchInput.type = 'text';
    this.searchInput.placeholder = 'Search...';

    this.searchButton = document.createElement('button');
    this.searchButton.className = 'search_button';
    this.searchButton.textContent = 'Search';

    searchContainer.appendChild(this.searchInput);
    searchContainer.appendChild(this.searchButton);

    const containerElement = container.getElement();
    if (containerElement) {
      containerElement.appendChild(searchContainer);

      this.searchButton.addEventListener('click', async () => {
        const query = this.searchInput.value || '';
        console.log('Search button clicked with query:', query);
        try {
          console.log('Starting search...');
          const searchData = await searchProduct(query);
          console.log('Product projection search result:', searchData);

          if (searchData && searchData.results) {
            this.products.updateProducts(searchData.results);
            const mainElement = document.querySelector('.main');
            if (mainElement) {
              mainElement.innerHTML = '';
              mainElement.appendChild(this.products.getHtmlElement());
            } else {
              console.error('Main element not found.');
            }
          } else {
            console.log('No search results found.');
          }
        } catch (error) {
          console.error('ERROR during search:', error);
        }
      });

      console.log('Search bar created with input and button.');
    } else {
      console.error('Container element is null, cannot append search bar.');
    }
  }

  createAdditionalButtons(container: BaseComponent<HTMLElement>) {
    const buttonNames = ['+7 951 999 28 34', 'info@stageboxbrand.ru'];

    buttonNames.forEach((name) => {
      const button = document.createElement('button');
      button.className = 'additional_button';
      button.textContent = name;

      button.addEventListener('click', () => {
        console.log(`${name} clicked`);
      });

      this.additionalButtons.push(button);

      const containerElement = container.getElement();
      if (containerElement) {
        containerElement.appendChild(button);
      } else {
        console.error('Container element is null, cannot append additional buttons.');
      }
    });
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

    if (navElement) {
      navElement.innerHTML = '';
      this.headerLinkElements.clear();
      this.navElement.addInnerElement(this.cartCreator);

      this.cartCreator.getElement()!.addEventListener('click', () => {
        this.router.navigate(Pages.CART);
      });

      Object.keys(pages).forEach((key) => {
        const pageParams = {
          name: pages[key],
          callback: () => {
            if (pages[key] === 'Logout') {
              this.state.clearState();
              this.router.navigate(Pages.LOGIN);
              this.configureView();
            } else {
              this.router.navigate(Pages[key]);
            }
          },
        };

        const linkElement = new LinkView(pageParams, this.headerLinkElements);
        this.navElement.addInnerElement(linkElement.getHtmlElement());
        this.headerLinkElements.set(Pages[key].toUpperCase(), linkElement);
      });
    } else {
      console.error('Navigation element is null, cannot update links.');
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
      } else {
        console.error('Link item is not an instance of LinkView.');
      }
    }
  }

  clearSelectedItems() {
    this.headerLinkElements.forEach((linkElement: LinkView) => {
      linkElement.setNotSelectedStatus();
    });
  }
}
