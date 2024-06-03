import { ClientResponse, ProductProjectionPagedSearchResponse, ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../layout/layout';
import {
  queryProduct,
  sortProductClothing,
  sortProductShoes,
  sortProductAccessories,
  sortProductbyASC,
} from '../../../api/project';
import { hideLoading, showLoading, handleError } from '../../utils/showmessage';
import Products from '../../pages/main/products/products';
import Router from '../../router/router';

import './navbar.scss';

interface FilterCriteria {
  sizes: string[];
  priceRange: [number, number];
  types: string[];
  genders: string[];
  colors: string[];
  discount: boolean;
}

export default class Navbar extends Layout {
  filters: FilterCriteria;

  router: Router;

  constructor(router: Router) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['navbar'],
    };
    super(params);
    this.router = router;
    this.filters = {
      sizes: [],
      priceRange: [0, 1000],
      types: [],
      genders: [],
      colors: [],
      discount: false,
    };
    this.createSortButtons();

    const htmlElement = this.getHtmlElement();
    if (htmlElement) {
      Navbar.createSidebar(htmlElement);
      this.addFilterEventListeners();
    } else {
      console.error('HTML element for Navbar not found');
    }
  }

  createSortButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'sort-buttons';

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
        await this.renderProducts(button.id);
      });
      buttonContainer.appendChild(btn);
    });

    const htmlElement = document.querySelector('.sidebar-container') as HTMLElement | null;
    if (htmlElement) {
      htmlElement.appendChild(buttonContainer);
    } else {
      console.error('HTML element with class "index" not found');
    }
  }

  async renderProducts(categoryId: string) {
    try {
      showLoading();

      const response: ClientResponse<ProductProjectionPagedSearchResponse> = await queryProduct(categoryId);

      const products: ProductProjection[] = response.body.results;

      const htmlElement = this.viewElementCreator.getElement();
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

  setContent(content: Layout) {
    const htmlElement = this.viewElementCreator.getElement();

    while (htmlElement?.firstElementChild) {
      htmlElement.firstElementChild.remove();
    }

    this.viewElementCreator.addInnerElement(content.getHtmlElement());
  }

  static createSidebar(container: HTMLElement) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    sidebar.innerHTML = `
    <aside class="sidebar">
  <div class="sidebar-container">
    <div class="filter-category">
      <h3>Price (low-high)</h3>
      <div class="checkbox">
        <input type="checkbox" id="asc" name="sort-asc">
        <label for="sort-asc">Cheap ones first</label>
      </div>
    </div>
    <div class="filter-category">
      <h3>Size</h3>
      <div class="checkbox">
        <input type="checkbox" id="size-small" name="size-small">
        <label for="size-small">Small</label>
      </div>
      <div class="checkbox">
        <input type="checkbox" id="size-medium" name="size-medium">
        <label for="size-medium">Medium</label>
      </div>
      <div class="checkbox">
        <input type="checkbox" id="size-large" name="size-large">
        <label for="size-large">Large</label>
      </div>
    </div>
    <div class="filter-category">
      <h3>Price</h3>
      <input type="range" id="price-range" name="price-range" min="0" max="1000">
    </div>
    <div class="filter-category">
      <h3>Type of clothing</h3>
      <div class="checkbox">
        <input type="checkbox" id="type-clothing" name="type-clothing">
        <label for="type-clothing">Jersey</label>
      </div>
      <div class="checkbox">
        <input type="checkbox" id="type-shoes" name="type-shoes">
        <label for="type-shoes">Shirt</label>
      </div>
      <div class="checkbox">
        <input type="checkbox" id="type-accessories" name="type-accessories">
        <label for="type-accessories">Shorts</label>
      </div>
    </div>
    <div class="filter-category">
      <h3>Gender</h3>
      <div class="checkbox">
        <input type="checkbox" id="gender-male" name="gender-male">
        <label for="gender-male">Male</label>
      </div>
      <div class="checkbox">
        <input type="checkbox" id="gender-female" name="gender-female">
        <label for="gender-female">Female</label>
      </div>
    </div>
    <div class="filter-category">
      <h3>Color</h3>
      <div class="color-box" style="background: #29292D;"></div>
      <div class="color-box" style="background: #A13FBA;"></div>
      <div class="color-box" style="background: #FF1818;"></div>
    </div>
    <div class="filter-category">
      <h3>Discount</h3>
      <div class="checkbox">
        <input type="checkbox" id="discount" name="discount">
        <label for="discount">Discount</label>
      </div>
    </div>
  </div>
</aside>
    `;

    container.appendChild(sidebar);
  }

  addFilterEventListeners() {
    const filtersContainer = document.querySelector('.sidebar') as HTMLElement | null;
    if (filtersContainer) {
      filtersContainer.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (target.type === 'checkbox' && target.id === 'asc') {
          this.handleSortByPriceAsc(target.checked);
        }
      });
    } else {
      console.error('Sidebar container not found');
    }
  }

  async handleSortByPriceAsc(checked: boolean) {
    if (checked) {
      try {
        const response = await sortProductbyASC();
        const products = response.body.results;
        this.updateProductList(products);
      } catch (error) {
        console.error('Failed to sort products by price:', error);
      }
    }
  }

  updateProductList(products: ProductProjection[]) {
    const mainContent = document.querySelector('.main');
    if (mainContent) {
      mainContent.innerHTML = '';
      products.forEach((product: ProductProjection) => {
        const productElement = document.createElement('div');
        productElement.textContent = product.name['en-US'] || 'No name';
        mainContent.appendChild(productElement);
      });

      const productsComponent = new Products(this.router);
      productsComponent.updateProducts(products);
    }
  }
}
