import Layout from '../../../layout/layout';
import { Page } from '../../header/header';
import './link.scss';

interface LinkParams {
  pageParam: Page;
  linkElements: Map<string, Link>;
}

export default class Link extends Layout {
  linkElements: any;
  constructor(pageParam: Page, linkElements: LinkParams) {
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
    element.classList.add('nav-item__selected');
  }

  setNotSelectedStatus() {
    // получим элемент
    const element = this.viewElementCreator.getElement();
    // добавим стили
    element.classList.remove('nav-item__selected');
  }

  configureView(pageParam: Page) {
    this.viewElementCreator.setTextContent(pageParam.name);
    this.viewElementCreator.addListener('click', (event: Event) => pageParam.callback());

    const element = this.viewElementCreator.getElement();
    element.addEventListener('click', this.setSelectedStatus.bind(this));
  }
}
