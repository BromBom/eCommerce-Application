import Layout from '../../../layout/layout';

const TEXT_PROFILE = 'Profile Page';

export default class Profile extends Layout {
  constructor() {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['profile'],
    };
    super(params);

    this.configureView();
  }

  configureView() {
    this.viewElementCreator.setTextContent(TEXT_PROFILE);
  }
}
