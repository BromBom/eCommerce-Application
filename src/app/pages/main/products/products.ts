import { ProductProjection } from '@commercetools/platform-sdk';
import Layout from '../../../layout/layout';
import { queryProduct } from '../../../../api/project';
import Rating from '../../../components/rating';

const TEXT = 'PRODUCTS PAGE';

export default class Products extends Layout {
  constructor() {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['index'],
    };
    super(params);
    this.configureView();
    this.renderProducts();
  }

  configureView() {
    this.setTextContent(TEXT);
  }

  async renderProducts() {
    try {
      const response = await queryProduct();
      const products: ProductProjection[] = response.body.results;

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

          return `
              <li>
                <div class="product">
                  <a href="/#/product/${product.id}">
                    <img class="product-image" src="${imageUrl}" alt="${productName}" data-tilt>
                  </a>
                  <div class="product-name">
                    <a href="/#/product/${product.id}">
                      ${productName}
                    </a>
                  </div>
                  <div class="product-rating">
                    ${Rating.render({ value: rating, text: `${numReviews} reviews` })}
                  </div>
                  <div class="product-buttons">
                    <a href="/#/product/${product.id}" class="buynow btn btn-primary" id="cartCheckout">Buy Now</a>
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
    } catch (error) {
      console.error(error);
      this.setHTMLContent('<div class="error">Failed to load products</div>');
    }
  }
}
