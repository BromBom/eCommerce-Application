import Layout from '../../layout/layout';
import Router from '../../router/router';

import './mainBanner.scss';

export default class Banner extends Layout {
  router: Router;

  section: HTMLElement;

  constructor(router: Router) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['banner'],
    };
    super(params);
    this.router = router;

    this.section = document.createElement('section');
    this.section.classList.add('mainBanner');

    const divText = document.createElement('div');
    divText.classList.add('mainBanner_text');

    const title = document.createElement('h1');
    title.classList.add('mainBanner-title');
    title.textContent = 'Buy one item and get a 20% discount on your second purchase';

    const description = document.createElement('div');
    description.classList.add('mainBanner-description');
    description.textContent = 'PROMOCODE: ADIDASFORUS';

    divText.append(title, description);

    this.section.append(divText);

    const htmlElement = this.getHtmlElement();
    if (htmlElement) {
      htmlElement.appendChild(this.section);
    }
  }
}
