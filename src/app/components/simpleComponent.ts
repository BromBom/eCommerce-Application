import { OptionsListener } from '../types/types';

export default class SimpleComponent<T extends HTMLElement> {
  readonly element: T;

  constructor(
    public tag: keyof HTMLElementTagNameMap = 'div',
    public className: string[] = [],
    public text = ''
  ) {
    this.element = this.init() as T;
  }

  private init() {
    const element = document.createElement(this.tag);
    element.classList.add(...this.className);
    element.innerHTML = this.text;
    return element;
  }

  getElement() {
    return this.element;
  }

  addListener(eventType: string, callback: (event: Event) => void, options?: OptionsListener) {
    this.element.addEventListener(eventType, callback, options);
  }
}
