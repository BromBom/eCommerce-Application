import BaseComponent from '../../../../components/baseComponent';
import Input from '../../../../components/controls/input';
import creatInputWithLabel from '../../../../utils/creatInputWithLabel';

export default class RegProfile {
  element: HTMLFieldSetElement;

  legend: BaseComponent<HTMLLegendElement>;

  inputEmail: BaseComponent<HTMLInputElement>;

  inputPassword: BaseComponent<HTMLInputElement>;

  inputName: BaseComponent<HTMLInputElement>;

  inputLastName: BaseComponent<HTMLInputElement>;

  inputDate: BaseComponent<HTMLInputElement>;

  constructor() {
    this.legend = new BaseComponent<HTMLLegendElement>('legend', [], 'Profile');
    this.inputEmail = Input(['registration__input-email']);
    this.inputPassword = Input(['registration__input-password']);
    this.inputName = Input(['registration__input-name']);
    this.inputLastName = Input(['registration__input-lastname']);
    this.inputDate = Input(['registration__input-date']);
    this.element = this.init();
  }

  private init() {
    const regProfile = document.createElement('fieldset');
    const legend = this.legend.getElement();

    const labelEmail = creatInputWithLabel(this.inputEmail.getElement(), 'Email:', 'example@email.com', 'email');
    const labelPassword = creatInputWithLabel(this.inputPassword.getElement(), 'Password:', 'Example-123', 'password');
    const labelName = creatInputWithLabel(this.inputName.getElement(), 'First Name:', 'Name', 'text');
    const labelLastName = creatInputWithLabel(this.inputLastName.getElement(), 'Last Name:', 'Lastname', 'text');
    const labelDate = creatInputWithLabel(this.inputDate.getElement(), 'Birth:', '', 'date');

    regProfile.classList.add('registration__profile');
    regProfile.append(legend, labelEmail, labelPassword, labelName, labelLastName, labelDate);

    return regProfile;
  }

  getElement() {
    return this.element;
  }
}
