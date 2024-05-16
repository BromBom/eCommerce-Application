import BaseComponent from '../../../../components/baseComponent';
import Input from '../../../../components/controls/input';
import creatInputWithLabel from '../../../../utils/creatInputWithLabel';
import checkInputValue from '../../../../utils/checkInputValue';

export default class RegProfile {
  element: HTMLFieldSetElement;

  legend: BaseComponent<HTMLLegendElement>;

  inputEmail: BaseComponent<HTMLInputElement>;

  massageErrorEmail: BaseComponent<HTMLParagraphElement>;

  inputPassword: BaseComponent<HTMLInputElement>;

  massageErrorPassword: BaseComponent<HTMLParagraphElement>;

  inputName: BaseComponent<HTMLInputElement>;

  massageErrorName: BaseComponent<HTMLParagraphElement>;

  inputLastName: BaseComponent<HTMLInputElement>;

  massageErrorLastName: BaseComponent<HTMLParagraphElement>;

  inputDate: BaseComponent<HTMLInputElement>;

  massageErrorDate: BaseComponent<HTMLParagraphElement>;

  constructor() {
    this.legend = new BaseComponent<HTMLLegendElement>('legend', [], 'Profile');
    this.inputEmail = Input(['registration__input-email']);
    this.massageErrorEmail = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputPassword = Input(['registration__input-password']);
    this.massageErrorPassword = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputName = Input(['registration__input-name']);
    this.massageErrorName = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputLastName = Input(['registration__input-lastname']);
    this.massageErrorLastName = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputDate = Input(['registration__input-date']);
    this.massageErrorDate = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.element = this.init();
  }

  private init() {
    const regProfile = document.createElement('fieldset');
    const legend = this.legend.getElement();

    this.inputEmail.addListener('input', () =>
      checkInputValue(
        this.inputEmail.getElement(),
        this.massageErrorEmail.getElement(),
        1,
        '[a-zA-Z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$',
        'example@email.com'
      )
    );
    const labelEmail = creatInputWithLabel(this.inputEmail.getElement(), 'Email:', 'example@email.com', 'email');
    const msgErrEmail = this.massageErrorEmail.getElement();

    this.inputPassword.addListener('input', () =>
      checkInputValue(
        this.inputPassword.getElement(),
        this.massageErrorPassword.getElement(),
        1,
        '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
        'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number'
      )
    );
    const labelPassword = creatInputWithLabel(this.inputPassword.getElement(), 'Password:', 'Example-123', 'password');
    const msgErrPassword = this.massageErrorPassword.getElement();

    this.inputName.addListener('input', () =>
      checkInputValue(
        this.inputName.getElement(),
        this.massageErrorName.getElement(),
        1,
        '[a-zA-Z]{2,}',
        'Must contain at least one character and no special characters or numbers'
      )
    );
    const labelName = creatInputWithLabel(this.inputName.getElement(), 'First Name:', 'Name', 'text');
    const msgErrName = this.massageErrorName.getElement();

    this.inputLastName.addListener('input', () =>
      checkInputValue(
        this.inputLastName.getElement(),
        this.massageErrorLastName.getElement(),
        1,
        '[a-zA-Z]{2,}',
        'Must contain at least one character and no special characters or numbers'
      )
    );
    const labelLastName = creatInputWithLabel(this.inputLastName.getElement(), 'Last Name:', 'Lastname', 'text');
    const msgErrLastName = this.massageErrorLastName.getElement();

    this.inputDate.getElement().setAttribute('max', '2006-01-01');
    this.inputDate.getElement().setAttribute('min', '1920-01-01');
    const labelDate = creatInputWithLabel(this.inputDate.getElement(), 'Birth:', '', 'date');
    const msgErrDate = this.massageErrorDate.getElement();

    regProfile.classList.add('registration__profile');
    regProfile.append(
      legend,
      labelEmail,
      msgErrEmail,
      labelPassword,
      msgErrPassword,
      labelName,
      msgErrName,
      labelLastName,
      msgErrLastName,
      labelDate,
      msgErrDate
    );

    const arrInputElements = [...regProfile.elements];
    arrInputElements.forEach((element) => {
      element.setAttribute('required', 'required');
    });

    return regProfile;
  }

  getElement() {
    return this.element;
  }
}
