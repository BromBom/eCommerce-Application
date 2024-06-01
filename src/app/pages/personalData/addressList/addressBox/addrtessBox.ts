import { Address } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../../components/simpleComponent';

export default class AddressBox {
  element: HTMLDivElement;

  stringAddress: string;

  linkEdit: SimpleComponent<HTMLSpanElement>;

  setBillingButton: SimpleComponent<HTMLDivElement>;

  setShippingButton: SimpleComponent<HTMLDivElement>;

  constructor(public address: Address) {
    this.stringAddress = `${address.country}, ${address.postalCode}, ${address.city}, ${address.streetName} - ${address.apartment}`;
    this.linkEdit = new SimpleComponent<HTMLSpanElement>('span', ['profile__edit-link'], 'Edit');
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

    addressBox.append(addressContainer, buttonContainer);
    addressContainer.append(this.stringAddress, this.linkEdit.getElement());
    buttonContainer.append(this.setBillingButton.getElement(), this.setShippingButton.getElement());

    return addressBox;
  }

  getElement() {
    return this.element;
  }
}
