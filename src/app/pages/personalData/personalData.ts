import { Customer } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import Router from '../../router/router';

import './personalData.scss';

export default class PersonalData {
  element: HTMLDivElement;

  linkEdit: SimpleComponent<HTMLSpanElement>;

  firstName: SimpleComponent<HTMLSpanElement>;

  lastName: SimpleComponent<HTMLSpanElement>;

  email: SimpleComponent<HTMLSpanElement>;

  dateOfBirth: SimpleComponent<HTMLSpanElement>;

  constructor(
    public router: Router,
    customer: Customer
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
    addressesBox.append(titleAddresses);

    return personalData;
  }

  getElement() {
    return this.element;
  }
}
