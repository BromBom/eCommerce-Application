import BaseComponent from '../../../components/baseComponent';
import Button from '../../../components/controls/button';

export default class RegNavigation {
  element: HTMLDivElement;

  buttonShop: BaseComponent<HTMLButtonElement>;

  buttonLogin: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.buttonShop = Button(['registration__btn-shop'], 'Shop');
    this.buttonLogin = Button(['registration__btn-login'], 'Login');
    this.element = this.init();
  }

  private init() {
    const regNavigation = document.createElement('div');
    const buttonShop = this.buttonShop.getElement();
    const buttonLogin = this.buttonLogin.getElement();

    regNavigation.classList.add('registration__nav');
    regNavigation.append(buttonShop, buttonLogin);

    return regNavigation;
  }

  getElement() {
    return this.element;
  }
}
