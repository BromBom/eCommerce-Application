import { Customer } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import RegProfile from '../registration/form/profile/profile';
import Button from '../../components/controls/button';
import AddressBlock from './addressBlock/addressBlock';
import AddressList from './addressList/addressList';
import Modal from '../../components/modal/modal';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../utils/showmessage';
import { getCustomerByID, updateProfile } from '../../../api/customer';

import './personalData.scss';

export default class PersonalData {
  element: HTMLDivElement;

  linkEdit: SimpleComponent<HTMLSpanElement>;

  firstName: SimpleComponent<HTMLSpanElement>;

  lastName: SimpleComponent<HTMLSpanElement>;

  dateOfBirth: SimpleComponent<HTMLSpanElement>;

  email: SimpleComponent<HTMLSpanElement>;

  modalProfileBlock: RegProfile;

  modalButtonSubmit: SimpleComponent<HTMLButtonElement>;

  constructor(
    public customer: Customer,
    public modal: Modal
  ) {
    this.linkEdit = new SimpleComponent<HTMLSpanElement>('span', ['profile__edit-link'], 'Edit');
    this.firstName = new SimpleComponent<HTMLSpanElement>('span', ['profile__personalData'], `${customer.firstName}`);
    this.lastName = new SimpleComponent<HTMLSpanElement>('span', ['profile__personalData'], `${customer.lastName}`);
    this.dateOfBirth = new SimpleComponent<HTMLSpanElement>(
      'span',
      ['profile__personalData'],
      `${customer.dateOfBirth}`
    );
    this.email = new SimpleComponent<HTMLSpanElement>('span', ['profile__personalData'], `${customer.email}`);
    this.modalProfileBlock = new RegProfile();
    this.modalButtonSubmit = Button(['registration__btn-submit'], 'Submit');
    this.element = this.init();
  }

  private init() {
    const personalData = document.createElement('div');
    personalData.classList.add('profile__root');
    const profileBox = document.createElement('div');
    profileBox.classList.add('profile__profileBox');
    const addressesBox = document.createElement('div');
    addressesBox.classList.add('profile__addressesBox');

    const titlePersonalData = new SimpleComponent<HTMLHeadingElement>(
      'h2',
      ['profile__title-root'],
      'Personal Data'
    ).getElement();
    const titleProfile = new SimpleComponent<HTMLHeadingElement>('h3', ['profile__title'], 'Profile').getElement();
    const titleAddresses = new SimpleComponent<HTMLHeadingElement>('h3', ['profile__title'], 'Addresses').getElement();

    const profilList = new SimpleComponent<HTMLUListElement>('ul', ['profile__list']).getElement();

    const titleBox = new SimpleComponent<HTMLLIElement>('li', ['profile__item']).getElement();
    const firstName = new SimpleComponent<HTMLLIElement>('li', ['profile__item']).getElement();
    const lastName = new SimpleComponent<HTMLLIElement>('li', ['profile__item']).getElement();
    const dateOfBirth = new SimpleComponent<HTMLLIElement>('li', ['profile__item']).getElement();
    const email = new SimpleComponent<HTMLLIElement>('li', ['profile__item']).getElement();

    const labelFirstName = new SimpleComponent<HTMLSpanElement>(
      'span',
      ['profile__label'],
      'first name: '
    ).getElement();
    const labelLastName = new SimpleComponent<HTMLSpanElement>('span', ['profile__label'], 'last name: ').getElement();
    const labelBirth = new SimpleComponent<HTMLSpanElement>('span', ['profile__label'], 'birth: ').getElement();
    const labelEmail = new SimpleComponent<HTMLSpanElement>('span', ['profile__label'], 'email: ').getElement();

    titleBox.append(titleProfile, this.linkEdit.getElement());
    firstName.append(labelFirstName, this.firstName.getElement());
    lastName.append(labelLastName, this.lastName.getElement());
    dateOfBirth.append(labelBirth, this.dateOfBirth.getElement());
    email.append(labelEmail, this.email.getElement());

    profilList.append(titleBox, firstName, lastName, dateOfBirth, email);
    personalData.append(titlePersonalData, profileBox, addressesBox);
    profileBox.append(profilList);

    const customer = JSON.parse(localStorage.getItem('newCustomer')!) as Customer;
    const addressBillingID = customer.defaultBillingAddressId;
    const addressShippingID = customer.defaultShippingAddressId;
    const addressBilling = customer.addresses.find((address) => address.id === addressBillingID)!;
    let addressShipping = addressBilling;
    if (customer.addresses.length > 1) {
      addressShipping = customer.addresses.find((address) => address.id === addressShippingID)!;
    }
    const billingBlock = new AddressBlock('Billing Address', addressBilling!);
    const shippingBlock = new AddressBlock('Shipping Address', addressShipping);
    shippingBlock.getElement().classList.add('shipping');

    const addressList = new AddressList(customer.addresses, this.modal, billingBlock, shippingBlock).getElement();

    addressesBox.append(billingBlock.getElement(), shippingBlock.getElement(), titleAddresses, addressList);
    this.creatModalFormChangeProfile();

    return personalData;
  }

  creatModalFormChangeProfile() {
    const modalForm = document.createElement('form');
    modalForm.classList.add('address__modal-form');
    this.modalProfileBlock.legend.getElement().textContent = 'Change profile';
    this.modalProfileBlock.inputName.getElement().value = this.customer.firstName!;
    this.modalProfileBlock.inputLastName.getElement().value = this.customer.lastName!;
    this.modalProfileBlock.inputEmail.getElement().value = this.customer.email!;
    this.modalProfileBlock.inputDate.getElement().value = this.customer.dateOfBirth!;
    this.modalProfileBlock.massageErrorPassword.getElement().remove();
    this.modalProfileBlock.inputPassword.getElement().parentElement!.remove();

    const buttonSubmit = this.modalButtonSubmit.getElement();
    modalForm.append(this.modalProfileBlock.getElement(), buttonSubmit);

    const modal = this.modal.getHtmlElement();
    const modalContainer = modal.firstChild!.firstChild as HTMLElement;

    this.linkEdit.addListener('click', () => {
      modalContainer.append(modalForm);
      Modal.openModal(modal);
    });

    const checkButtonSubmit = (arrayInputs: Element[]) => {
      buttonSubmit.disabled = arrayInputs.some((el) => !(el as HTMLInputElement).checkValidity());
    };

    const arrModalProfileBlockInputElements = [...this.modalProfileBlock.getElement().elements];
    arrModalProfileBlockInputElements.forEach((input) => {
      input.addEventListener('input', () => checkButtonSubmit(arrModalProfileBlockInputElements));
    });

    modalForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const firstName = this.modalProfileBlock.inputName.getElement().value;
      const lastName = this.modalProfileBlock.inputLastName.getElement().value;
      const email = this.modalProfileBlock.inputEmail.getElement().value;
      const dateOfBirth = this.modalProfileBlock.inputDate.getElement().value;

      try {
        showLoading();
        const customer = await getCustomerByID(this.customer.id);
        const customerWithChangeProfile = await updateProfile(
          customer.id,
          customer.version,
          firstName,
          lastName,
          email,
          dateOfBirth
        );

        const customerID = customerWithChangeProfile.body.id;
        const newCustomer = await getCustomerByID(customerID);
        localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
        localStorage.setItem('userID', JSON.stringify(newCustomer));
        this.customer = newCustomer;

        this.firstName.getElement().textContent = firstName;
        this.lastName.getElement().textContent = lastName;
        this.dateOfBirth.getElement().textContent = dateOfBirth;
        this.email.getElement().textContent = email;

        Modal.closeModal(modal);
        hideLoading();
        handleSucsess('The profile change was successful!');
      } catch (error) {
        console.error(`Failed to change address: ${error}`);
        handleError(new Error('Failed to change profile'), `Failed to change profile! ${error}`);
      }
    });
  }

  getElement() {
    return this.element;
  }
}
