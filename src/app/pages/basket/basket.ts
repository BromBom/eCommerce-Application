import { Cart, Customer } from '@commercetools/platform-sdk';
import SimpleComponent from '../../components/simpleComponent';
import BasketProductBox from './basketProductBox/basketProductBox';
import Router from '../../router/router';
import { Pages } from '../../router/pages';
import { CustomError } from '../../types/types';
import Button from '../../components/controls/button';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../utils/showmessage';
import {
  getCartByID,
  createCustomerCart,
  createAnonymousCart,
  removeProductFromCart,
  removeCart,
  changeQuantityProductsInCart,
  addDiscountCodeToCart,
} from '../../../api/cart';

import './basket.scss';

export default class PersonalData {
  element: HTMLDivElement;

  promoInput: SimpleComponent<HTMLInputElement>;

  promoButton: SimpleComponent<HTMLButtonElement>;

  titleBasketEmpty: SimpleComponent<HTMLHeadingElement>;

  linkToMain: SimpleComponent<HTMLHeadingElement>;

  linkClear: SimpleComponent<HTMLParagraphElement>;

  titlePrice: SimpleComponent<HTMLParagraphElement>;

  constructor(
    public router: Router,
    public cart: Cart
  ) {
    this.promoInput = new SimpleComponent<HTMLInputElement>('input', ['basket__promo-input']);
    this.promoButton = Button(['basket__promo-button'], 'Accept');
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

      const promoBox = document.createElement('div');
      promoBox.classList.add('basket__promo-box');
      const promoInput = this.promoInput.getElement();
      promoInput.setAttribute('placeholder', 'Enter promocode');
      const promoButton = this.promoButton.getElement();
      promoButton.addEventListener('click', this.applyDiscountCode.bind(this));
      promoBox.append(promoInput, promoButton);

      const linkClear = this.linkClear.getElement();

      productsCounter.append(countProducts, itemsSpan);
      titleBox.append(titleBasketWithProducts, productsCounter);
      basketHeader.append(titleBox, promoBox, linkClear);

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
            if (newCart.totalPrice.centAmount === 0) {
              basketContainer.innerHTML = '';
              basketContainer.append(titleBasketEmpty, linkToMain);

              linkToMain.addEventListener('click', () => {
                this.router.navigate(Pages.PRODUCT);
              });
            }

            hideLoading();
            handleSucsess('Removing product from the cart was successful!');
          } catch (error) {
            console.log(`Failed to delete product: ${error}`);
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
              handleError(new Error('Wrong quantity!'), `Wrong quantity! From 1 to 30 pcs`);
            } else {
              const newCart = await changeQuantityProductsInCart(cart, product.id, inputValue);

              basketProductBox.inputCounter.getElement().value = `${inputValue}`;
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
            console.log(`Failed to change quantity: ${error}`);
            handleError(new Error('Failed to change quantity'), `Failed to change quantity! ${error}`);
          }
        });

        basketProductBox.buttonMines.getElement().addEventListener('click', async () => {
          const quantity = +basketProductBox.inputCounter.getElement().value - 1;
          if (quantity < 1) return;
          try {
            showLoading();
            const cartID = localStorage.getItem('CurrentCartId');
            const cart = await getCartByID(cartID!);
            const newCart = await changeQuantityProductsInCart(cart, product.id, quantity);

            basketProductBox.inputCounter.getElement().value = `${quantity}`;
            const currentPrice = (
              ((product.price.discounted?.value.centAmount || product.price.value.centAmount) * quantity) /
              100
            ).toFixed(2);
            basketProductBox.priceLineItem.getElement().textContent = `${currentPrice} $`;
            this.titlePrice.getElement().textContent = `${(newCart.totalPrice.centAmount / 100).toFixed(2)} $`;

            hideLoading();
            handleSucsess('Changing quantity was successful!');
          } catch (error) {
            console.log(`Failed to change quantity: ${error}`);
            handleError(new Error('Failed to change quantity'), `Failed to change quantity! ${error}`);
          }
        });

        basketProductBox.buttonPlus.getElement().addEventListener('click', async () => {
          const quantity = +basketProductBox.inputCounter.getElement().value + 1;
          if (quantity > 30) return;
          try {
            showLoading();
            const cartID = localStorage.getItem('CurrentCartId');
            const cart = await getCartByID(cartID!);
            const newCart = await changeQuantityProductsInCart(cart, product.id, quantity);

            basketProductBox.inputCounter.getElement().value = `${quantity}`;
            const currentPrice = (
              ((product.price.discounted?.value.centAmount || product.price.value.centAmount) * quantity) /
              100
            ).toFixed(2);
            basketProductBox.priceLineItem.getElement().textContent = `${currentPrice} $`;
            this.titlePrice.getElement().textContent = `${(newCart.totalPrice.centAmount / 100).toFixed(2)} $`;

            hideLoading();
            handleSucsess('Changing quantity was successful!');
          } catch (error) {
            console.log(`Failed to change quantity: ${error}`);
            handleError(new Error('Failed to change quantity'), `Failed to change quantity! ${error}`);
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
          console.log(`Failed to delete product: ${error}`);
          handleError(
            new Error('Failed to delete product from the cart'),
            `Failed to delete product from the cart! ${error}`
          );
        }
      });
    }

    return basketPage;
  }

  private updateTotalPrice() {
    this.titlePrice.getElement().textContent = `${(this.cart.totalPrice.centAmount / 100).toFixed(2)} $`;
  }

  private async applyDiscountCode() {
    const discountCode = this.promoInput.getElement().value;
    if (!discountCode) {
      handleSucsess('Please enter a discount code.');
      return;
    }

    try {
      showLoading();
      const updatedCart = await addDiscountCodeToCart(this.cart, discountCode);
      this.cart! = updatedCart!;
      // this.updateTotalPrice(updatedCart!);
      handleSucsess('Discount code applied successfully!');

      this.promoButton.getElement().textContent = 'Your promocode applied';
      this.promoInput.getElement().value = '';

      this.promoButton.getElement().disabled = true;
      this.promoInput.getElement().disabled = true;

      this.updateTotalPrice();
    } catch (error) {
      console.log('Caught error:', error);
      const customError = error as CustomError;
      const errorMessage = customError.body?.message || 'Error applying discount code';
      console.log('Error message:', errorMessage);
      handleError(customError, errorMessage);
    } finally {
      hideLoading();
    }
  }

  getElement() {
    return this.element;
  }
}
