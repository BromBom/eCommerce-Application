import { Customer } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import Input from '../../components/controls/input';
import creatInputWithLabel from '../../utils/creatInputWithLabel';
import checkInputValue from '../../utils/checkInputValue';
import RegProfile from '../registration/form/profile/profile';
import Button from '../../components/controls/button';
import AddressBlock from './addressBlock/addressBlock';
import AddressList from './addressList/addressList';
import Modal from '../../components/modal/modal';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../utils/showmessage';
import { getCustomerByID, updateProfile, changePassword } from '../../../api/customer';

import './personalData.scss';

export default class PersonalData {
  element: HTMLDivElement;

  linkEdit: SimpleComponent<HTMLSpanElement>;

  firstName: SimpleComponent<HTMLSpanElement>;

  lastName: SimpleComponent<HTMLSpanElement>;

  dateOfBirth: SimpleComponent<HTMLSpanElement>;

  email: SimpleComponent<HTMLSpanElement>;

  password: SimpleComponent<HTMLSpanElement>;

  linkChangePassword: SimpleComponent<HTMLSpanElement>;

  modalProfileBlock: RegProfile;

  modalButtonSubmitPassword: SimpleComponent<HTMLButtonElement>;

  modalButtonSubmitProfile: SimpleComponent<HTMLButtonElement>;

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
    this.password = new SimpleComponent<HTMLSpanElement>('span', ['profile__personalData'], `******`);
    this.linkChangePassword = new SimpleComponent<HTMLSpanElement>('span', ['profile__edit-link'], '(change password)');
    this.modalProfileBlock = new RegProfile();
    this.modalButtonSubmitPassword = Button(['registration__btn-submit'], 'Submit');
    this.modalButtonSubmitProfile = Button(['registration__btn-submit'], 'Submit');
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
    const password = new SimpleComponent<HTMLLIElement>('li', ['profile__item']).getElement();

    const labelFirstName = new SimpleComponent<HTMLSpanElement>(
      'span',
      ['profile__label'],
      'first name: '
    ).getElement();
    const labelLastName = new SimpleComponent<HTMLSpanElement>('span', ['profile__label'], 'last name: ').getElement();
    const labelBirth = new SimpleComponent<HTMLSpanElement>('span', ['profile__label'], 'birth: ').getElement();
    const labelEmail = new SimpleComponent<HTMLSpanElement>('span', ['profile__label'], 'email: ').getElement();
    const labelPassword = new SimpleComponent<HTMLSpanElement>('span', ['profile__label'], 'password: ').getElement();

    titleBox.append(titleProfile, this.linkEdit.getElement());
    firstName.append(labelFirstName, this.firstName.getElement());
    lastName.append(labelLastName, this.lastName.getElement());
    dateOfBirth.append(labelBirth, this.dateOfBirth.getElement());
    email.append(labelEmail, this.email.getElement());
    password.append(labelPassword, this.password.getElement(), this.linkChangePassword.getElement());

    profilList.append(titleBox, firstName, lastName, dateOfBirth, email, password);
    personalData.append(titlePersonalData, profileBox, addressesBox);
    profileBox.append(profilList);

    const customer = JSON.parse(localStorage.getItem('newCustomer')!) as Customer;
    const addressBillingID = customer.defaultBillingAddressId;
    const addressShippingID = customer.defaultShippingAddressId;

    let billingBlock;
    let shippingBlock;

    if (addressBillingID) {
      const addressBilling = customer.addresses.find((address) => address.id === addressBillingID)!;
      billingBlock = new AddressBlock('Billing Address', addressBilling);
    } else {
      billingBlock = new AddressBlock('Billing Address', 'none');
    }

    if (addressShippingID) {
      const addressShipping = customer.addresses.find((address) => address.id === addressShippingID)!;
      shippingBlock = new AddressBlock('Shipping Address', addressShipping);
    } else {
      shippingBlock = new AddressBlock('Shipping Address', 'none');
    }

    shippingBlock.getElement().classList.add('shipping');

    const addressList = new AddressList(customer.addresses, this.modal, billingBlock, shippingBlock).getElement();

    addressesBox.append(billingBlock.getElement(), shippingBlock.getElement(), titleAddresses, addressList);

    this.creatModalFormChangeProfile();
    this.creatModalFormChangePassword();

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
    const buttonSubmit = this.modalButtonSubmitProfile.getElement();

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
        console.log(`Failed to change address: ${error}`);
        handleError(new Error('Failed to change profile'), `Failed to change profile! ${error}`);
      }
    });
  }

  creatModalFormChangePassword() {
    const modalForm = document.createElement('form');
    modalForm.classList.add('address__modal-form');

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('registration__profile');
    const legend = new SimpleComponent<HTMLLegendElement>('legend', [], 'Change password').getElement();
    const inputCurrentPassword = Input(['registration__input-password']).getElement();
    const inputNewPassword = Input(['registration__input-password']).getElement();

    const labelCurrentPassword = creatInputWithLabel(
      inputCurrentPassword,
      'Current password:',
      'Current password',
      'password'
    );
    const massageErrorCurrentPassword = new SimpleComponent<HTMLParagraphElement>(
      'p',
      ['registration__massage-error'],
      ''
    ).getElement();
    const labelNewtPassword = creatInputWithLabel(inputNewPassword, 'New password:', 'New password', 'password');
    const massageErrorNewPassword = new SimpleComponent<HTMLParagraphElement>(
      'p',
      ['registration__massage-error'],
      ''
    ).getElement();

    inputCurrentPassword.addEventListener('input', () =>
      checkInputValue(
        inputCurrentPassword,
        massageErrorCurrentPassword,
        1,
        '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
        'Min 8 chars(1 upper, 1 lower, 1 num)'
      )
    );

    inputNewPassword.addEventListener('input', () =>
      checkInputValue(
        inputNewPassword,
        massageErrorNewPassword,
        1,
        '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
        'Min 8 chars(1 upper, 1 lower, 1 num)'
      )
    );

    fieldset.append(
      legend,
      labelCurrentPassword,
      massageErrorCurrentPassword,
      labelNewtPassword,
      massageErrorNewPassword
    );

    const buttonSubmit = this.modalButtonSubmitPassword.getElement();
    buttonSubmit.disabled = true;
    modalForm.append(fieldset, buttonSubmit);

    const modal = this.modal.getHtmlElement();
    const modalContainer = modal.firstChild!.firstChild as HTMLElement;

    this.linkChangePassword.addListener('click', () => {
      modalContainer.append(modalForm);
      Modal.openModal(modal);
    });

    const checkButtonSubmit = (arrayInputs: Element[]) => {
      buttonSubmit.disabled = arrayInputs.some((el) => !(el as HTMLInputElement).checkValidity());
    };

    const arrModalChangePasswordInputElements = [...fieldset.elements];
    arrModalChangePasswordInputElements.forEach((input) => {
      input.addEventListener('input', () => checkButtonSubmit(arrModalChangePasswordInputElements));
    });

    modalForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const currentPassword = inputCurrentPassword.value;
      const newPassword = inputNewPassword.value;
      try {
        showLoading();
        const customer = await getCustomerByID(this.customer.id);
        await changePassword(customer.id, customer.version, currentPassword, newPassword);

        const newCustomer = await getCustomerByID(customer.id);
        localStorage.setItem('newCustomer', JSON.stringify(newCustomer));
        localStorage.setItem('userID', JSON.stringify(newCustomer));
        this.customer = newCustomer;

        Modal.closeModal(modal);
        hideLoading();
        handleSucsess('The password change was successful!');
      } catch (error) {
        console.log(`Failed to change password: ${error}`);
        handleError(new Error('Failed to change password'), `Failed to change password! ${error}`);
      }
    });
  }

  getElement() {
    return this.element;
  }
}
