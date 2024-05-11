import { OptionsListener } from '../../types/types';

export interface Params {
  tag: keyof HTMLElementTagNameMap;
  classNames: string[];
  text?: string | undefined;
  callback: Function | null;
}

export default class BaseComponent<T extends HTMLElement> {
  readonly element: T;

  constructor(
    // public tag: keyof HTMLElementTagNameMap = 'div',
    // public className: string[] = [],
    // public text = ''
    params: Params
  ) {
    this.element = this.init(params) as T;
  }

  init(params: Params) {
    const element = document.createElement(params.tag);
    element.classList.add(...params.classNames);
    element.innerHTML = params.text || '';
    return element;
  }

  getElement() {
    return this.element;
  }

  addListener(eventType: string, callback: (event: Event) => void, options?: OptionsListener) {
    if (typeof callback === 'function') {
      this.element.addEventListener(eventType, callback, options);
    }
  }

  setTextContent(text = '') {
    this.element.textContent = text;
  }

  addInnerElement(element: HTMLElement | BaseComponent<T>) {
    if (element instanceof BaseComponent) {
      this.element.append(element.getElement());
    } else {
      this.element.append(element);
    }
  }
}
