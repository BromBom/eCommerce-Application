import { Address, Customer } from '@commercetools/platform-sdk';
import Modal from '../../../components/modal/modal';
import SimpleComponent from '../../../components/simpleComponent';
import AddressBox from './addressBox/addrtessBox';
import AddressBlock from '../addressBlock/addressBlock';
import RegAddress from '../../registration/form/address/address';
import Button from '../../../components/controls/button';
import { addAddress, getCustomerByID } from '../../../../api/customer';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../../utils/showmessage';

import './addressList.scss';

export default class AddressList {
  element: HTMLDivElement;

  customer: Customer;

  addressContainer: HTMLDivElement;

  addButton: SimpleComponent<HTMLDivElement>;

  modalAddressBlock: RegAddress;

  modalButtonSubmit: SimpleComponent<HTMLButtonElement>;

  constructor(
    public addresses: Address[],
    public modal: Modal,
    public billingBlock: AddressBlock,
    public shippingBlock: AddressBlock
  ) {
    this.addressContainer = document.createElement('div');
    this.addButton = new SimpleComponent<HTMLDivElement>('div', ['address__add-button'], '+Add new address');
    this.modalAddressBlock = new RegAddress();
    this.modalButtonSubmit = Button(['registration__btn-submit'], 'Submit');
    this.customer = JSON.parse(localStorage.getItem('newCustomer')!) as Customer;
    this.element = this.init();
  }

  private init() {
    const addressList = document.createElement('div');
    addressList.classList.add('address__list');

    this.addressContainer.classList.add('address__container');

    const addButton = this.addButton.getElement();
    addressList.append(this.addressContainer, addButton);

    this.addresses.forEach((address) => {
      const addressBox = new AddressBox(address, this.modal, this.billingBlock, this.shippingBlock).getElement();
      this.addressContainer.append(addressBox);
    });

    this.creatModalFormAddNewAddress();

    return addressList;
  }

  creatModalFormAddNewAddress() {
    const modalForm = document.createElement('form');
    modalForm.classList.add('address__modal-form');
    this.modalAddressBlock.legend.getElement().textContent = 'Add new address';
    const buttonSubmit = this.modalButtonSubmit.getElement();
    buttonSubmit.disabled = true;
    modalForm.append(this.modalAddressBlock.getElement(), buttonSubmit);

    const modal = this.modal.getHtmlElement();
    const modalContainer = modal.firstChild!.firstChild as HTMLElement;

    this.addButton.addListener('click', () => {
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

      const country = this.modalAddressBlock.inputCountry.getElement().value;
      const postalCode = this.modalAddressBlock.inputPostalCode.getElement().value;
      const city = this.modalAddressBlock.inputCity.getElement().value;
      const streetName = this.modalAddressBlock.inputStreet.getElement().value;
      const apartment = this.modalAddressBlock.inputStreetNumber.getElement().value;

      try {
        showLoading();
        const customer = await getCustomerByID(this.customer.id);
        const customerWithAddNewAddress = await addAddress(
          customer.id,
          customer.version,
          country,
          postalCode,
          city,
          streetName,
          apartment
        );

        const customerID = customerWithAddNewAddress.body.id;
        const newAddress = customerWithAddNewAddress.body.addresses.at(-1)!;
        const newCustomer = await getCustomerByID(customerID);
        localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
        localStorage.setItem('userID', JSON.stringify(newCustomer));
        this.customer = newCustomer;

        const addressBox = new AddressBox(newAddress, this.modal, this.billingBlock, this.shippingBlock).getElement();
        this.addressContainer.append(addressBox);

        Modal.closeModal(modal);
        hideLoading();
        handleSucsess('The address add was successful!');
      } catch (error) {
        console.log(`Failed to add address: ${error}`);
        handleError(new Error('Failed to add address'), `Failed to add address! ${error}`);
      }
    });
  }

  getElement() {
    return this.element;
  }
}
