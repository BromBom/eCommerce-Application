import Layout from '../../../layout/layout';
import Router from '../../../router/router';
import { cardsData } from '../../../data/cards';
import ProductCard from './productCard/productCard';
import ProductDetails from './productDetails/productDetails';

export default class Products extends Layout {
  constructor(router: Router, id = '') {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['product'],
    };
    super(params);

    if (id) {
      this.addLargeCardToView(router, id);
    } else {
      this.addSmallCardsToView(router);
    }
  }

  addSmallCardsToView(router: Router) {
    cardsData.forEach((card) => {
      const smallCardComponent = new ProductCard(card, router);
      this.viewElementCreator.addInnerElement(smallCardComponent.getHtmlElement());
    });
  }

  addLargeCardToView(router: Router, id: string) {
    const selectedCard = cardsData.find((card) => card.id === id);

    if (selectedCard) {
      const largeCardComponent = new ProductDetails(selectedCard, router);
      this.viewElementCreator.addInnerElement(largeCardComponent.getHtmlElement());
    }
  }
}
