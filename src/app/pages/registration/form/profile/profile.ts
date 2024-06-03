import SimpleComponent from '../../../../components/simpleComponent';
import Input from '../../../../components/controls/input';
import creatInputWithLabel from '../../../../utils/creatInputWithLabel';
import checkInputValue from '../../../../utils/checkInputValue';

export default class RegProfile {
  element: HTMLFieldSetElement;

  legend: SimpleComponent<HTMLLegendElement>;

  inputEmail: SimpleComponent<HTMLInputElement>;

  massageErrorEmail: SimpleComponent<HTMLParagraphElement>;

  inputPassword: SimpleComponent<HTMLInputElement>;

  massageErrorPassword: SimpleComponent<HTMLParagraphElement>;

  inputName: SimpleComponent<HTMLInputElement>;

  massageErrorName: SimpleComponent<HTMLParagraphElement>;

  inputLastName: SimpleComponent<HTMLInputElement>;

  massageErrorLastName: SimpleComponent<HTMLParagraphElement>;

  inputDate: SimpleComponent<HTMLInputElement>;

  massageErrorDate: SimpleComponent<HTMLParagraphElement>;

  constructor() {
    this.legend = new SimpleComponent<HTMLLegendElement>('legend', [], 'Profile');
    this.inputEmail = Input(['registration__input-email']);
    this.massageErrorEmail = new SimpleComponent<HTMLParagraphElement>('p', ['registration__massage-error'], '');
    this.inputPassword = Input(['registration__input-password']);
    this.massageErrorPassword = new SimpleComponent<HTMLParagraphElement>('p', ['registration__massage-error'], '');
    this.inputName = Input(['registration__input-name']);
    this.massageErrorName = new SimpleComponent<HTMLParagraphElement>('p', ['registration__massage-error'], '');
    this.inputLastName = Input(['registration__input-lastname']);
    this.massageErrorLastName = new SimpleComponent<HTMLParagraphElement>('p', ['registration__massage-error'], '');
    this.inputDate = Input(['registration__input-date']);
    this.massageErrorDate = new SimpleComponent<HTMLParagraphElement>('p', ['registration__massage-error'], '');
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

    const labelDate = creatInputWithLabel(this.inputDate.getElement(), 'Birth:', 'Date of Birth', 'date');
    const msgErrDate = this.massageErrorDate.getElement();
    this.inputDate.getElement().setAttribute('max', '2006-01-01');
    this.inputDate.getElement().setAttribute('min', '1900-01-01');
    this.inputDate.getElement().setAttribute('autocomplete', 'on');
    this.inputDate.addListener('input', () => {
      if (+this.inputDate.getElement().value.split('-')[0] < 1900) {
        const errorMessage = 'You are too old for it! Year must be 1900 or later.';
        this.inputDate.getElement().setCustomValidity(errorMessage);
        this.inputDate.getElement().reportValidity();
        this.massageErrorDate.getElement().textContent = errorMessage;
      }
      if (+this.inputDate.getElement().value.split('-')[0] > 2006) {
        const errorMessage = 'You must be at least 18 years old.';
        this.inputDate.getElement().setCustomValidity(errorMessage);
        this.inputDate.getElement().reportValidity();
        this.massageErrorDate.getElement().textContent = errorMessage;
      }
    });

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
