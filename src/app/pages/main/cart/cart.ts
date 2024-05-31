import Layout from '../../../layout/layout';

const TEXT = 'CART PAGE';

export default class CART extends Layout {
  constructor() {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['index'],
    };
    super(params);
    this.configureView();
  }

  configureView() {
    this.viewElementCreator.setTextContent(TEXT);
  }
}
