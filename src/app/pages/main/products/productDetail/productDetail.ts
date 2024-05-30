import { ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../../../layout/layout';
import { ICard } from '../../../../data/cards';
import { queryProduct } from '../../../../../api/project';

export default class ProductDetail extends Layout {
  product: ProductProjection | null;

  card: ICard;

  element: HTMLDivElement | null;

  price: number | null;

  image: string | null;

  constructor(public id: string) {
    const params = {
      tag: 'article' as keyof HTMLElementTagNameMap,
      classNames: ['product-detail'],
    };
    super(params);
    this.element = null;
    this.product = null;
    this.price = null;
    this.image = null;
    this.init();
    console.log('555555 ProductDetail - init');
    this.card = {
      id: this.product!.id,
      name: this.product!.name['en-US'] || 'No name',
      image: this.image ?? 'default-image-url.jpg',
      description: this.product!.description?.['en-US'] || 'No description',
      price: this.price ? this.price / 100 : 0,
      stock: this.product!.masterVariant.prices?.[0]?.value.centAmount || 0,
    };

    this.configureView();
  }

  async init() {
    this.product = await ProductDetail.getProductById(this.id);
    this.price = this.product!.masterVariant!.prices![0].value.centAmount;
    this.image = this.product!.masterVariant!.images![0].url;
    console.log('6666 ProductDetail - init');
  }

  static async getProductById(id: string) {
    let productbyId;
    try {
      const response = await queryProduct(id);
      if (response.body.results.length === 0) {
        throw new Error('Product not found');
      }
      [productbyId] = response.body.results;
      console.log('Product found:', response.body.results[0]);
    } catch (error) {
      console.log('information:', error);
      throw new Error('Failed to get product information');
    }
    return productbyId;
  }

  configureView() {
    const containerCardDetail = document.createElement('div');
    containerCardDetail.classList.add('cardDetailPage');
    const nameElement = document.createElement('h1');
    nameElement.textContent = this.card.name;

    const imageElement = document.createElement('img');
    imageElement.src = this.card.image;
    imageElement.alt = this.card.name;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = this.card.description;

    const priceElement = document.createElement('p');
    priceElement.textContent = `Price: $${this.card.price}`;

    const stockElement = document.createElement('p');
    stockElement.textContent = `In stock: ${this.card.stock}`;

    containerCardDetail.append(nameElement, imageElement, descriptionElement, priceElement, stockElement);
    // this.viewElementCreator.addInnerElement(containerCardDetail);
    this.element = containerCardDetail;

    console.log('77777 ProductDetail - configureView - this.elem');
  }

  getElement() {
    return this.element;
  }
}
