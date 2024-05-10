export default class Footer {
  element: HTMLDivElement;

  constructor() {
    this.element = this.init();
  }

  private init() {
    this.element = document.createElement('div');
    this.element.classList.add('footer');
    return this.element;
  }

  getElement() {
    return this.element;
  }
}
