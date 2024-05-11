import BaseComponent from '../../../components/baseComponent/baseComponent';

export default class RegNavigation {
  element: HTMLDivElement;

  buttonShop: BaseComponent<HTMLButtonElement>;

  buttonLogin: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.buttonShop = new BaseComponent<HTMLButtonElement>('button', ['regisration__btn-shop'], 'Shop');
    this.buttonLogin = new BaseComponent<HTMLButtonElement>('button', ['regisration__btn-login'], 'Login');
    this.element = this.init();
  }

  private init() {
    const regNavigation = document.createElement('div');
    const buttonShop = this.buttonShop.getElement();
    const buttonLogin = this.buttonLogin.getElement();

    regNavigation.classList.add('regisration__nav');
    regNavigation.append(buttonShop, buttonLogin);

    return regNavigation;
  }

  getElement() {
    return this.element;
  }
}
