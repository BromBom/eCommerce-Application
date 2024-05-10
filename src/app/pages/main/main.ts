export default class Main {
  element: HTMLDivElement;

  constructor() {
    this.element = this.init();
  }

  private init() {
    this.element = document.createElement('div');
    this.element.classList.add('main__page');
    return this.element;
  }

  getElement() {
    return this.element;
  }
}
