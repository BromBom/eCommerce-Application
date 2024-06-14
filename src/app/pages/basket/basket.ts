import { Cart } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import BasketProductBox from './basketProductBox/basketProductBox';
import Router from '../../router/router';
import { Pages } from '../../router/pages';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../utils/showmessage';
import { getCartByID, removeProductToCart } from '../../../api/cart';

import './basket.scss';

export default class PersonalData {
  element: HTMLDivElement;

  titleBasketEmpty: SimpleComponent<HTMLHeadingElement>;

  linkToMain: SimpleComponent<HTMLHeadingElement>;

  titlePrice: SimpleComponent<HTMLParagraphElement>;

  constructor(
    public router: Router,
    public cart: Cart
  ) {
    this.titleBasketEmpty = new SimpleComponent<HTMLHeadingElement>(
      'h3',
      ['basket__title-empty-cart'],
      'Cart is empty'
    );
    this.linkToMain = new SimpleComponent<HTMLHeadingElement>('h4', ['basket__link-main'], 'Go to main');
    this.titlePrice = new SimpleComponent<HTMLParagraphElement>(
      'p',
      ['basket__price'],
      `${(this.cart.totalPrice.centAmount / 100).toFixed(2)} $`
    );
    this.element = this.init();
  }

  private init() {
    const basketPage = document.createElement('div');
    basketPage.classList.add('basket__root');
    const basketContainer = document.createElement('div');
    basketContainer.classList.add('basket__container');
    basketPage.append(basketContainer);

    const titleBasketEmpty = this.titleBasketEmpty.getElement();
    const linkToMain = this.linkToMain.getElement();

    if (this.cart.lineItems.length === 0) {
      basketContainer.append(titleBasketEmpty, linkToMain);
    } else {
      const basketHeader = document.createElement('div');
      basketHeader.classList.add('basket__header');
      const titleBox = document.createElement('div');
      titleBox.classList.add('basket__title-box');
      const titleBasketWithProducts = new SimpleComponent<HTMLHeadingElement>(
        'h3',
        ['basket__title-cart'],
        'Cart'
      ).getElement();
      const countProducts = new SimpleComponent<HTMLSpanElement>(
        'span',
        ['basket__count'],
        `${this.cart.lineItems.length}`
      ).getElement();
      const itemsSpan = new SimpleComponent<HTMLSpanElement>('span', ['basket__span'], `items`).getElement();
      const productsCounter = document.createElement('div');
      productsCounter.classList.add('basket__counter');

      const linkClear = new SimpleComponent<HTMLParagraphElement>('p', ['basket__link-clear'], 'Clear').getElement();

      productsCounter.append(countProducts, itemsSpan);
      basketHeader.append(titleBox, linkClear);
      titleBox.append(titleBasketWithProducts, productsCounter);

      // start products list-----------------------------------------------------------------------------------------------

      const productsContainer = document.createElement('div');
      productsContainer.classList.add('basket__products-container');
      this.cart.lineItems.forEach((product) => {
        const basketProductBox = new BasketProductBox(product);
        productsContainer.append(basketProductBox.getElement());

        basketProductBox.deleteIcon.addEventListener('click', async () => {
          try {
            showLoading();
            const cartID = localStorage.getItem('CurrentCartId');
            const cart = await getCartByID(cartID!);
            const productInCart = cart.lineItems.find((lineItem) => lineItem.id === basketProductBox.product.id);
            const newCart = await removeProductToCart(cart, productInCart!.id);
            basketProductBox.element.remove();
            countProducts.textContent = `${newCart.lineItems.length}`;
            this.titlePrice.getElement().textContent = `${(newCart.totalPrice.centAmount / 100).toFixed(2)} $`;
            hideLoading();
            handleSucsess('Removing product from the cart was successful!');
          } catch (error) {
            console.error(`Failed to delete product: ${error}`);
            handleError(
              new Error('Failed to delete product from the cart'),
              `Failed to delete product from the cart! ${error}`
            );
          }
        });
      });

      // end products list-------------------------------------------------------------------------------------------------

      const totalContainer = document.createElement('div');
      totalContainer.classList.add('basket__total-container');

      const titleTotal = new SimpleComponent<HTMLParagraphElement>('p', ['basket__total'], 'Total:').getElement();
      const titlePrice = this.titlePrice.getElement();

      totalContainer.append(titleTotal, titlePrice);

      basketContainer.append(basketHeader, productsContainer, totalContainer);
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
