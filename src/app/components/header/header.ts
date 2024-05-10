import Main from '../../pages/main/main';
import Registration from '../../pages/registration/registration';
import BaseComponent from '../baseComponent';
import LinkView from '../controls/link/link';

export default class Header {
  headerLinkElements: any[];
  mainPage: Main;
  registrationPage: Registration;
  headerElement: HTMLElement;

  constructor(mainComponent: any) {
    this.configureView(mainComponent);
    this.headerLinkElements = [];
    this.mainPage = new Main();
    this.registrationPage = new Registration();
    this.headerElement = new BaseComponent('header', ['header']).getElement();
  }

  configureView(mainComponent: any) {
    document.body.appendChild(this.headerElement);

    const navElement = new BaseComponent('nav', ['nav']);
    this.headerElement.appendChild(navElement.getElement());

    const pages = this.getPages(mainComponent);

    pages.forEach((page, index) => {
      const linkElement = new BaseComponent('a', ['nav-link'], page.name);
      navElement.getElement().appendChild(linkElement.getElement());

      linkElement.addListener('click', (event) => {
        event.preventDefault();
        page.callback();
        if (index === 0) {
          linkElement.getElement().classList.add('selected');
        }
      });

      this.headerLinkElements.push(linkElement);
    });
  }

  getPages(mainComponent: any) {
    const pages = [
      {
        name: 'Главная',
        callback: () => mainComponent.setContent(this.registrationPage.getElement()),
      },
      {
        name: 'Карточки',
        callback: () => mainComponent.setContent(this.mainPage.getElement()),
      },
    ];

    return pages;
  }

  setSelectedItem(namePage) {
    const linkItem = this.headerLinkElements.get(namePage.toUpperCase());
    if (linkItem instanceof LinkView) {
      linkItem.setSelectedStatus();
    }
  }

  getElement(): HTMLElement {
    return this.headerElement;
  }
}
