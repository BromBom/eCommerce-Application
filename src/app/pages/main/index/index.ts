import Layout from '../../../layout/layout';

const TEXT = 'INDEX PAGE';

export default class Index extends Layout {
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
