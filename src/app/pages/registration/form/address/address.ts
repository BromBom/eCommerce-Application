import BaseComponent from '../../../../components/baseComponent';
import Input from '../../../../components/controls/input';
import creatInputWithLabel from '../../../../utils/creatInputWithLabel';
import checkInputValue from '../../../../utils/checkInputValue';

export default class RegAddress {
  element: HTMLFieldSetElement;

  legend: BaseComponent<HTMLLegendElement>;

  inputStreet: BaseComponent<HTMLInputElement>;

  massageErrorStreet: BaseComponent<HTMLParagraphElement>;

  inputCity: BaseComponent<HTMLInputElement>;

  massageErrorCity: BaseComponent<HTMLParagraphElement>;

  inputPostalCode: BaseComponent<HTMLInputElement>;

  massageErrorPostalCode: BaseComponent<HTMLParagraphElement>;

  inputCountry: BaseComponent<HTMLInputElement>;

  massageErrorCountry: BaseComponent<HTMLParagraphElement>;

  constructor() {
    this.legend = new BaseComponent<HTMLLegendElement>('legend', ['massage-error'], 'Address');
    this.inputStreet = Input(['registration__input-street']);
    this.massageErrorStreet = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputCity = Input(['registration__input-password']);
    this.massageErrorCity = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputPostalCode = Input(['registration__input-name']);
    this.massageErrorPostalCode = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
    this.inputCountry = Input(['registration__input-lastname']);
    this.massageErrorCountry = new BaseComponent<HTMLParagraphElement>('p', ['massage-error'], '');
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
        '[a-zA-Z0-9\\s\\-]{2,}',
        'Must contain at least one character'
      )
    );
    const labelStreet = creatInputWithLabel(this.inputStreet.getElement(), 'Street:', '4 Washington Pl,', 'text');
    const msgErrStreet = this.massageErrorStreet.getElement();

    this.inputCity.addListener('input', () =>
      checkInputValue(
        this.inputCity.getElement(),
        this.massageErrorCity.getElement(),
        1,
        '[a-zA-Z]{2,}',
        'Must contain at least one character and no special characters or numbers'
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
      labelCity,
      msgErrCity,
      labelPostalCode,
      msgErrPostalCode,
      labelCountry,
      msgErrCountry
    );

    return regAddress;
  }

  getElement() {
    return this.element;
  }
}
