import './style.css';
import { Pages } from '../../../../router/pages';
import Layout from '../../../../layout/layout';
import BaseComponent from '../../../../components/baseComponent/baseComponent';
import { ICard } from '../../../../../data/cards';
import Router from '../../../../router/router';

const CARD_TEXT_MORE = 'More details...';

export default class productCard extends Layout {
  card: ICard;
  router: Router;
  // htmlElement: HTMLElement;

  constructor(card: ICard, router: Router) {
    const params = {
      tag: 'article' as keyof HTMLElementTagNameMap,
      classNames: ['card'],
    };
    super(params);

    this.card = card;
    this.router = router;

    // this.htmlElement = this.configureView();
    this.configureView();
  }

  configureView() {
    let labelParams = {
      tag: 'label' as keyof HTMLElementTagNameMap,
      classNames: ['card__field'],
      text: this.card.name,
    //   callback: () => null,
    };
    const creatorLabel = new BaseComponent(labelParams);
    this.viewElementCreator.addInnerElement(creatorLabel);

    labelParams = {
      tag: 'button',
      classNames: ['card__button'],
      text: CARD_TEXT_MORE,
      callback: this.buttonClickHandler.bind(this, `${Pages.PRODUCT}/${this.card.id}`),
    };
    const creatorButton = new BaseComponent(labelParams);
    this.viewElementCreator.addInnerElement(creatorButton);
  }

  buttonClickHandler(url: string) {
    this.router.navigate(url);
  }
}
