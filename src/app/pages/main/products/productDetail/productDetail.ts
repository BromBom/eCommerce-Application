import { ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../../../layout/layout';
import { ICard } from '../../../../data/cards';
import { searchProductbyID } from '../../../../../api/project';

export default class ProductDetail extends Layout {
  product: ProductProjection | null;

  card: ICard | null;

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
    this.card = null;
    this.init();
  }

  async init() {
    try {
      this.product = await ProductDetail.getProductById(this.id);
      this.price = this.product!.masterVariant!.prices![0].value.centAmount;
      this.image = this.product!.masterVariant!.images![0].url;

      this.card = {
        id: this.product.id,
        name: this.product.name['en-US'] || 'No name',
        image: this.image ?? 'default-image-url.jpg',
        description: this.product.description?.['en-US'] || 'No description',
        price: this.price / 100,
        stock: this.product.masterVariant.prices?.[0]?.value.centAmount || 0,
      };

      this.configureView();
    } catch (error) {
      console.error('Failed to initialize ProductDetail:', error);
    }
  }

  static async getProductById(id: string) {
    let productbyId;
    try {
      const response = await searchProductbyID(id);
      if (response.body.results.length === 0) {
        throw new Error('Product not found');
      }
      [productbyId] = response.body.results;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to get product information');
    }
    return productbyId;
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

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = this.card.description;

    const priceElement = document.createElement('p');
    priceElement.textContent = `Price: $${this.card.price}`;

    const stockElement = document.createElement('p');
    stockElement.textContent = `In stock: ${this.card.stock}`;

    containerCardDetail.append(nameElement, imageElement, descriptionElement, priceElement, stockElement);
    this.element = containerCardDetail;
  }

  getElement() {
    if (!this.element) {
      console.error('Element is not initialized yet');
    }
    return this.element;
  }
}
