import { ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../../layout/layout';
import { queryProduct } from '../../../../api/project';
import { addToCart } from '../../../utils/localstorage';
import Rating from '../../../components/rating';
import { CartItem } from '../../../types/types';
import Router from '../../../router/router';

const TEXT = 'PRODUCTS PAGE';

export default class Products extends Layout {
  router: Router;
  id: string;

  constructor(router: Router, id = '') {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['index'],
    };
    super(params);
    this.router = router;
    this.configureView();
    this.renderProducts();
    this.id = id;
    this.addEventListeners(id);
  }

  configureView() {
    this.setTextContent(TEXT);
  }

  async renderProducts() {
    try {
      const response = await queryProduct();
      const products: ProductProjection[] = response.body.results;
      this.updateProducts(products);
    } catch (error) {
      console.error(error);
      this.setHTMLContent('<div class="error">Failed to load products</div>');
    }
  }

  async searchProducts(query: string) {
    try {
      const response = await queryProduct(query);
      const products: ProductProjection[] = response.body.results;
      this.updateProducts(products);
    } catch (error) {
      console.error(error);
      this.setHTMLContent('<div class="error">Failed to load products</div>');
    }
  }

  updateProducts(products: ProductProjection[]) {
    const productElements = products
      .map((product: ProductProjection) => {
        const imageUrl =
          product.masterVariant.images && product.masterVariant.images.length > 0
            ? product.masterVariant.images[0].url
            : 'default-image-url.jpg';

        const productName = product.name['en-US'] || 'No name';

        const ratingAttribute = product.masterVariant.attributes?.find((attr) => attr.name === 'rating');
        const rating = ratingAttribute ? ratingAttribute.value : '0';

        const numReviewsAttribute = product.masterVariant.attributes?.find((attr) => attr.name === 'numReviews');
        const numReviews = numReviewsAttribute ? numReviewsAttribute.value : '0';

        const price =
          product.masterVariant.prices && product.masterVariant.prices.length > 0
            ? (product.masterVariant.prices[0].value.centAmount / 100).toFixed(2)
            : '0.00';

        const description = product.description?.['en-US'] || 'No description';

        return `
          <li>
            <div class="product">
              <div class="product-container" data-cardid="${product.id}">
                <div class="product-link">
                  <img class="product-image" src="${imageUrl}" alt="${productName}" data-tilt>
                </div>
                <div class="product-name">
                  <p>${productName}</p>
                </div>
              </div>
              <div class="product-rating">
                ${Rating.render({ value: rating, text: `${numReviews} reviews` })}
              </div>
              <div class="product-buttons">
                <button class="buynow btn btn-primary" data-id="${product.id}" data-name="${productName}" data-price="${price}" data-image="${imageUrl}" data-description="${description}">Buy Now</button>
                <div class="product-price">
                  $${price}
                </div>
              </div>
            </div>
          </li>
        `;
      })
      .join('\n');

    this.setHTMLContent(`
      <ul class="products">
        ${productElements}
      </ul>
    `);

    this.addEventListeners(this.id);
  }

  addEventListeners(id: string) {
    const buyNowButtons = document.getElementsByClassName('buynow');
    Array.from(buyNowButtons).forEach((button) => {
      button.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLButtonElement;
        const productId = target.getAttribute('data-id');
        const productName = target.getAttribute('data-name');
        const productPrice = parseFloat(target.getAttribute('data-price') || '0');
        const productImage = target.getAttribute('data-image');
        const productDescription = target.getAttribute('data-description');

        if (productId && productName && productImage && productDescription) {
          const cartItem: CartItem = {
            product: productId,
            name: productName,
            image: productImage,
            price: productPrice,
            quantityInStock: 10,
            qty: 1,
            description: productDescription,
          };

          addToCart(cartItem, true);

          if (this.router) {
            const productUrl = `/product/${id}`;
            this.router.navigate(productUrl);
          }
        }
      });
    });
  }
}
