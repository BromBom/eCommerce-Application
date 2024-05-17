import BaseComponent, { Params } from '../components/baseComponent/baseComponent';

interface LayoutParams {
  tag: keyof HTMLElementTagNameMap;
  classNames: Array<string>;
}

export default class Layout {
  viewElementCreator: BaseComponent<HTMLElement>;

  constructor(params: LayoutParams = { tag: 'section', classNames: [] }) {
    this.viewElementCreator = this.createView(params);
  }

  getHtmlElement(): HTMLElement {
    const element = this.viewElementCreator.getElement();
    if (element === null) {
      return document.createElement('div');
    }
    return element;
  }

  createView(params: LayoutParams): BaseComponent<HTMLElement> {
    const elementParams: Params = {
      tag: params.tag,
      classNames: params.classNames,
      text: '',
      callback: () => null,
    };
    this.viewElementCreator = new BaseComponent(elementParams);

    return this.viewElementCreator;
  }

  setNotSelectedStatus() {
    const element = this.viewElementCreator.getElement();
    element?.classList.remove('nav-item__selected');
  }
}
