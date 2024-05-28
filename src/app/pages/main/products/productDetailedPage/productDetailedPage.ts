import ProductCard from '../productCard/productCard';
import { Pages } from '../../../../router/pages';
import BaseComponent from '../../../../components/baseComponent/baseComponent';
import './style.scss';

const CARD_TEXT_BACK = 'Go back...';

export default class ProductDetailPage extends ProductCard {
  configureView() {
    this.viewElementCreator.setCssClasses(['card', 'card__full']);

    let labelParams = {
      tag: 'label' as keyof HTMLElementTagNameMap,
      classNames: ['card__field'],
      text: this.card.name,
      callback: () => null,
    };
    let creatorLabel = new BaseComponent(labelParams);
    this.viewElementCreator.addInnerElement(creatorLabel);

    labelParams = {
      tag: 'label',
      classNames: ['card__field'],
      text: this.card.description,
      callback: () => null,
    };
    creatorLabel = new BaseComponent(labelParams);
    this.viewElementCreator.addInnerElement(creatorLabel);

    const buttonParams = {
      tag: 'button' as keyof HTMLElementTagNameMap,
      classNames: ['card__button'],
      text: CARD_TEXT_BACK,
      callback: this.buttonClickHandler.bind(this, `${Pages.PRODUCT}`),
    };
    const creatorButton = new BaseComponent(buttonParams);
    this.viewElementCreator.addInnerElement(creatorButton);
  }
}
