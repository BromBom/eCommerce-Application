import Layout from '../../../layout/layout';
import './link.scss';

export interface LinkParams {
  pageParam: { name: string; callback: () => void };
  linkElements: Map<string, string>;
}

export default class Link extends Layout {
  linkElements: Map<string, Layout>;

  constructor(
    pageParam: { name: string; callback: () => void } = { name: '', callback: () => {} },
    linkElements: Map<string, Layout> = new Map()
  ) {
    const params = {
      tag: 'a' as keyof HTMLElementTagNameMap,
      classNames: ['nav-item'],
    };
    super(params);

    this.linkElements = linkElements;
    this.configureView(pageParam);
  }

  setSelectedStatus() {
    this.linkElements.forEach((linkElement) => linkElement.setNotSelectedStatus());

    const element = this.viewElementCreator.getElement();
    element?.classList.add('nav-item__selected');
  }

  setNotSelectedStatus() {
    const element = this.viewElementCreator.getElement();
    element?.classList.remove('nav-item__selected');
  }

  configureView(pageParam: { name: string; callback: () => void }) {
    this.viewElementCreator.setTextContent(pageParam.name);
    this.viewElementCreator.setCallback(pageParam.callback);

    const element = this.viewElementCreator.getElement();
    element?.addEventListener('click', this.setSelectedStatus.bind(this));
  }
}
