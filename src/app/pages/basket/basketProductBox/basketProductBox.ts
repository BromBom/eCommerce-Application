import { LineItem } from '@commercetools/platform-sdk';
import SimpleComponent from '../../../components/simpleComponent';

import './basketProductBox.scss';

export default class BasketProductBox {
  element: HTMLDivElement;

  deleteIcon: HTMLDivElement;

  image: string;

  name: string;

  price: string;

  quantity: number;

  constructor(public product: LineItem) {
    this.deleteIcon = document.createElement('div');
    this.image = product.variant.images![0].url;
    this.name = product.name['en-US'];
    this.price = `${(product.price.value.centAmount / 100).toFixed(2)} $`;
    this.quantity = product.quantity;
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

    const priceAllProducts = new SimpleComponent<HTMLParagraphElement>(
      'p',
      ['basket__product-box__price-all'],
      this.price
    ).getElement();
    const counterProducts = new SimpleComponent<HTMLInputElement>(
      'input',
      ['basket__product-box__counter'],
      '1'
    ).getElement();
    counterProducts.setAttribute('type', 'number');
    counterProducts.value = `${this.quantity}`;
    priceBox.append(priceAllProducts, counterProducts);

    const { deleteIcon } = this;
    deleteIcon.classList.add('basket__product-box__icon-delete');

    basketProductBox.append(deleteIcon, imgBox, infoBox, priceBox);

    return basketProductBox;
  }

  getElement() {
    return this.element;
  }
}
