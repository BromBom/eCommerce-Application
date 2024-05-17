export interface Params {
  tag: keyof HTMLElementTagNameMap;
  classNames: string[];
  text?: string;
  callback: (event: MouseEvent) => void | null;
}

export default class BaseComponent<T extends HTMLElement> {
  element: T | null;

  constructor(params: Params) {
    this.element = null;
    this.createElement(params);
  }

  getElement(): T | null {
    return this.element;
  }

  addInnerElement(element: BaseComponent<T> | HTMLElement) {
    const elementToAppend = element instanceof BaseComponent ? element.getElement() : element;
    if (elementToAppend !== null) {
      this.element?.append(elementToAppend);
    }
  }

  createElement(params: Params) {
    this.element = document.createElement(params.tag) as T;
    this.setCssClasses(params.classNames);
    this.setTextContent(params.text);
    this.setCallback(params.callback);
  }

  setCssClasses(cssClasses: string[] = []) {
    cssClasses.map((cssClass) => this.element?.classList.add(cssClass));
  }

  setTextContent(text = '') {
    if (this.element) {
      this.element.textContent = text;
    }
  }

  setCallback(callback: (event: MouseEvent) => void) {
    if (typeof callback === 'function' && this.element) {
      this.element.addEventListener('click', (event) => callback(event));
    }
  }
}
