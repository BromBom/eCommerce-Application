import Layout from '../../layout/layout';

const TEXT_NOT_FOUND = 'Страница не найдена';

export default class NotFound extends Layout {
  constructor() {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['not-found'],
    };
    super(params);
    this.configureView();
  }

  configureView() {
    this.viewElementCreator.setTextContent(TEXT_NOT_FOUND);
  }
}
