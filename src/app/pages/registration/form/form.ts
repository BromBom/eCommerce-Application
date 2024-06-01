import { CustomerDraft, BaseAddress } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../components/simpleComponent';
import RegProfile from './profile/profile';
import RegAddress from './address/address';
import Button from '../../../components/controls/button';
import { Pages } from '../../../router/pages';
import Router from '../../../router/router';
import State from '../../../state/state';
import {
  createCustomer,
  SetDefaultBillingAddress,
  SetDefaultShippingAddress,
  getCustomerByID,
} from '../../../../api/customer';

import { handleError, showLoading, hideLoading } from '../../../utils/showmessage';

import './form.scss';

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

    regForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      let customerID: string = '';

      const customerDraft: CustomerDraft = {
        email: this.profile.inputEmail.getElement().value,
        password: this.profile.inputPassword.getElement().value,
        firstName: this.profile.inputName.getElement().value,
        lastName: this.profile.inputLastName.getElement().value,
        dateOfBirth: this.profile.inputDate.getElement().value,
        addresses: [],
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

      try {
        showLoading();
        if (regForm.elements.length > 14) {
          customerDraft.addresses!.push(billingAddress, shippingAddress);
          const newCustomer = await createCustomer(customerDraft);
          const newCustomerWithBilling = await SetDefaultBillingAddress(
            newCustomer.id,
            newCustomer.version,
            newCustomer.addresses[0].id
          );
          await SetDefaultShippingAddress(
            newCustomer.id,
            newCustomerWithBilling.body.version,
            newCustomer.addresses[1].id
          );
          customerID = newCustomer.id;
        } else {
          customerDraft.addresses!.push(billingAddress);
          const newCustomer = await createCustomer(customerDraft);
          const newCustomerWithBilling = await SetDefaultBillingAddress(newCustomer.id, newCustomer.version, newCustomer.addresses[0].id);
          await SetDefaultShippingAddress(
            newCustomer.id,
            newCustomerWithBilling.body.version,
            newCustomer.addresses[0].id
          );
          customerID = newCustomer.id;
        }

        const newCustomer = await getCustomerByID(customerID);
        localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
        localStorage.setItem('userID', JSON.stringify(newCustomer));

        this.router.navigate(Pages.PRODUCT);
        hideLoading();
      } catch (error) {
        console.error(`Failed to create customer: ${error}`);
        handleError(new Error('Failed to create customer'), `Failed to create customer! ${error}`);
      }
    });

    return regForm;
  }

  getElement() {
    return this.element;
  }
}
