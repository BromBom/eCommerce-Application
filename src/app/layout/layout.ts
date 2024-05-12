/* eslint-disable @typescript-eslint/no-explicit-any */
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
    return this.viewElementCreator.getElement();
  }

  createView(params: LayoutParams): BaseComponent<any> {
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
