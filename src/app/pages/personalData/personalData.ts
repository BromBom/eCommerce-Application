import { Customer } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import Router from '../../router/router';

export default class PersonalData {
  element: HTMLDivElement;

  titlePersonalData: SimpleComponent<HTMLHeadingElement>;

  titleProfile: SimpleComponent<HTMLHeadingElement>;

  firstName: SimpleComponent<HTMLHeadingElement>;

  lastName: SimpleComponent<HTMLHeadingElement>;

  email: SimpleComponent<HTMLHeadingElement>;

  dateOfBirth: SimpleComponent<HTMLHeadingElement>;

  titleAddresses: SimpleComponent<HTMLHeadingElement>;

  constructor(
    public router: Router,
    customer: Customer
  ) {
    this.element = this.init();
    this.titlePersonalData = new SimpleComponent<HTMLHeadingElement>('h2', ['profile__title'], 'Personal Data');
    this.titleProfile = new SimpleComponent<HTMLHeadingElement>('h3', ['profile__title'], 'Profile');
    this.firstName = new SimpleComponent<HTMLHeadingElement>('h4', ['profile__personalData'], `${customer.firstName}`);
    this.lastName = new SimpleComponent<HTMLHeadingElement>('h4', ['profile__personalData'], `${customer.lastName}`);
    this.email = new SimpleComponent<HTMLHeadingElement>('h4', ['profile__personalData'], `${customer.email}`);
    this.dateOfBirth = new SimpleComponent<HTMLHeadingElement>(
      'h4',
      ['profile__personalData'],
      `${customer.dateOfBirth}`
    );
    this.titleAddresses = new SimpleComponent<HTMLHeadingElement>('h3', ['profile__title'], 'Addresses');
  }

  private init() {
    const personalData = document.createElement('div');
    const profileBox = document.createElement('div');
    const addressesBox = document.createElement('div');

    personalData.append(this.titlePersonalData.getElement(), profileBox, addressesBox);
    profileBox.append(
      this.titleProfile.getElement(),
      this.firstName.getElement(),
      this.lastName.getElement(),
      this.email.getElement(),
      this.dateOfBirth.getElement()
    );
    addressesBox.append(this.titleAddresses.getElement());

    return personalData;
  }

  getElement() {
    return this.element;
  }
}
