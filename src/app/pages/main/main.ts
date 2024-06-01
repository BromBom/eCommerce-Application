import { ClientResponse, ProductProjectionPagedSearchResponse, ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../layout/layout';
import { queryProduct, sortProductClothing, sortProductShoes, sortProductAccessories } from '../../../api/project';
import { hideLoading, showLoading, handleError } from '../../utils/showmessage';
import Products from './products/products';
import Router from '../../router/router';

import './main.scss';

export default class Main extends Layout {
  products: Products;

  constructor(router: Router) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['main'],
    };
    super(params);
    this.products = new Products(router);
    this.createSortButtons();
  }

  createSortButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'sort-buttons-section';

    const buttons = [
      { name: 'Clothing', handler: sortProductClothing, id: '8da9d730-fdd3-4313-8814-20cd01dc7efd' },
      { name: 'Shoes', handler: sortProductShoes, id: '292321b7-b3d4-42d5-b150-b1fecde7d470' },
      { name: 'Accessories', handler: sortProductAccessories, id: '8cf8b1ac-7dfd-4405-9318-1582a38b6b26' },
    ];

    buttons.forEach((button) => {
      const btn = document.createElement('button');
      btn.className = 'sort-button';
      btn.textContent = button.name;
      btn.addEventListener('click', async () => {
        await this.products.renderProducts(button.id);
      });
      buttonContainer.appendChild(btn);
    });

    const mainElement = this.getHtmlElement();
    mainElement.appendChild(buttonContainer);
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

  static addFilterEventListeners() {
    const filtersContainer = document.querySelector('.sidebar') as HTMLElement | null;
    if (filtersContainer) {
      filtersContainer.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.type === 'checkbox') {
          // методы применения фильтров к товарам или другие соответствующие действия
        }
      });
    } else {
      console.error('Sidebar container not found');
    }
  }
}
