import './input.scss';
import BaseComponent, { Params } from '../../baseComponent/baseComponent';

export default class Input extends BaseComponent<HTMLDivElement> {
  inputElement: HTMLInputElement;

  labelElement: HTMLLabelElement;

  constructor(params: Params) {
    super(params);
    this.inputElement = document.createElement('input');
    this.labelElement = document.createElement('label');
    this.createElement(params);
  }

  createElement(params: Params) {
    this.element = document.createElement('div');

    this.element.classList.add('field__container');

    params.classNames.forEach((name) => {
      this.element.classList.add(name);
    });
    this.setCallback(params.callback);

    this.inputElement = document.createElement('input');

    this.setTextContent(params.text);

    this.element.append(this.labelElement, this.inputElement);
  }

  setValue(value: string) {
    this.inputElement.value = value;
  }

  setTextContent(text: string = '') {
    this.labelElement.textContent = text;
  }

  setCallback(callback: ((event: Event) => void) | null = null) {
    this.element.addEventListener('keyup', (event) => callback?.(event));
  }
}
