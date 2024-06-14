import { Cart, Customer } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import BasketProductBox from './basketProductBox/basketProductBox';
import Router from '../../router/router';
import { Pages } from '../../router/pages';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../utils/showmessage';
import {
  getCartByID,
  createCustomerCart,
  createAnonymousCart,
  removeProductFromCart,
  removeCart,
  changeQuantityProductsInCart,
} from '../../../api/cart';

import './basket.scss';

export default class PersonalData {
  element: HTMLDivElement;

  titleBasketEmpty: SimpleComponent<HTMLHeadingElement>;

  linkToMain: SimpleComponent<HTMLHeadingElement>;

  linkClear: SimpleComponent<HTMLParagraphElement>;

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
    this.linkClear = new SimpleComponent<HTMLParagraphElement>('p', ['basket__link-clear'], 'Clear');
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

      linkToMain.addEventListener('click', () => {
        this.router.navigate(Pages.PRODUCT);
      });
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
      const itemsSpan = new SimpleComponent<HTMLSpanElement>('span', ['basket__span'], `line items`).getElement();
      const productsCounter = document.createElement('div');
      productsCounter.classList.add('basket__counter');

      const linkClear = this.linkClear.getElement();

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
            const newCart = await removeProductFromCart(cart, productInCart!.id);
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

        basketProductBox.inputCounter.getElement().addEventListener('change', async () => {
          try {
            showLoading();
            const cartID = localStorage.getItem('CurrentCartId');
            const cart = await getCartByID(cartID!);
            const currentLineItem = cart.lineItems.find((lineItem) => lineItem.id === product.id);

            const inputValue = parseInt(basketProductBox.inputCounter.getElement().value, 10);
            if (
              Number.isNaN(inputValue) ||
              inputValue < 1 ||
              inputValue > 30 ||
              inputValue === currentLineItem!.quantity
            ) {
              basketProductBox.inputCounter.getElement().value = `${currentLineItem!.quantity}`;
              hideLoading();
              handleSucsess('Wrong quantity! Must be less then 30 pcs');
            } else {
              basketProductBox.inputCounter.getElement().value = `${inputValue}`;
              const newCart = await changeQuantityProductsInCart(cart, product.id, inputValue);

              const currentPrice = (
                ((product.price.discounted?.value.centAmount || product.price.value.centAmount) * inputValue) /
                100
              ).toFixed(2);
              basketProductBox.priceLineItem.getElement().textContent = `${currentPrice} $`;
              this.titlePrice.getElement().textContent = `${(newCart.totalPrice.centAmount / 100).toFixed(2)} $`;

              hideLoading();
              handleSucsess('Changing quantity was successful!');
            }
          } catch (error) {
            console.error(`Failed to change quantity: ${error}`);
            handleError(new Error('Failed to change quantity'), `Failed to change quantity! ${error}`);
          }
        });

        // basketProductBox.buttonMines.getElement().addEventListener('click', async () => {
        //   if
        //   const inputValue = +basketProductBox.inputCounter.getElement().value;
        //   if (inputValue)
        //   basketProductBox.inputCounter.getElement().value = +basketProductBox.inputCounter.getElement().value - 1;
        //   const quality = +basketProductBox.inputCounter.getElement().value;
        //   try {
        //     showLoading();
        //     const cartID = localStorage.getItem('CurrentCartId');
        //     const cart = await getCartByID(cartID!);
        //     const newCart = await changeQuantityProductsInCart(cart, product.id, quality);

        //     hideLoading();
        //     handleSucsess('Changing quantity was successful!');
        //   } catch (error) {
        //     console.error(`Failed to change quantity: ${error}`);
        //     handleError(new Error('Failed to change quantity'), `Failed to change quantity! ${error}`);
        //   }
        // });
      });

      // end products list-------------------------------------------------------------------------------------------------

      const totalContainer = document.createElement('div');
      totalContainer.classList.add('basket__total-container');

      const titleTotal = new SimpleComponent<HTMLParagraphElement>('p', ['basket__total'], 'Total:').getElement();
      const titlePrice = this.titlePrice.getElement();

      totalContainer.append(titleTotal, titlePrice);

      basketContainer.append(basketHeader, productsContainer, totalContainer);

      linkClear.addEventListener('click', async () => {
        try {
          showLoading();
          const cartID = localStorage.getItem('CurrentCartId');
          const cart = await getCartByID(cartID!);
          await removeCart(cart);
          localStorage.removeItem('CurrentCartId');

          const customer = JSON.parse(localStorage.getItem('newCustomer')!) as Customer;
          let currentBasket: Cart;

          if (customer) {
            const customerID = customer.id;
            currentBasket = await createCustomerCart(customerID);
            localStorage.setItem('CurrentCartId', currentBasket.id);
          } else {
            currentBasket = await createAnonymousCart();
            localStorage.setItem('CurrentCartId', currentBasket.id);
          }

          basketContainer.innerHTML = '';
          basketContainer.append(titleBasketEmpty, linkToMain);

          linkToMain.addEventListener('click', () => {
            this.router.navigate(Pages.PRODUCT);
          });

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
    }

    return basketPage;
  }

  getElement() {
    return this.element;
  }
}
