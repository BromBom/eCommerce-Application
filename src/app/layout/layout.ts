import { Params } from '../components/baseComponent/baseComponent';
import BaseComponent from '../components/baseComponent/baseComponent';

interface ViewParams {
  tag: keyof HTMLElementTagNameMap;
  classNames: Array<string>;
}

export default abstract class Layout {
  viewElementCreator: BaseComponent<HTMLElement>;
  constructor(params: ViewParams = { tag: 'section', classNames: [] }) {
    this.viewElementCreator = this.createView(params);
  }

  getHtmlElement(): HTMLElement {
    return this.viewElementCreator.getElement();
  }

  createView(params: ViewParams): BaseComponent<HTMLElement> {
    const elementParams: Params = {
      tag: params.tag,
      classNames: params.classNames,
      text: '',
      callback: null,
    };
    this.viewElementCreator = new BaseComponent(elementParams);

    return this.viewElementCreator;
  }
}
