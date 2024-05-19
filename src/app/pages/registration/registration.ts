import SimpleComponent from '../../components/simpleComponent';
import RegForm from './form/form';

import './registration.scss';

export default class Registration {
  element: HTMLDivElement;

  title: SimpleComponent<HTMLHeadingElement>;

  form: RegForm;

  constructor() {
    this.title = new SimpleComponent<HTMLHeadingElement>('h2', ['registration__title'], 'Create account');
    this.form = new RegForm();
    this.element = this.init();
  }

  private init() {
    const registrationPage = document.createElement('div');
    const title = this.title.getElement();
    const form = this.form.getElement();

    registrationPage.classList.add('registration__page');
    registrationPage.append(title, form);

    return registrationPage;
  }

  getElement() {
    return this.element;
  }
}
