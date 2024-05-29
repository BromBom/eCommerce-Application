import { ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../../../layout/layout';
import { ICard } from '../../../../data/cards';
import { queryProduct } from '../../../../../api/project';

export default class ProductDetail extends Layout {
  card: ICard = { id: '', name: '', image: '', description: '', price: 0, stock: 0 };

  constructor(id: string) {
    const params = {
      tag: 'article' as keyof HTMLElementTagNameMap,
      classNames: ['product-detail'],
    };
    super(params);

    console.log('ProductDetail component initialized with ID:', id);

    ProductDetail.getProductById(id)
      .then((product) => {
        const price = product.masterVariant.prices?.[0]?.value.centAmount;
        const image = product.masterVariant.images?.[0]?.url;

        this.card = {
          id: product.id,
          name: product.name['en-US'] || 'No name',
          image: image ?? 'default-image-url.jpg',
          description: product.description?.['en-US'] || 'No description',
          price: price ? price / 100 : 0,
          stock: product.masterVariant.prices?.[0]?.value.centAmount || 0,
        };

        this.configureView();
      })
      .catch((error) => {
        console.error('Failed to get product information:', error);
      });
  }

  static async getProductById(id: string): Promise<ProductProjection> {
    try {
      const response = await queryProduct(id);
      if (response.body.results.length === 0) {
        throw new Error('Product not found');
      }
      console.log('Product found:', response.body.results[0]);
      return response.body.results[0];
    } catch (error) {
      console.error('Failed to get product information:', error);
      throw new Error('Failed to get product information');
    }
  }

  configureView() {
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

    this.viewElementCreator.addInnerElement(nameElement);
    this.viewElementCreator.addInnerElement(imageElement);
    this.viewElementCreator.addInnerElement(descriptionElement);
    this.viewElementCreator.addInnerElement(priceElement);
    this.viewElementCreator.addInnerElement(stockElement);
  }
}
