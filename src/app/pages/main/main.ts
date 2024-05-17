import Layout from '../../layout/layout';

export default class Main extends Layout {
  constructor() {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['main'],
    };
    super(params);
  }

  setContent(content: Layout) {
    const htmlElement = this.viewElementCreator.getElement();

    while (htmlElement?.firstElementChild) {
      htmlElement.firstElementChild.remove();
    }

    this.viewElementCreator.addInnerElement(content.getHtmlElement());
  }
}
