export interface Params {
  tag: keyof HTMLElementTagNameMap;
  classNames: string[];
  text?: string;
  callback: (event: MouseEvent) => void | null;
}

export default class BaseComponent<T extends HTMLElement> {
  element: T | null;

  constructor(params: Params) {
    const { tag, classNames, text = '' } = params;
    this.element = document.createElement(tag) as T;
    this.element.classList.add(...classNames);
    if (text) {
      this.element.textContent = text;
    }
  }

  getElement(): T | null {
    return this.element || null;
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
    this.setCallback(params.callback);
  }

  setHTMLContent(html: string) {
    if (this.element) {
      this.element.innerHTML = html;
    }
  }

  setCssClasses(cssClasses: string[] = []) {
    cssClasses.map((cssClass) => this.element?.classList.add(cssClass));
  }

  setTextContent(text: string) {
    if (this.element) {
      this.element.textContent = text;
    }
  }

  setCallback(callback: (event: MouseEvent) => void) {
    if (typeof callback === 'function' && this.element) {
      this.element.addEventListener('click', (event) => callback(event));
    }
  }

  removeElement(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
