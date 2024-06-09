import { ProductProjection } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import Router from '../../router/router';
import { Pages } from '../../router/pages';

import './basket.scss';

export default class PersonalData {
  element: HTMLDivElement;

  titleBasket: SimpleComponent<HTMLHeadingElement>;

  linkToMain: SimpleComponent<HTMLHeadingElement>;

  constructor(
    public router: Router,
    public products: ProductProjection[] = []
  ) {
    this.titleBasket = new SimpleComponent<HTMLHeadingElement>('h3', ['basket__title'], 'Cart is empty');
    this.linkToMain = new SimpleComponent<HTMLHeadingElement>('p', ['basket__link'], 'Go to main');
    this.element = this.init();
  }

  private init() {
    const basketPage = document.createElement('div');
    basketPage.classList.add('basket__root');
    const basketContainer = document.createElement('div');
    basketContainer.classList.add('basket__container');
    const titleBasket = this.titleBasket.getElement();
    const linkToMain = this.linkToMain.getElement();

    basketPage.append(basketContainer);

    if (!this.products) {
      basketContainer.append(titleBasket, linkToMain);
    } else {
      basketContainer.append(titleBasket, linkToMain); // заменить на карточки
    }

    linkToMain.addEventListener('click', () => {
      this.router.navigate(Pages.PRODUCT);
    });

    return basketPage;
  }

  getElement() {
    return this.element;
  }
}
