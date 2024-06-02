// import { getCartItems, removeFromCart, addToCart } from '../../../utils/localstorage';
// import { CartItem } from '../../../types/types';
import Router from '../../../router/router';
import Layout from '../../../layout/layout';

const CART = 'Cart';

export default class CartScreen extends Layout {
  router: Router;

  constructor(router: Router) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['cart'],
    };
    super(params);

    this.router = router;

    this.configureView();
  }

  configureView() {
    this.viewElementCreator.setTextContent(CART);
  }
}
