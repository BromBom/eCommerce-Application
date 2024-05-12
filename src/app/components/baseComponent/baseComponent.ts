/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Params {
  tag: keyof HTMLElementTagNameMap;
  classNames: string[];
  text?: string | undefined;
  callback: (event: any) => void | null;
}

export default class BaseComponent<T extends HTMLElement> {
  element: T | null;

  constructor(params: Params) {
    this.element = null;
    this.createElement(params);
  }

  /**
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }

  addInnerElement(element) {
    if (element instanceof BaseComponent) {
      this.element.append(element.getElement());
    } else {
      this.element.append(element);
    }
  }

  createElement(params) {
    this.element = document.createElement(params.tag);
    this.setCssClasses(params.classNames);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
  }

  setCssClasses(cssClasses = []) {
    cssClasses.map((cssClass) => this.element.classList.add(cssClass));
  }

  setTextContent(text = '') {
    this.element.textContent = text;
  }

  setCallback(callback) {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event) => callback(event));
    }
  }
}
