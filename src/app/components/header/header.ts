import './header.scss';
import BaseComponent from '../baseComponent/baseComponent';
import LinkView from '../controls/link/link';
import { Pages } from '../../router/pages';
import Router from '../../router/router';
import Layout from '../../layout/layout';
import State, { KEY_USER_ID } from '../../state/state';
import { searchProduct, sortProductClothing, sortProductShoes, sortProductAccessories } from '../../../api/project';
import Products from '../../pages/main/products/products';
import Navbar from '../navbar/navbar';
import Banner from '../banner/mainBanner';
import { showLoading, hideLoading, handleError, handleSucsess } from '../../utils/showmessage';
import { createAnonymousCart } from '../../../api/cart';

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

  additionalButtons: BaseComponent<HTMLElement>[];

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
      },
    };
    const logoCreator = new BaseComponent<HTMLElement>(logoParams);
    logoCreator.getElement()?.addEventListener('click', () => {
      this.router.navigate(Pages.PRODUCT);
    });
    topContainer.addInnerElement(logoCreator);

    const aboutUsParams = {
      tag: 'a' as keyof HTMLElementTagNameMap,
      classNames: ['about-us_link'],
      text: 'About us',
      callback: () => {
        this.router.navigate(Pages.ABOUT_US);
      },
    };
    const aboutUsInstance = new BaseComponent<HTMLElement>(aboutUsParams);
    aboutUsInstance.getElement()?.addEventListener('click', () => {
      this.router.navigate(Pages.ABOUT_US);
    });
    topContainer.addInnerElement(aboutUsInstance);

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

  async createAdditionalButtons(container: BaseComponent<HTMLElement>) {
    const buttonNames: { [key: string]: string } = {
      Clothing: '8da9d730-fdd3-4313-8814-20cd01dc7efd',
      Shoes: '292321b7-b3d4-42d5-b150-b1fecde7d470',
      Accessories: '8cf8b1ac-7dfd-4405-9318-1582a38b6b26',
    };

    const handleClick = async (categoryId: string) => {
      try {
        showLoading();
        let sortResponse;
        switch (categoryId) {
          case '8da9d730-fdd3-4313-8814-20cd01dc7efd':
            sortResponse = await sortProductClothing();
            break;
          case '292321b7-b3d4-42d5-b150-b1fecde7d470':
            sortResponse = await sortProductShoes();
            break;
          case '8cf8b1ac-7dfd-4405-9318-1582a38b6b26':
            sortResponse = await sortProductAccessories();
            break;
          default:
            break;
        }

        console.log(sortResponse);

        if (sortResponse && sortResponse.body.results) {
          this.products.updateProducts(sortResponse.body.results);
          const mainElement = document.querySelector('.main');
          if (mainElement) {
            mainElement.innerHTML = '';
            const navbar = new Navbar(this.router, this.products);
            const banner = new Banner(this.router);
            mainElement.appendChild(banner.getHtmlElement());
            mainElement.appendChild(navbar.getHtmlElement());
            mainElement.appendChild(this.products.getHtmlElement());
          } else {
            console.log('Main element not found.');
          }
        } else {
          console.log('No sort results found.');
        }
      } catch (error) {
        console.log('ERROR during sorting:', error);
        handleError(error as Error, 'Error during sorting');
      } finally {
        hideLoading();
      }
    };

    Object.keys(buttonNames).forEach((name) => {
      const buttonParams = {
        tag: 'button' as keyof HTMLElementTagNameMap,
        classNames: ['additional_button'],
        text: name,
        callback: () => {
          console.log(`${name} clicked`);
          handleClick(buttonNames[name]);
        },
      };

      const button = new BaseComponent<HTMLElement>(buttonParams);
      this.additionalButtons.push(button);
      container.addInnerElement(button);
    });

    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('additional_button')) {
        const buttonName = target.textContent?.trim();
        if (buttonName && buttonNames[buttonName]) {
          handleClick(buttonNames[buttonName]);
        } else {
          console.log('Button name not found or invalid:', buttonName);
        }
      }
    });
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
          showLoading();
          console.log('Starting search...');
          const searchData = await searchProduct(query);
          console.log('Product projection search result:', searchData);

          if (searchData && searchData.results) {
            this.products.updateProducts(searchData.results);
            const mainElement = document.querySelector('.main');
            if (mainElement) {
              mainElement.innerHTML = '';
              const navbar = new Navbar(this.router, this.products);
              const banner = new Banner(this.router);
              mainElement.appendChild(banner.getHtmlElement());
              mainElement.appendChild(navbar.getHtmlElement());
              mainElement.appendChild(this.products.getHtmlElement());
            } else {
              console.log('Main element not found.');
            }
          } else {
            console.log('No search results found.');
          }
        } catch (error) {
          console.log('ERROR during search:', error);
        } finally {
          hideLoading();
        }
      });

      console.log('Search bar created with input and button.');
    } else {
      console.log('Container element is null, cannot append search bar.');
    }
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
          callback: async () => {
            if (pages[key] === 'Logout') {
              this.state.clearState();

              try {
                showLoading();
                const currentBasket = await createAnonymousCart();
                localStorage.setItem('CurrentCartId', currentBasket.id);
                localStorage.setItem('CurrentCart', JSON.stringify(currentBasket));

                const cartIconInHeader = document.getElementsByClassName('cart');
                cartIconInHeader[0].innerHTML = '';

                hideLoading();
                handleSucsess('Creating new cart after logout was successful!!');
              } catch (error) {
                console.log(`Failed to create new cart after logout: ${error}`);
                handleError(
                  new Error('Failed to create new cart after logout'),
                  `Failed to create new cart after logout! ${error}`
                );
              }

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
      console.log('Navigation element is null, cannot update links.');
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
