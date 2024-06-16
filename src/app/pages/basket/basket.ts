import { Cart } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import BasketProductBox from './basketProductBox/basketProductBox';
import Router from '../../router/router';
import { Pages } from '../../router/pages';
import { addDiscountCodeToCart } from '../../../api/cart';
import { handleError, handleSucsess, hideLoading } from '../../utils/showmessage';
import { CustomError } from '../../types/types';
import './basket.scss';

export default class PersonalData {
  element: HTMLDivElement;

  titleBasketEmpty: SimpleComponent<HTMLHeadingElement>;

  linkToMain: SimpleComponent<HTMLHeadingElement>;

  discountInput: HTMLInputElement;

  applyDiscountButton: HTMLButtonElement;

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
    this.discountInput = document.createElement('input');
    this.discountInput.type = 'text';
    this.discountInput.placeholder = 'Enter discount code';
    this.discountInput.classList.add('basket__discount-input');
    this.applyDiscountButton = new SimpleComponent<HTMLButtonElement>(
      'button',
      ['basket__apply-discount'],
      'Apply'
    ).getElement();
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
        const basketProductBox = new BasketProductBox(product).getElement();
        productsContainer.append(basketProductBox);
      });

      // end products list-------------------------------------------------------------------------------------------------

      const totalContainer = document.createElement('div');
      totalContainer.classList.add('basket__total-container');

      const titleTotal = new SimpleComponent<HTMLParagraphElement>('p', ['basket__total'], 'Total:').getElement();
      const titlePrice = new SimpleComponent<HTMLParagraphElement>(
        'p',
        ['basket__price'],
        `${(this.cart.totalPrice.centAmount / 100).toFixed(2)} $`
      ).getElement();

      totalContainer.append(titleTotal, titlePrice);

      // Add discount code input and button
      const discountContainer = document.createElement('div');
      discountContainer.classList.add('basket__discount-container');
      discountContainer.append(this.discountInput, this.applyDiscountButton);

      basketContainer.append(basketHeader, productsContainer, totalContainer, discountContainer);
    }

    linkToMain.addEventListener('click', () => {
      this.router.navigate(Pages.PRODUCT);
    });

    this.applyDiscountButton.addEventListener('click', this.applyDiscountCode.bind(this));

    return basketPage;
  }

  private async applyDiscountCode() {
    const discountCode = this.discountInput.value;
    if (!discountCode) {
      handleSucsess('Please enter a discount code.');
      return;
    }

    try {
      await addDiscountCodeToCart(this.cart, discountCode);
      handleSucsess('Discount code applied successfully!');
    } catch (error) {
      console.error('Caught error:', error);
      const customError = error as CustomError;
      const errorMessage = customError.body?.message || 'Error applying discount code';
      console.error('Error message:', errorMessage);
      handleError(customError, errorMessage);
    } finally {
      hideLoading();
    }
  }

  getElement() {
    return this.element;
  }
}
