import { CustomerDraft, BaseAddress } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../components/simpleComponent';
import RegProfile from './profile/profile';
import RegAddress from './address/address';
import Button from '../../../components/controls/button';
import './form.scss';
import { Pages } from '../../../router/pages';
import Router from '../../../router/router';
import State from '../../../state/state';
import { createCustomer } from '../../../../api/customer';

export default class RegForm {
  element: HTMLFormElement;

  profile: RegProfile;

  address: RegAddress;

  buttonAddNewAddress: SimpleComponent<HTMLButtonElement>;

  buttonCancelNewAddress: SimpleComponent<HTMLButtonElement>;

  addAddress: RegAddress;

  buttonSubmit: SimpleComponent<HTMLButtonElement>;

  router: Router;

  state: State;

  constructor(router: Router, state: State) {
    this.profile = new RegProfile();
    this.address = new RegAddress();
    this.buttonAddNewAddress = Button(['registration__btn-add'], 'Add Shipping address');
    this.buttonCancelNewAddress = Button(['registration__btn-add'], 'Remove Shipping address');
    this.buttonSubmit = Button(['registration__btn-submit'], 'Submit');
    this.addAddress = new RegAddress();
    this.element = this.init();
    this.router = router;
    this.state = state;
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

    regForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const customerDraft: CustomerDraft = {
        email: this.profile.inputEmail.getElement().value,
        password: this.profile.inputPassword.getElement().value,
        firstName: this.profile.inputName.getElement().value,
        lastName: this.profile.inputLastName.getElement().value,
        dateOfBirth: this.profile.inputDate.getElement().value,
        addresses: [],
        defaultBillingAddress: 0,
        defaultShippingAddress: 0,
      };

      const billingAddress: BaseAddress = {
        streetName: this.address.inputStreet.getElement().value,
        apartment: this.address.inputStreetNumber.getElement().value,
        city: this.address.inputCity.getElement().value,
        postalCode: this.address.inputPostalCode.getElement().value,
        country: this.address.inputCountry.getElement().value,
      };

      const shippingAddress: BaseAddress = {
        streetName: this.address.inputStreet.getElement().value,
        apartment: this.address.inputStreetNumber.getElement().value,
        city: this.address.inputCity.getElement().value,
        postalCode: this.address.inputPostalCode.getElement().value,
        country: this.address.inputCountry.getElement().value,
      };

      if (regForm.elements.length > 14) {
        customerDraft.addresses!.push(billingAddress, shippingAddress);
        createCustomer(customerDraft);
      } else {
        customerDraft.addresses!.push(billingAddress);
        createCustomer(customerDraft);
      }

      this.router.navigate(Pages.PRODUCT);
    });

    return regForm;
  }

  getElement() {
    return this.element;
  }
}
