import { Address } from '@commercetools/platform-sdk';
import Modal from '../../../components/modal/modal';
import SimpleComponent from '../../../components/simpleComponent';
import AddressBox from './addressBox/addrtessBox';

import './addressList.scss';

export default class AddressList {
  element: HTMLDivElement;

  constructor(
    public addresses: Address[],
    public modal: Modal
  ) {
    this.element = this.init();
  }

  private init() {
    const addressList = document.createElement('div');
    addressList.classList.add('address__list');

    const addressContainer = document.createElement('div');
    addressContainer.classList.add('address__container');

    const addButton = new SimpleComponent<HTMLDivElement>(
      'div',
      ['address__add-button'],
      '+Add new address'
    ).getElement();
    addressList.append(addressContainer, addButton);

    this.addresses.forEach((address) => {
      const addressBox = new AddressBox(address, this.modal).getElement();
      addressContainer.append(addressBox);
    });

    return addressList;
  }

  getElement() {
    return this.element;
  }
}
