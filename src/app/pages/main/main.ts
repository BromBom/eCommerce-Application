import { ClientResponse, ProductProjectionPagedSearchResponse, ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../layout/layout';
import { queryProduct } from '../../../api/project';
import { hideLoading, showLoading, handleError } from '../../utils/showmessage';
import Products from './products/products';
import Router from '../../router/router';

import './main.scss';

export default class Main extends Layout {
  products: Products;

  constructor(router: Router, products: Products) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['main'],
    };
    super(params);
    this.products = products;
  }

  setContent(content: Layout) {
    const htmlElement = this.getHtmlElement();

    while (htmlElement?.firstElementChild) {
      htmlElement.firstElementChild.remove();
    }

    this.viewElementCreator.addInnerElement(content.getHtmlElement());
  }

  async renderProducts(categoryId: string) {
    try {
      showLoading();

      const response: ClientResponse<ProductProjectionPagedSearchResponse> = await queryProduct(categoryId);

      const products: ProductProjection[] = response.body.results;

      const htmlElement = this.getHtmlElement();
      if (htmlElement) {
        htmlElement.innerHTML = '';
      }

      products.forEach((product: ProductProjection) => {
        const productElement = document.createElement('div');
        productElement.textContent = product.name['en-US'] || 'No name';

        if (htmlElement) {
          htmlElement.appendChild(productElement);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, 'Failed to load products.');
      }
    } finally {
      hideLoading();
    }
  }
}
