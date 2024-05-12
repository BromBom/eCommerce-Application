import BaseComponent from '../../../components/baseComponent';
import RegProfile from './profile/profile';
import RegAddress from './address/address';
import Button from '../../../components/controls/button';

import './form.scss';

export default class RegForm {
  element: HTMLFormElement;

  profile: RegProfile;

  address: RegAddress;

  buttonSubmit: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.profile = new RegProfile();
    this.address = new RegAddress();
    this.buttonSubmit = Button(['registration__btn-submit'], 'Submit');
    this.element = this.init();
  }

  private init() {
    const regForm = document.createElement('form');
    const profile = this.profile.getElement();
    const address = this.address.getElement();
    const buttonSubmit = this.buttonSubmit.getElement();
    buttonSubmit.disabled = true;
    regForm.classList.add('registration__form');
    regForm.append(profile, address, buttonSubmit);

    const arrFormInputElements = [...profile.elements, ...address.elements];
    arrFormInputElements.forEach((input) => {
      input.addEventListener('input', () => {
        buttonSubmit.disabled = arrFormInputElements.some((el) => !(el as HTMLInputElement).checkValidity());
      });
    });

    return regForm;
  }

  getElement() {
    return this.element;
  }
}
