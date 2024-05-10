import BaseComponent from '../../../../components/baseComponent';
import Input from '../../../../components/controls/input';
import creatInputWithLabel from '../../../../utils/creatInputWithLabel';

export default class RegAddress {
  element: HTMLFieldSetElement;

  legend: BaseComponent<HTMLLegendElement>;

  inputStreet: BaseComponent<HTMLInputElement>;

  inputCity: BaseComponent<HTMLInputElement>;

  inputPostalCode: BaseComponent<HTMLInputElement>;

  inputCountry: BaseComponent<HTMLInputElement>;

  constructor() {
    this.legend = new BaseComponent<HTMLLegendElement>('legend', [], 'Address');
    this.inputStreet = Input(['registration__input-street']);
    this.inputCity = Input(['registration__input-password']);
    this.inputPostalCode = Input(['registration__input-name']);
    this.inputCountry = Input(['registration__input-lastname']);
    this.element = this.init();
  }

  private init() {
    const regAddress = document.createElement('fieldset');
    const legend = this.legend.getElement();

    const labelStreet = creatInputWithLabel(this.inputStreet.getElement(), 'Street:', '4 Washington Pl,', 'text');
    const labelCity = creatInputWithLabel(this.inputCity.getElement(), 'City:', 'New-York', 'text');
    const labelPostalCode = creatInputWithLabel(this.inputPostalCode.getElement(), 'Postal code:', 'A1B 2C3', 'text');
    const labelCountry = creatInputWithLabel(this.inputCountry.getElement(), 'Country:', 'US or RU', 'text');

    regAddress.classList.add('registration__address');
    regAddress.append(legend, labelStreet, labelCity, labelPostalCode, labelCountry);

    return regAddress;
  }

  getElement() {
    return this.element;
  }
}
