import Layout from '../../layout/layout';

const TEXT = 'test';

export default class Footer extends Layout {
  constructor() {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['footer'],
    };
    super(params);
    this.configureView();
  }

  configureView() {
    this.viewElementCreator.setTextContent(TEXT);
  }
}
