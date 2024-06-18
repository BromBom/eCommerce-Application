import { ProductProjection, Cart, Customer } from '@commercetools/platform-sdk';
import Layout from '../../../layout/layout';
import { queryProduct } from '../../../../api/project';
import { addProductToCart, getCartByID, getCartByCustomerID, createAnonymousCart } from '../../../../api/cart';
import Rating from '../../../components/rating';
import { Pages } from '../../../router/pages';
import Router from '../../../router/router';
import { handleError, showLoading, handleSucsess, hideLoading } from '../../../utils/showmessage';

const TEXT = 'PRODUCTS PAGE';

export default class Products extends Layout {
  router: Router;

  constructor(router: Router) {
    const params = {
      tag: 'section' as keyof HTMLElementTagNameMap,
      classNames: ['index'],
    };
    super(params);
    this.router = router;
    this.configureView();
    this.renderProducts();
  }

  static async creatNewCart() {
    try {
      const customer = JSON.parse(localStorage.getItem('newCustomer')!) as Customer;
      let currentBasket: Cart;
      if (customer) {
        const customerID = customer.id;
        currentBasket = await getCartByCustomerID(customerID);
        localStorage.setItem('CurrentCartId', currentBasket.id);
        localStorage.setItem('CurrentCart', JSON.stringify(currentBasket));
      } else {
        const cartID = localStorage.getItem('CurrentCartId');
        if (cartID) {
          currentBasket = await getCartByID(cartID);
        } else {
          currentBasket = await createAnonymousCart();
        }
        localStorage.setItem('CurrentCartId', currentBasket.id);
        localStorage.setItem('CurrentCart', JSON.stringify(currentBasket));
      }
    } catch (error) {
      console.log(`Failed to create cart: ${error}`);
      handleError(new Error('Failed to create cart'), `Failed to create cart! ${error}`);
    }
  }

  configureView() {
    this.setTextContent(TEXT);
  }

  async renderProducts(categoryId?: string) {
    try {
      const response = await queryProduct(categoryId);
      const products: ProductProjection[] = response.body.results;
      await this.updateProducts(products);
    } catch (error) {
      console.log(error);
      this.setHTMLContent('<div class="error">Failed to load products</div>');
    }
  }

  async updateProducts(products: ProductProjection[]) {
    await Products.creatNewCart();
    const cartID = localStorage.getItem('CurrentCartId');
    const cart = await getCartByID(cartID!);
    localStorage.setItem('CurrentCart', JSON.stringify(cart));

    const cartIconInHeader = document.getElementsByClassName('cart');
    cartIconInHeader[0].innerHTML = '';

    if (cart.lineItems.length) {
      cartIconInHeader[0].innerHTML = `<div id="cart-counter"></div>`;
      const cartCounter = document.getElementById('cart-counter');
      cartCounter!.innerHTML = `${cart.lineItems.length}`;
    }

    const productsInCart = cart.lineItems;
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

        const discountedPrice =
          product.masterVariant.prices && product.masterVariant.prices[0].discounted
            ? (product.masterVariant.prices[0].discounted.value.centAmount / 100).toFixed(2)
            : null;

        const description = product.description?.['en-US'] || 'No description';

        let buttonInnerText = 'Buy Now';

        if (productsInCart.find((lineItem) => lineItem.productId === product.id)) {
          buttonInnerText = 'Already in cart';
        }

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
                <button class="buynow btn btn-primary" data-id="${product.id}" data-name="${productName}" data-price="${price}" data-image="${imageUrl}" data-description="${description}">${buttonInnerText}</button>
                <div class="product-price ${discountedPrice ? 'discounted' : ''}">
                $${price}
              </div>
                ${discountedPrice ? `<div class="product-discount">$${discountedPrice}</div>` : ''}
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
    this.addEventListeners();
    Products.lazyLoadProductCards();
  }

  addEventListeners() {
    const buyNowButtons = document.getElementsByClassName('buynow');
    Array.from(buyNowButtons).forEach((btn) => {
      btn.addEventListener('click', async (e: Event) => {
        const target = e.target as HTMLButtonElement;
        const productId = target.getAttribute('data-id');

        try {
          showLoading();
          const cartID = localStorage.getItem('CurrentCartId');
          const cart = await getCartByID(cartID!);
          localStorage.setItem('CurrentCart', JSON.stringify(cart));
          const newCart = await addProductToCart(cart, productId!);

          const cartCounter = document.getElementById('cart-counter');
          if (cartCounter) {
            cartCounter.innerHTML = `${newCart.lineItems.length}`;
          } else {
            const cartIconInHeader = document.getElementsByClassName('cart');
            cartIconInHeader[0].innerHTML = `<div id="cart-counter"></div>`;
            const newCartCounter = document.getElementById('cart-counter');
            newCartCounter!.innerHTML = `${newCart.lineItems.length}`;
          }

          hideLoading();
          handleSucsess('Adding product to cart was successful!!');
        } catch (error) {
          console.log(`Failed to click button "buy now": ${error}`);
          handleError(new Error('Failed to click button "buy now"'), `Failed to click button "buy now"! ${error}`);
        }
        target.textContent = 'Already in cart';
      });
    });

    const cardDetailContainer = document.querySelector('.products');
    cardDetailContainer?.addEventListener('click', (event) => {
      const targetElement = event.target as HTMLElement;
      const targetContainer = targetElement.closest('.product-container') as HTMLDivElement;
      if (targetContainer) {
        const cardId = targetContainer.dataset.cardid;
        if (cardId) {
          localStorage.setItem('cardId', cardId);
          this.router.navigate(`${Pages.DETAILS}`);
        }
      }
    });
  }

  static lazyLoadProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const productCard = entry.target as HTMLElement;
          const imageUrl = productCard.dataset.src;

          if (imageUrl) {
            const productLinkImg = productCard.querySelector('.product-image.lazy') as HTMLImageElement;
            if (productLinkImg) {
              productLinkImg.src = imageUrl;
              productLinkImg.classList.remove('lazy');
              productLinkImg.onload = () => {
                productLinkImg.removeAttribute('data-src');
              };
            }
          }

          intersectionObserver.unobserve(entry.target);
        }
      });
    }, options);

    productCards.forEach((productCard) => {
      intersectionObserver.observe(productCard);
    });
  }
}
