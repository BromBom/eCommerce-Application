import { LineItem } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../components/simpleComponent';
import Button from '../../../components/controls/button';

import './basketProductBox.scss';

export default class BasketProductBox {
  element: HTMLDivElement;

  deleteIcon: HTMLDivElement;

  image: string;

  name: string;

  price: string;

  discountedPrice: string;

  quantity: number;

  inputCounter: SimpleComponent<HTMLInputElement>;

  buttonMines: SimpleComponent<HTMLButtonElement>;

  buttonPlus: SimpleComponent<HTMLButtonElement>;

  priceLineItem: SimpleComponent<HTMLParagraphElement>;

  constructor(public product: LineItem) {
    this.deleteIcon = document.createElement('div');
    this.image = product.variant.images![0].url;
    this.name = product.name['en-US'];
    this.price = `${(product.price.value.centAmount / 100).toFixed(2)} $`;
    this.discountedPrice = product.price.discounted
      ? `${(product.price.discounted!.value.centAmount / 100).toFixed(2)} $`
      : '';
    this.quantity = product.quantity;
    this.inputCounter = new SimpleComponent<HTMLInputElement>('input', ['basket__product-box__counter'], '1');
    this.buttonMines = Button(['basket__product-box__product-counter-button'], '-');
    this.buttonPlus = Button(['basket__product-box__product-counter-button'], '+');
    this.priceLineItem = new SimpleComponent<HTMLParagraphElement>('p', ['basket__product-box__price-all']);
    this.element = this.init();
  }

  private init() {
    const basketProductBox = document.createElement('div');
    basketProductBox.classList.add('basket__product-box__root');

    const imgBox = document.createElement('div');
    imgBox.classList.add('basket__product-box__img-box');
    const infoBox = document.createElement('div');
    infoBox.classList.add('basket__product-box__info-box');
    const priceBox = document.createElement('div');
    priceBox.classList.add('basket__product-box__price-box');

    const imgProduct = document.createElement('img');
    imgProduct.classList.add('basket__product-box__img');
    imgProduct.setAttribute('src', this.image);
    imgProduct.setAttribute('alt', this.name);
    imgBox.append(imgProduct);

    const nameProduct = new SimpleComponent<HTMLHeadingElement>(
      'h3',
      ['basket__product-box__name'],
      this.name
    ).getElement();
    const priceProduct = new SimpleComponent<HTMLParagraphElement>(
      'p',
      ['basket__product-box__price-per-one'],
      this.price
    ).getElement();

    infoBox.append(nameProduct, priceProduct);

    if (this.discountedPrice) {
      const discountedPriceProduct = new SimpleComponent<HTMLParagraphElement>(
        'p',
        ['basket__product-box__price-per-one', 'basket__product-box__discounted-price'],
        this.discountedPrice
      ).getElement();
      infoBox.append(discountedPriceProduct);
      priceProduct.classList.add('cross');
    }

    const currentPrice = (
      ((this.product.price.discounted?.value.centAmount || this.product.price.value.centAmount) * this.quantity) /
      100
    ).toFixed(2);

    const priceAllProducts = this.priceLineItem.getElement();
    priceAllProducts.textContent = `${currentPrice} $`;

    const productsCounter = this.creatProductCounter();

    priceBox.append(priceAllProducts, productsCounter);

    const { deleteIcon } = this;
    deleteIcon.classList.add('basket__product-box__icon-delete');

    basketProductBox.append(deleteIcon, imgBox, infoBox, priceBox);

    return basketProductBox;
  }

  creatProductCounter() {
    const productsCounterBox = document.createElement('div');
    productsCounterBox.classList.add('basket__product-box__product-counter-box');

    const buttonMines = this.buttonMines.getElement();
    const buttonPlus = this.buttonPlus.getElement();
    const inputCounter = this.inputCounter.getElement();
    inputCounter.value = `${this.quantity}`;

    productsCounterBox.append(buttonMines, inputCounter, buttonPlus);

    return productsCounterBox;
  }

  getElement() {
    return this.element;
  }
}
