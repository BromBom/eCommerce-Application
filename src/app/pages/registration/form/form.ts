import SimpleComponent from '../../../components/simpleComponent';
import RegProfile from './profile/profile';
import RegAddress from './address/address';
import Button from '../../../components/controls/button';
import creatCustomer from '../../../../api/creatCustomer';

import './form.scss';

export default class RegForm {
  element: HTMLFormElement;

  profile: RegProfile;

  address: RegAddress;

  buttonAddNewAddress: SimpleComponent<HTMLButtonElement>;

  buttonCancelNewAddress: SimpleComponent<HTMLButtonElement>;

  addAddress: RegAddress;

  buttonSubmit: SimpleComponent<HTMLButtonElement>;

  constructor() {
    this.profile = new RegProfile();
    this.address = new RegAddress();
    this.buttonAddNewAddress = Button(['registration__btn-add'], 'Add Shipping address');
    this.buttonCancelNewAddress = Button(['registration__btn-add'], 'Remove Shipping address');
    this.buttonSubmit = Button(['registration__btn-submit'], 'Submit');
    this.addAddress = new RegAddress();
    this.element = this.init();
  }

  private init() {
    const regForm = document.createElement('form');
    const profile = this.profile.getElement();
    const address = this.address.getElement();
    const buttonAddNewAddress = this.buttonAddNewAddress.getElement();
    buttonAddNewAddress.setAttribute('type', 'button');
    const addAddress = this.addAddress.getElement();
    this.addAddress.legend.getElement().textContent = 'Shipping address';
    const buttonCancelNewAddress = this.buttonCancelNewAddress.getElement();
    buttonCancelNewAddress.setAttribute('type', 'button');
    const buttonSubmit = this.buttonSubmit.getElement();
    buttonSubmit.disabled = true;
    regForm.classList.add('registration__form');
    regForm.append(profile, address, buttonAddNewAddress, buttonSubmit);

    const checkButtonSubmit = (arrayInputs: Element[]) => {
      buttonSubmit.disabled = arrayInputs.some((el) => !(el as HTMLInputElement).checkValidity());
    };

    const arrFormInputElements = [...profile.elements, ...address.elements];
    const arrFormInputElementsWithAddAddress = [...arrFormInputElements, ...addAddress.elements];

    arrFormInputElements.forEach((input) => {
      input.addEventListener('input', () => checkButtonSubmit(arrFormInputElements));
    });

    buttonAddNewAddress.addEventListener('click', () => {
      buttonAddNewAddress.replaceWith(buttonCancelNewAddress, addAddress);
      arrFormInputElementsWithAddAddress.forEach((input) => {
        input.addEventListener('input', () => checkButtonSubmit(arrFormInputElementsWithAddAddress));
      });
      checkButtonSubmit(arrFormInputElementsWithAddAddress);
    });

    buttonCancelNewAddress.addEventListener('click', () => {
      arrFormInputElements.forEach((input) => {
        input.addEventListener('input', () => checkButtonSubmit(arrFormInputElements));
      });
      buttonCancelNewAddress.replaceWith(buttonAddNewAddress);
      addAddress.remove();
      checkButtonSubmit(arrFormInputElements);
    });
    /** ************************************************************************************************* */
    regForm.addEventListener('submit', (event) => {
      event.preventDefault();
      creatCustomer(this.profile);
      if (regForm.elements.length > 14) console.log('установить 2 адреса');
      else console.log('установить 1 адреса');
      console.log('авторизироваться');
      console.log('перейти на главную');
    });

    return regForm;
  }

  getElement() {
    return this.element;
  }
}
