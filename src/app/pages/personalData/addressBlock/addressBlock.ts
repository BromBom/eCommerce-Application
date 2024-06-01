import { Address } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../components/simpleComponent';

import './addressBlock.scss';

export default class AddressBlock {
  element: HTMLDivElement;

  stringAddress: string;

  title: SimpleComponent<HTMLHeadingElement>;

  constructor(titleName: string, address: Address) {
    this.title = new SimpleComponent<HTMLHeadingElement>('h3', ['address__title'], titleName);
    this.stringAddress = `${address.country}, ${address.postalCode}, ${address.city}, ${address.streetName}-${address.apartment}`;
    this.element = this.init();
  }

  private init() {
    const container = document.createElement('div');
    container.classList.add('address__block');
    const addressBox = document.createElement('div');
    addressBox.classList.add('address__box');
    const addressString = document.createElement('span');
    addressString.classList.add('address__string');
    const editButton = document.createElement('div');
    editButton.classList.add('address__edit-button');

    container.append(this.title.getElement(), addressBox);
    addressBox.append(this.stringAddress, editButton);

    return container;
  }

  getElement() {
    return this.element;
  }
}
