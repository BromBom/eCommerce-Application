import BaseComponent from '../../components/baseComponent';
import RegNavigation from './nav/navigation';
import RegForm from './form/form';

import './registration.scss';

export default class Registration {
  element: HTMLDivElement;

  nav: RegNavigation;

  title: BaseComponent<HTMLHeadingElement>;

  form: RegForm;

  constructor() {
    this.nav = new RegNavigation();
    this.title = new BaseComponent<HTMLHeadingElement>('h2', ['registration__title'], 'Create account');
    this.form = new RegForm();
    this.element = this.init();
  }

  private init() {
    const registrationPage = document.createElement('div');
    const nav = this.nav.getElement();
    const title = this.title.getElement();
    const form = this.form.getElement();

    registrationPage.classList.add('registration__page');
    registrationPage.append(nav, title, form);

    return registrationPage;
  }

  getElement() {
    return this.element;
  }
}
