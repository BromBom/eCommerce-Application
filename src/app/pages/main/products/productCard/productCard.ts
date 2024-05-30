import './style.scss';
import { Pages } from '../../../../router/pages';
import Layout from '../../../../layout/layout';
import BaseComponent from '../../../../components/baseComponent/baseComponent';
import { ICard } from '../../../../data/cards';
import Router from '../../../../router/router';
import { addToCart } from '../../../../utils/localstorage';
import { CartItem } from '../../../../types/types';

const CARD_TEXT_MORE = 'More details...';
const CARD_TEXT_ADD_TO_CART = 'Add to Cart';

export default class ProductCard extends Layout {
  card: ICard;

  router: Router;

  constructor(card: ICard, router: Router) {
    const params = {
      tag: 'article' as keyof HTMLElementTagNameMap,
      classNames: ['card'],
    };
    super(params);

    this.card = card;
    this.router = router;

    this.router.onNavigate((path) => {
      if (path.startsWith(`${Pages.PRODUCT}/`)) {
        console.log(`Navigating to product detail page: ${path}`);
      }
    });

    this.configureView();
  }

  configureView() {
    const labelParams = {
      tag: 'label' as keyof HTMLElementTagNameMap,
      classNames: ['card__field'],
      text: this.card.name,
      callback: () => null,
    };
    const creatorLabel = new BaseComponent(labelParams);
    this.viewElementCreator.addInnerElement(creatorLabel);

    const buttonMoreParams = {
      tag: 'button' as keyof HTMLElementTagNameMap,
      classNames: ['card__button'],
      text: CARD_TEXT_MORE,
      callback: this.buttonClickHandler.bind(this, `${Pages.PRODUCT}/${this.card.id}`),
    };
    console.log('Creating More details button with URL:', `${Pages.PRODUCT}/${this.card.id}`); // <-- Этот лог должен появиться
    const creatorButtonMore = new BaseComponent(buttonMoreParams);
    this.viewElementCreator.addInnerElement(creatorButtonMore);
    console.log('More details button added to DOM'); // <-- Этот лог должен появиться

    const buttonAddToCartParams = {
      tag: 'button' as keyof HTMLElementTagNameMap,
      classNames: ['card__button'],
      text: CARD_TEXT_ADD_TO_CART,
      callback: this.addToCartHandler.bind(this),
    };
    console.log('Creating Add to Cart button'); // <-- Этот лог должен появиться
    const creatorButtonAddToCart = new BaseComponent(buttonAddToCartParams);
    this.viewElementCreator.addInnerElement(creatorButtonAddToCart);
  }

  buttonClickHandler(url: string) {
    console.log('Navigating to URL:', url);
    this.router.navigate(url);
  }

  addToCartHandler() {
    const item: CartItem = {
      product: this.card.id,
      name: this.card.name,
      image: this.card.image,
      price: this.card.price,
      quantityInStock: this.card.stock,
      qty: 1,
      description: this.card.description,
    };
    addToCart(item);
  }
}
