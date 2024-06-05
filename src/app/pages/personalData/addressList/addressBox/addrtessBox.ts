import { Address, Customer } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../../components/simpleComponent';
import Modal from '../../../../components/modal/modal';
import RegAddress from '../../../registration/form/address/address';
import Button from '../../../../components/controls/button';
import {
  changeAddress,
  removeAddress,
  getCustomerByID,
  SetDefaultBillingAddress,
  SetDefaultShippingAddress,
} from '../../../../../api/customer';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../../../utils/showmessage';
import AddressBlock from '../../addressBlock/addressBlock';

export default class AddressBox {
  element: HTMLDivElement;

  customer: Customer;

  modalAddressBlock: RegAddress;

  modalButtonSubmit: SimpleComponent<HTMLButtonElement>;

  stringAddress: SimpleComponent<HTMLParagraphElement>;

  linkEdit: SimpleComponent<HTMLSpanElement>;

  linkDelete: SimpleComponent<HTMLSpanElement>;

  setBillingButton: SimpleComponent<HTMLDivElement>;

  setShippingButton: SimpleComponent<HTMLDivElement>;

  constructor(
    public address: Address,
    public modal: Modal,
    public billingBlock: AddressBlock,
    public shippingBlock: AddressBlock
  ) {
    this.customer = JSON.parse(localStorage.getItem('newCustomer')!) as Customer;
    this.modalAddressBlock = new RegAddress();
    this.modalButtonSubmit = Button(['registration__btn-submit'], 'Submit');
    this.stringAddress = new SimpleComponent<HTMLParagraphElement>(
      'p',
      ['profile__address-string'],
      `${address.country}, ${address.postalCode}, ${address.city}, ${address.streetName} - ${address.apartment}`
    );
    this.linkEdit = new SimpleComponent<HTMLSpanElement>('span', ['profile__edit-link'], 'Edit');
    this.linkDelete = new SimpleComponent<HTMLSpanElement>('span', ['profile__delete-link'], 'Delete');
    this.setBillingButton = new SimpleComponent<HTMLDivElement>('div', ['address__setBilling-button'], 'Billing');
    this.setShippingButton = new SimpleComponent<HTMLDivElement>('div', ['address__setShipping-button'], 'Shipping');
    this.element = this.init();
  }

  private init() {
    const addressBox = document.createElement('div');
    addressBox.classList.add('address__box');

    const addressContainer = document.createElement('div');
    addressContainer.classList.add('address__container-addresses');

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('address__container-buttons');

    const linkContainer = document.createElement('div');
    linkContainer.classList.add('address__container-links');
    linkContainer.append(this.linkEdit.getElement(), this.linkDelete.getElement());

    const billingButton = this.setBillingButton.getElement();
    const shippingButton = this.setShippingButton.getElement();

    addressBox.append(addressContainer, buttonContainer);
    addressContainer.append(this.stringAddress.getElement(), linkContainer);
    buttonContainer.append(billingButton, shippingButton);

    this.creatModalFormChangeAddress();

    if (this.address.id === this.customer.defaultBillingAddressId) {
      billingButton.classList.add('clicked');
    }
    if (this.address.id === this.customer.defaultShippingAddressId) {
      shippingButton.classList.add('clicked');
    }

    billingButton.addEventListener('click', async () => {
      const arrBillingButtons = [...Array.from(document.querySelectorAll('.address__setBilling-button'))];
      if (billingButton.classList.contains('clicked')) return;
      arrBillingButtons.forEach((button) => button.classList.remove('clicked'));
      billingButton.classList.add('clicked');
      try {
        showLoading();
        const customer = await getCustomerByID(this.customer.id);

        const newCustomerWithBilling = await SetDefaultBillingAddress(customer.id, customer.version, this.address.id);

        const newCustomer = newCustomerWithBilling.body;
        localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
        localStorage.setItem('userID', JSON.stringify(newCustomer));
        this.customer = newCustomer;

        this.billingBlock.stringAddress.getElement().textContent = this.stringAddress.getElement().textContent;

        hideLoading();
        handleSucsess('Seting Default Billing Address was successful!');
      } catch (error) {
        console.error(`Failed to set Default Billing Address: ${error}`);
        handleError(
          new Error('Failed to set Default Billing Address'),
          `Failed to set Default Billing Address! ${error}`
        );
      }
    });

    shippingButton.addEventListener('click', async () => {
      const arrShippingButtons = [...Array.from(document.querySelectorAll('.address__setShipping-button'))];
      if (shippingButton.classList.contains('clicked')) return;
      arrShippingButtons.forEach((button) => button.classList.remove('clicked'));
      shippingButton.classList.add('clicked');
      try {
        showLoading();
        const customer = await getCustomerByID(this.customer.id);

        const newCustomerWithShipping = await SetDefaultShippingAddress(customer.id, customer.version, this.address.id);

        const newCustomer = newCustomerWithShipping.body;
        localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
        localStorage.setItem('userID', JSON.stringify(newCustomer));
        this.customer = newCustomer;

        this.shippingBlock.stringAddress.getElement().textContent = this.stringAddress.getElement().textContent;

        hideLoading();
        handleSucsess('Seting Default Shipping Address was successful!');
      } catch (error) {
        console.error(`Failed to set Default Shipping Address: ${error}`);
        handleError(
          new Error('Failed to set Default Shipping Address'),
          `Failed to set Default Shipping Address! ${error}`
        );
      }
    });

    this.linkDelete.getElement().addEventListener('click', async () => {
      try {
        showLoading();
        const customer = await getCustomerByID(this.customer.id);
        const customerRemoveAddress = await removeAddress(customer.id, customer.version, this.address.id!);
        const newCustomer = customerRemoveAddress.body;
        localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
        localStorage.setItem('userID', JSON.stringify(newCustomer));
        this.customer = newCustomer;

        this.element.remove();
        if (billingButton.classList.contains('clicked')) {
          this.billingBlock.stringAddress.getElement().textContent = 'none';
        }
        if (shippingButton.classList.contains('clicked')) {
          this.shippingBlock.stringAddress.getElement().textContent = 'none';
        }

        hideLoading();
        handleSucsess('Remove address was successful!');
      } catch (error) {
        console.error(`Failed to delete Address: ${error}`);
        handleError(new Error('Failed to delete Address'), `Failed to delete Address! ${error}`);
      }
    });

    return addressBox;
  }

  creatModalFormChangeAddress() {
    const modalForm = document.createElement('form');
    modalForm.classList.add('address__modal-form');
    this.modalAddressBlock.legend.getElement().textContent = 'Change address';
    this.modalAddressBlock.inputCountry.getElement().value = this.address.country!;
    this.modalAddressBlock.inputPostalCode.getElement().value = this.address.postalCode!;
    this.modalAddressBlock.inputCity.getElement().value = this.address.city!;
    this.modalAddressBlock.inputStreet.getElement().value = this.address.streetName!;
    this.modalAddressBlock.inputStreetNumber.getElement().value = this.address.apartment!;

    const buttonSubmit = this.modalButtonSubmit.getElement();

    modalForm.append(this.modalAddressBlock.getElement(), buttonSubmit);

    const modal = this.modal.getHtmlElement();
    const modalContainer = modal.firstChild!.firstChild as HTMLElement;

    this.linkEdit.addListener('click', () => {
      modalContainer.append(modalForm);
      Modal.openModal(modal);
    });

    const checkButtonSubmit = (arrayInputs: Element[]) => {
      buttonSubmit.disabled = arrayInputs.some((el) => !(el as HTMLInputElement).checkValidity());
    };

    const arrModalAddressBlockInputElements = [...this.modalAddressBlock.getElement().elements];
    arrModalAddressBlockInputElements.forEach((input) => {
      input.addEventListener('input', () => checkButtonSubmit(arrModalAddressBlockInputElements));
    });

    modalForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const addressID = this.address.id!;
      const country = this.modalAddressBlock.inputCountry.getElement().value;
      const postalCode = this.modalAddressBlock.inputPostalCode.getElement().value;
      const city = this.modalAddressBlock.inputCity.getElement().value;
      const streetName = this.modalAddressBlock.inputStreet.getElement().value;
      const apartment = this.modalAddressBlock.inputStreetNumber.getElement().value;

      try {
        showLoading();
        const customer = await getCustomerByID(this.customer.id);
        const customerWithChangeAddress = await changeAddress(
          customer.id,
          customer.version,
          addressID,
          country,
          postalCode,
          city,
          streetName,
          apartment
        );

        const customerID = customerWithChangeAddress.body.id;
        const newCustomer = await getCustomerByID(customerID);
        localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
        localStorage.setItem('userID', JSON.stringify(newCustomer));
        this.customer = newCustomer;

        this.stringAddress.getElement().textContent = `${country}, ${postalCode}, ${city}, ${streetName} - ${apartment}`;
        if (addressID === newCustomer.defaultBillingAddressId) {
          this.billingBlock.stringAddress.getElement().textContent = `${country}, ${postalCode}, ${city}, ${streetName} - ${apartment}`;
        }
        if (addressID === newCustomer.defaultShippingAddressId) {
          this.shippingBlock.stringAddress.getElement().textContent = `${country}, ${postalCode}, ${city}, ${streetName} - ${apartment}`;
        }

        Modal.closeModal(modal);
        hideLoading();
        handleSucsess('The address change was successful!');
      } catch (error) {
        console.error(`Failed to change address: ${error}`);
        handleError(new Error('Failed to change address'), `Failed to change address! ${error}`);
      }
    });
  }

  getElement() {
    return this.element;
  }
}
