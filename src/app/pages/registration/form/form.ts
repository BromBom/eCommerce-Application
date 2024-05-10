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
    this.buttonSubmit = Button(['registration__btn-submit'], 'Submit');
    this.profile = new RegProfile();
    this.address = new RegAddress();
    this.element = this.init();
  }

  private init() {
    const regForm = document.createElement('form');
    const buttonSubmit = this.buttonSubmit.getElement();
    const profile = this.profile.getElement();
    const address = this.address.getElement();
    regForm.classList.add('registration__form');
    regForm.append(profile, address, buttonSubmit);

    return regForm;
  }

  getElement() {
    return this.element;
  }
}
