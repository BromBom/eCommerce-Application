import Layout from '../../layout/layout';

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
    this.viewElementCreator.setTextContent('Страница не найдена');
  }
}
