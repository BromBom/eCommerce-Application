import { Address } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../components/simpleComponent';

import './addressBlock.scss';

export default class AddressBlock {
  element: HTMLDivElement;

  stringAddress: SimpleComponent<HTMLParagraphElement>;

  title: SimpleComponent<HTMLHeadingElement>;

  constructor(
    titleName: string,
    public address: Address | string
  ) {
    this.title = new SimpleComponent<HTMLHeadingElement>('h3', ['address__title'], titleName);
    this.stringAddress = new SimpleComponent<HTMLParagraphElement>('p', ['profile__address-string']);
    this.element = this.init();
  }

  private init() {
    const addressBlock = document.createElement('div');
    addressBlock.classList.add('address__block');

    const addressBox = document.createElement('div');
    addressBox.classList.add('address__block-box');

    const addressString = document.createElement('span');
    addressString.classList.add('address__string');

    const editButton = document.createElement('div');
    editButton.classList.add('address__edit-button');

    addressBlock.append(this.title.getElement(), addressBox);
    addressBox.append(this.stringAddress.getElement(), editButton);

    if (typeof this.address === 'string') {
      this.stringAddress.getElement().textContent = this.address;
    } else {
      this.stringAddress.getElement().textContent = `${this.address.country}, ${this.address.postalCode}, ${this.address.streetName} - ${this.address.apartment}`;
    }

    return addressBlock;
  }

  getElement() {
    return this.element;
  }
}
