import { ClientResponse, ProductProjectionPagedSearchResponse, ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../layout/layout';
import {
  queryProduct,
  sortProductbyASC,
  filterProductListColor,
  filterProductListSize,
  filterProductSpec,
} from '../../../api/project';
import { hideLoading, showLoading, handleError } from '../../utils/showmessage';
import Products from '../../pages/main/products/products';
import Router from '../../router/router';

import './navbar.scss';

interface FilterCriteria {
  sizeFilters: string;
  priceRange: [number, number];
  spec: string;
  genders: string[];
  colors: string[];
  currentColor: string;
  currentIdTypes: string;
  discount: boolean;
}

export default class Navbar extends Layout {
  filters: FilterCriteria;

  router: Router;

  products: Products;

  constructor(router: Router, products: Products) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['navbar'],
    };
    super(params);
    this.router = router;
    this.products = products;
    this.filters = {
      sizeFilters: '',
      priceRange: [0, 1000],
      spec: '',
      genders: [],
      colors: [],
      currentColor: '',
      currentIdTypes: '',
      discount: false,
    };

    const htmlElement = this.getHtmlElement();
    if (htmlElement) {
      Navbar.createSidebar(htmlElement);
      this.addFilterEventListeners();
    }
  }

  async renderProducts(categoryId: string) {
    try {
      showLoading();

      const response: ClientResponse<ProductProjectionPagedSearchResponse> = await queryProduct(categoryId);
      const products: ProductProjection[] = response.body.results;

      this.products.updateProducts(products);
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
            <input type="checkbox" id="jersey" name="jersey">
            <label for="jersey">Jersey</label>
          </div>
          <div class="checkbox">
            <input type="checkbox" id="jacket" name="jacket">
            <label for="jacket">Jacket</label>
          </div>
          <div class="checkbox">
            <input type="checkbox" id="shorts" name="shorts">
            <label for="shorts">Shorts</label>
          </div>
          <div class="checkbox">
            <input type="checkbox" id="hoodie" name="hoodie">
            <label for="hoodie">Hoodie</label>
          </div>
          <div class="checkbox">
            <input type="checkbox" id="pants" name="pants">
            <label for="pants">Pants</label>
          </div>
          <div class="checkbox">
            <input type="checkbox" id="socks" name="socks">
            <label for="socks">Socks</label>
          </div>
          <div class="checkbox">
            <input type="checkbox" id="shoes" name="shoes">
            <label for="shoes">Shoes</label>
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
          <div class="color-box" style="background: black;" data-color="Black"></div>
          <div class="color-box" style="background: white;" data-color="White"></div>
          <div class="color-box" style="background: grey;" data-color="Grey"></div>
          <div class="color-box" style="background: blue;" data-color="Blue"></div>
          <div class="color-box" style="background: purple;" data-color="Purple"></div>
          <div class="color-box" style="background: pink;" data-color="Pink"></div>
          <div class="color-box" style="background: green;" data-color="Green"></div>
          <div class="color-box" style="background: yellow;" data-color="Yellow"></div>
        </div>
        <div class="filter-category">
          <h3>Discount</h3>
          <div class="checkbox">
            <input type="checkbox" id="discount" name="discount">
            <label for="discount">Discount</label>
          </div>
        </div>
        <button id="submit-filters" class="filter-button">Apply filters</button>
      </div>
    </aside>
    `;

    container.appendChild(sidebar);
  }

  addFilterEventListeners() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          const filtersContainer = document.querySelector('.sidebar') as HTMLElement | null;

          if (filtersContainer) {
            filtersContainer.addEventListener('change', (event) => {
              const target = event.target as HTMLInputElement;
              if (target.type === 'checkbox' && target.id === 'asc') {
                this.handleSortByPriceAsc(target.checked);
              }
            });

            const submitButton = document.getElementById('submit-filters') as HTMLButtonElement;
            if (submitButton) {
              submitButton.addEventListener('click', () => this.applyFilters());
            }

            const colorBoxes = document.querySelectorAll('.color-box');
            colorBoxes.forEach((box) => {
              box.addEventListener('click', () => {
                box.classList.toggle('selected');
                this.filters.currentColor = (box as HTMLDivElement).dataset.color!;
              });
            });

            observer.disconnect();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  async handleSortByPriceAsc(checked: boolean) {
    if (checked) {
      try {
        showLoading();
        const response = await sortProductbyASC();
        const products = response.body.results;
        this.products.updateProducts(products);
      } catch (error) {
        if (error instanceof Error) {
          handleError(error, 'Failed to sort products by price');
        }
      } finally {
        hideLoading();
      }
    }
  }

  applyFilters() {
    const { spec } = this.filters;
    const genders: string[] = [];
    const colors: string[] = [];
    const { sizeFilters } = this.filters;
    const { currentColor } = this.filters;
    const { currentIdTypes } = this.filters;
    let discount = false;

    const sizeSmall = document.getElementById('size-small') as HTMLInputElement;
    const sizeMedium = document.getElementById('size-medium') as HTMLInputElement;
    const sizeLarge = document.getElementById('size-large') as HTMLInputElement;
    if (sizeSmall.checked) {
      this.filters.sizeFilters = 'S';
    } else if (sizeMedium.checked) {
      this.filters.sizeFilters = 'M';
    } else if (sizeLarge.checked) {
      this.filters.sizeFilters = 'L';
    }

    const typeJersey = document.getElementById('jersey') as HTMLInputElement;
    const typeJacket = document.getElementById('jacket') as HTMLInputElement;
    const typeShorts = document.getElementById('shorts') as HTMLInputElement;
    const typeHoodie = document.getElementById('hoodie') as HTMLInputElement;
    const typePants = document.getElementById('pants') as HTMLInputElement;
    const typeSocks = document.getElementById('socks') as HTMLInputElement;
    const typeShoes = document.getElementById('shoes') as HTMLInputElement;

    if (typeJersey.checked) {
      this.filters.spec = 'Jersey';
    }
    if (typeJacket.checked) {
      this.filters.spec = 'Jacket';
    }
    if (typeShorts.checked) {
      this.filters.spec = 'Shorts';
    }
    if (typeHoodie.checked) {
      this.filters.spec = 'Hoodie';
    }
    if (typePants.checked) {
      this.filters.spec = 'Pants';
    }
    if (typeSocks.checked) {
      this.filters.spec = 'Socks';
    }
    if (typeShoes.checked) {
      this.filters.spec = 'Shoes';
    }

    const genderMale = document.getElementById('gender-male') as HTMLInputElement;
    const genderFemale = document.getElementById('gender-female') as HTMLInputElement;
    if (genderMale.checked) genders.push('Male');
    if (genderFemale.checked) genders.push('Female');

    const selectedColors: string[] = [];
    const colorBoxes = document.querySelectorAll('.color-box');
    colorBoxes.forEach((box) => {
      if (box.classList.contains('selected')) {
        const bgColor = getComputedStyle(box).backgroundColor;
        selectedColors.push(bgColor);
      }
    });

    const discountCheckbox = document.getElementById('discount') as HTMLInputElement;
    discount = discountCheckbox.checked;

    this.filters = {
      sizeFilters,
      priceRange: [0, (document.getElementById('price-range') as HTMLInputElement).valueAsNumber],
      spec,
      genders,
      colors,
      currentColor,
      currentIdTypes,
      discount,
    };
    this.fetchFilteredProducts();
  }

  async fetchFilteredProducts() {
    try {
      showLoading();

      const sizeResponse: ClientResponse<ProductProjectionPagedSearchResponse> = await filterProductListSize(
        this.filters.sizeFilters
      );
      const sizeProducts: ProductProjection[] = sizeResponse.body.results;

      const specResponse: ClientResponse<ProductProjectionPagedSearchResponse> = await filterProductSpec(
        this.filters.spec
      );
      const specProducts: ProductProjection[] = specResponse.body.results;

      const colorResponse: ClientResponse<ProductProjectionPagedSearchResponse> = await filterProductListColor(
        this.filters.currentColor
      );
      const colorProducts: ProductProjection[] = colorResponse.body.results;

      const filteredProducts = Navbar.combineFilteredResults(colorProducts, sizeProducts, specProducts);

      const finalFilteredProducts = this.applyOtherFilters(filteredProducts);

      this.products.updateProducts(finalFilteredProducts);
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, 'Failed to load products.');
      }
    } finally {
      hideLoading();
    }
  }

  static combineFilteredResults(
    colorProducts: ProductProjection[],
    sizeProducts: ProductProjection[],
    specProducts: ProductProjection[]
  ): ProductProjection[] {
    const combinedSet = new Set([...colorProducts, ...sizeProducts, ...specProducts]);
    return Array.from(combinedSet);
  }

  private applyOtherFilters(products: ProductProjection[]): ProductProjection[] {
    return products.filter((product) => {
      const attributes = product.masterVariant.attributes as { name: string; value: string }[];
      const sizeAttribute = attributes.find((attr) => attr.name === 'size');
      const genderAttribute = attributes.find((attr) => attr.name === 'gender');
      const colorAttribute = attributes.find((attr) => attr.name === 'color');
      const discountedAttribute = attributes.find((attr) => attr.name === 'discounted');

      const matchesSizes = this.filters.sizeFilters.length
        ? sizeAttribute && this.filters.sizeFilters.includes(sizeAttribute.value)
        : true;
      const matchesGenders = this.filters.genders.length
        ? genderAttribute && this.filters.genders.includes(genderAttribute.value)
        : true;
      const matchesColors = this.filters.colors.length
        ? colorAttribute && this.filters.colors.includes(colorAttribute.value)
        : true;
      const matchesDiscount = this.filters.discount
        ? discountedAttribute && discountedAttribute.value === 'true'
        : true;
      const matchesPrice =
        product.masterVariant?.prices?.some(
          (price) =>
            price.value.centAmount >= this.filters.priceRange[0] * 100 &&
            price.value.centAmount <= this.filters.priceRange[1] * 100
        ) ?? false;

      return matchesSizes && matchesGenders && matchesColors && matchesDiscount && matchesPrice;
    });
  }
}
