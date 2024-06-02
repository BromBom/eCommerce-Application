import { Address, Customer } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../../components/simpleComponent';
import Modal from '../../../../components/modal/modal';
import RegAddress from '../../../registration/form/address/address';
import Button from '../../../../components/controls/button';
// import { changeAddress } from '../../../../../api/customer';
// import { handleError, showLoading, hideLoading } from '../../../../utils/showmessage';

export default class AddressBox {
  element: HTMLDivElement;

  customer: Customer;

  modalAddressBlock: RegAddress;

  modalButtonSubmit: SimpleComponent<HTMLButtonElement>;

  stringAddress: string;

  linkEdit: SimpleComponent<HTMLSpanElement>;

  setBillingButton: SimpleComponent<HTMLDivElement>;

  setShippingButton: SimpleComponent<HTMLDivElement>;

  constructor(
    public address: Address,
    public modal: Modal
  ) {
    this.customer = JSON.parse(localStorage.getItem('newCustomer')!) as Customer;
    this.modalAddressBlock = new RegAddress();
    this.modalButtonSubmit = Button(['registration__btn-submit'], 'Submit');
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

  creatModalFormChangeAddress() {
    const modalForm = document.createElement('form');
    modalForm.classList.add('address__modal-form');
    this.modalAddressBlock.legend.getElement().textContent = 'Change address';
    this.modalAddressBlock.inputCountry.getElement().value = this.address.country!;
    this.modalAddressBlock.inputPostalCode.getElement().value = this.address.postalCode!;
    this.modalAddressBlock.inputCity.getElement().value = this.address.city!;
    this.modalAddressBlock.inputStreet.getElement().value = this.address.streetName!;
    this.modalAddressBlock.inputStreetNumber.getElement().value = this.address.building!;

    const buttonSubmit = this.modalButtonSubmit.getElement();
    buttonSubmit.disabled = true;

    modalForm.append(this.modalAddressBlock.getElement(), buttonSubmit);

    const checkButtonSubmit = (arrayInputs: Element[]) => {
      buttonSubmit.disabled = arrayInputs.some((el) => !(el as HTMLInputElement).checkValidity());
    };

    const arrModalAddressBlockInputElements = [...this.modalAddressBlock.getElement().elements];
    arrModalAddressBlockInputElements.forEach((input) => {
      input.addEventListener('input', () => checkButtonSubmit(arrModalAddressBlockInputElements));
    });

    modalForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      //   try {
      //     showLoading();
      //     changeAddress(
      //       this.customer.id,
      //       this.customer.version,
      //       this.address.id!,
      //       this.address.country,
      //       this.address.postalCode!,
      //       this.address.city!,
      //       this.address.streetName!,
      //       this.address.apartment!,
      //     )

      //     if (regForm.elements.length > 14) {
      //       customerDraft.addresses!.push(billingAddress, shippingAddress);
      //       const newCustomer = await createCustomer(customerDraft);
      //       const newCustomerWithBilling = await SetDefaultBillingAddress(
      //         newCustomer.id,
      //         newCustomer.version,
      //         newCustomer.addresses[0].id
      //       );
      //       await SetDefaultShippingAddress(
      //         newCustomer.id,
      //         newCustomerWithBilling.body.version,
      //         newCustomer.addresses[1].id
      //       );
      //       customerID = newCustomer.id;
      //     } else {
      //       customerDraft.addresses!.push(billingAddress);
      //       const newCustomer = await createCustomer(customerDraft);
      //       const newCustomerWithBilling = await SetDefaultBillingAddress(
      //         newCustomer.id,
      //         newCustomer.version,
      //         newCustomer.addresses[0].id
      //       );
      //       await SetDefaultShippingAddress(
      //         newCustomer.id,
      //         newCustomerWithBilling.body.version,
      //         newCustomer.addresses[0].id
      //       );
      //       customerID = newCustomer.id;
      //     }

      //     const newCustomer = await getCustomerByID(customerID);
      //     localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
      //     localStorage.setItem('userID', JSON.stringify(newCustomer));

      //     this.router.navigate(Pages.PRODUCT);
      //     hideLoading();
      //   } catch (error) {
      //     console.error(`Failed to change address: ${error}`);
      //     handleError(new Error('Failed to change address'), `Failed to change address! ${error}`);
      //   }
    });
  }

  addlisteners() {
    this.linkEdit.addListener('click', () => {
      const modal = this.modal.getHtmlElement();
      const modalContainer = modal.firstChild?.firstChild as HTMLElement;
      const addressForm = this.modalAddressBlock.getElement();
      modalContainer.append(addressForm);
      Modal.openModal(modal);
    });
  }

  getElement() {
    return this.element;
  }
}
