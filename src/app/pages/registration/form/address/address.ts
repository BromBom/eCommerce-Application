import SimpleComponent from '../../../../components/simpleComponent';
import Input from '../../../../components/controls/input';
import creatInputWithLabel from '../../../../utils/creatInputWithLabel';
import checkInputValue from '../../../../utils/checkInputValue';

export default class RegAddress {
  element: HTMLFieldSetElement;

  legend: SimpleComponent<HTMLLegendElement>;

  inputStreet: SimpleComponent<HTMLInputElement>;

  massageErrorStreet: SimpleComponent<HTMLParagraphElement>;

  inputStreetNumber: SimpleComponent<HTMLInputElement>;

  massageErrorStreetNumber: SimpleComponent<HTMLParagraphElement>;

  inputCity: SimpleComponent<HTMLInputElement>;

  massageErrorCity: SimpleComponent<HTMLParagraphElement>;

  inputPostalCode: SimpleComponent<HTMLInputElement>;

  massageErrorPostalCode: SimpleComponent<HTMLParagraphElement>;

  inputCountry: SimpleComponent<HTMLInputElement>;

  massageErrorCountry: SimpleComponent<HTMLParagraphElement>;

  constructor() {
    this.legend = new SimpleComponent<HTMLLegendElement>('legend', ['registration__legend'], 'Billing address');
    this.inputStreet = Input(['registration__input-street']);
    this.massageErrorStreet = new SimpleComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputStreetNumber = Input(['registration__input-street-number']);
    this.massageErrorStreetNumber = new SimpleComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputCity = Input(['registration__input-password']);
    this.massageErrorCity = new SimpleComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputPostalCode = Input(['registration__input-name']);
    this.massageErrorPostalCode = new SimpleComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputCountry = Input(['registration__input-lastname']);
    this.massageErrorCountry = new SimpleComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.element = this.init();
  }

  private init() {
    const regAddress = document.createElement('fieldset');
    const legend = this.legend.getElement();

    this.inputStreet.addListener('input', () =>
      checkInputValue(
        this.inputStreet.getElement(),
        this.massageErrorStreet.getElement(),
        1,
        '[a-zA-Z0-9\\s\\-\\,]{2,}',
        'Must contain at least one character'
      )
    );
    const labelStreet = creatInputWithLabel(this.inputStreet.getElement(), 'Street:', 'Washington Pl, 36', 'text');
    const msgErrStreet = this.massageErrorStreet.getElement();

    this.inputStreetNumber.addListener('input', () =>
      checkInputValue(
        this.inputStreet.getElement(),
        this.massageErrorStreet.getElement(),
        1,
        '.{2,}',
        'Must contain at least one character'
      )
    );
    const labelStreetNumber = creatInputWithLabel(
      this.inputStreetNumber.getElement(),
      'Apartment/Suite:',
      '25/2a',
      'text'
    );
    const msgErrStreetNumber = this.massageErrorStreetNumber.getElement();

    this.inputCity.addListener('input', () =>
      checkInputValue(
        this.inputCity.getElement(),
        this.massageErrorCity.getElement(),
        1,
        '[a-zA-Z0-9\\s\\-]{2,}',
        'Must contain at least one character'
      )
    );
    const labelCity = creatInputWithLabel(this.inputCity.getElement(), 'City:', 'New York', 'text');
    const msgErrCity = this.massageErrorCity.getElement();

    this.inputPostalCode.addListener('input', () =>
      checkInputValue(
        this.inputPostalCode.getElement(),
        this.massageErrorPostalCode.getElement(),
        4,
        '[a-zA-Z0-9\\s]{5,}',
        'Must follow the format for the country'
      )
    );
    const labelPostalCode = creatInputWithLabel(
      this.inputPostalCode.getElement(),
      'Postal code:',
      '12345 or A1B 2C3',
      'text'
    );
    const msgErrPostalCode = this.massageErrorPostalCode.getElement();

    this.inputCountry.addListener('input', () =>
      checkInputValue(
        this.inputCountry.getElement(),
        this.massageErrorCountry.getElement(),
        1,
        '[A-Z]{2,}',
        'Must be a valid country'
      )
    );
    const labelCountry = creatInputWithLabel(this.inputCountry.getElement(), 'Country:', 'US or RU', 'text');
    const msgErrCountry = this.massageErrorCountry.getElement();

    regAddress.classList.add('registration__address');
    regAddress.append(
      legend,
      labelStreet,
      msgErrStreet,
      labelStreetNumber,
      msgErrStreetNumber,
      labelCity,
      msgErrCity,
      labelPostalCode,
      msgErrPostalCode,
      labelCountry,
      msgErrCountry
    );

    const arrInputElements = [...regAddress.elements];
    arrInputElements.forEach((element) => {
      element.setAttribute('required', 'required');
    });

    return regAddress;
  }

  getElement() {
    return this.element;
  }
}
