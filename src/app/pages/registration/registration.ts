import BaseComponent from '../../components/baseComponent';
import RegNavigation from './nav/nav';

export default class Registration {
  element: HTMLDivElement;

  nav: RegNavigation;

  title: BaseComponent<HTMLHeadingElement>;

  form: BaseComponent<HTMLDivElement>;

  constructor() {
    this.nav = new RegNavigation();
    this.title = new BaseComponent<HTMLHeadingElement>('h2', ['regisration__title'], 'Create account');
    this.form = new BaseComponent<HTMLDivElement>('div', ['regisration__window']);
    this.element = this.init();
  }

  private init() {
    const registrationPage = document.createElement('div');
    const nav = this.nav.getElement();
    const title = this.title.getElement();
    const form = this.form.getElement();

    registrationPage.classList.add('regisration__page');
    registrationPage.append(nav, title, form);

    return registrationPage;
  }

  getElement() {
    return this.element;
  }
}
