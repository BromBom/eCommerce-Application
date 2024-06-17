import { ProductProjection, Cart } from '@commercetools/platform-sdk';
import Layout from '../../../../layout/layout';
import { ICard } from '../../../../data/cards';
import { searchProductbyID } from '../../../../../api/project';
import Modal from '../../../../components/modal/modal';
import Button from '../../../../components/controls/button';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../../../utils/showmessage';
import { getCartByID, addProductToCart, removeProductFromCart } from '../../../../../api/cart';

import './style.scss';

export default class ProductDetail extends Layout {
  product: ProductProjection | null;

  card: ICard | null;

  element: HTMLDivElement | null;

  price: number | null;

  discountedPrice: number | null;

  image: string | null;

  innerContent: HTMLElement | null;

  modal: Modal;

  constructor(
    public id: string,
    modal: Modal
  ) {
    const params = {
      tag: 'article' as keyof HTMLElementTagNameMap,
      classNames: ['product-detail'],
    };
    super(params);
    this.element = null;
    this.product = null;
    this.price = null;
    this.discountedPrice = null;
    this.image = null;
    this.card = null;
    this.innerContent = null;
    this.init();
    this.modal = modal;
  }

  async init() {
    try {
      this.product = await ProductDetail.getProductById(this.id);
      if (this.product) {
        this.price = this.product.masterVariant!.prices![0].value.centAmount;
        this.discountedPrice = this.product.masterVariant!.prices![0].discounted
          ? this.product.masterVariant!.prices![0].discounted!.value.centAmount
          : null;
        this.image = this.product.masterVariant!.images![0].url;

        this.card = {
          id: this.product.id,
          name: this.product.name['en-US'] || 'No name',
          image: this.image ?? 'default-image-url.jpg',
          description: this.product.description?.['en-US'] || 'No description',
          price: this.price / 100,
          discountedPrice: this.discountedPrice ? this.discountedPrice / 100 : null,
          stock: this.product.masterVariant.prices?.[0]?.value.centAmount || 0,
        };

        this.configureView();
      }
    } catch (error) {
      console.error('Failed to initialize ProductDetail:', error);
    }
  }

  static async getProductById(id: string) {
    let productById;
    try {
      const response = await searchProductbyID(id);
      if (response.body.results.length === 0) {
        throw new Error('Product not found');
      }
      [productById] = response.body.results;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to get product information');
    }
    return productById;
  }

  configureView() {
    if (!this.card) {
      console.error('No card data available');
      return;
    }

    const containerCardDetail = document.createElement('div');
    containerCardDetail.classList.add('cardDetailPage');

    const nameElement = document.createElement('h1');
    nameElement.textContent = this.card.name;

    const imageElement = document.createElement('img');
    imageElement.src = this.card.image;
    imageElement.alt = this.card.name;
    imageElement.classList.add('details-image');

    this.innerContent = imageElement;

    this.innerContent.addEventListener('click', () => {
      const modalImage = document.createElement('img');
      modalImage.src = this.card!.image;
      modalImage.alt = this.card!.name;
      const modal = this.modal.getHtmlElement();

      const modalContainer = modal.firstChild?.firstChild as HTMLElement;
      modalContainer.append(modalImage);
      Modal.openModal(this.modal.getHtmlElement());
    });

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = this.card.description;

    const priceElement = document.createElement('p');
    priceElement.classList.add('product-price');
    priceElement.textContent = `Price: $${this.card.price}`;

    const discountedPriceElement = document.createElement('p');
    if (this.card.discountedPrice !== null) {
      priceElement.classList.add('discounted');
      discountedPriceElement.classList.add('product-discount');
      discountedPriceElement.textContent = `Discounted Price: $${this.card.discountedPrice}`;
    }

    const stockElement = document.createElement('p');
    stockElement.textContent = `In stock: ${this.card.stock}`;

    const buttonsCart = this.creatContainerButtonsCart();

    containerCardDetail.append(nameElement, imageElement, buttonsCart, descriptionElement, priceElement);
    if (this.card.discountedPrice !== null) {
      containerCardDetail.appendChild(discountedPriceElement);
    }
    containerCardDetail.append(stockElement);
    this.element = containerCardDetail;
  }

  creatContainerButtonsCart() {
    const containerButtonsCart = document.createElement('div');
    containerButtonsCart.classList.add('detail__cart-buttons__container');

    const buttonInCart = Button(['detail__cart-buttons__btn-in'], 'Add to Cart').getElement();
    const buttonRemoveFromCart = Button(['detail__cart-buttons__btn-remove'], 'Remove from cart').getElement();

    containerButtonsCart.append(buttonInCart, buttonRemoveFromCart);

    const currentCart = JSON.parse(localStorage.getItem('CurrentCart')!) as Cart;

    const itemInCart = currentCart.lineItems.find((lineItem) => lineItem.productId === this.id);
    if (itemInCart) {
      buttonInCart.disabled = true;
      buttonRemoveFromCart.disabled = !buttonInCart.disabled;
    } else {
      buttonRemoveFromCart.disabled = true;
      buttonInCart.disabled = !buttonRemoveFromCart.disabled;
    }

    buttonInCart.addEventListener('click', async () => {
      buttonInCart.disabled = true;
      buttonRemoveFromCart.disabled = false;
      try {
        showLoading();
        const cartID = localStorage.getItem('CurrentCartId');
        const cart = await getCartByID(cartID!);
        const newCart = await addProductToCart(cart, this.id!);
        localStorage.setItem('CurrentCart', JSON.stringify(newCart));

        hideLoading();
        handleSucsess('Adding product to cart was successful!!');
      } catch (error) {
        console.error(`Failed to click button "buy now": ${error}`);
        handleError(new Error('Failed to click button "buy now"'), `Failed to click button "buy now"! ${error}`);
      }
    });

    buttonRemoveFromCart.addEventListener('click', async () => {
      buttonRemoveFromCart.disabled = true;
      buttonInCart.disabled = false;
      try {
        showLoading();
        const cartID = localStorage.getItem('CurrentCartId');
        const cart = await getCartByID(cartID!);
        const productInCart = cart.lineItems.find((lineItem) => lineItem.productId === this.id);
        const newCart = await removeProductFromCart(cart, productInCart!.id);
        localStorage.setItem('CurrentCart', JSON.stringify(newCart));

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

    return containerButtonsCart;
  }

  getElement() {
    if (!this.element) {
      console.error('Element is not initialized yet');
    }
    return this.element;
  }
}
