import { getCartItems, removeFromCart, addToCart } from '../../../utils/localstorage';
import { CartItem } from '../../../types/types';

const CartScreen = {
  after_render: (): void => {
    const qtySelects = document.getElementsByClassName('qty-select');
    Array.from(qtySelects).forEach((qtySelect) => {
      qtySelect.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLSelectElement;
        const item = getCartItems().find((x: CartItem) => x.product === qtySelect.id);
        if (item) {
          addToCart({ ...item, qty: Number(target.value) }, true);
        }
      });
    });
    const deleteButtons = document.getElementsByClassName('delete-button');
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener('click', () => {
        removeFromCart(deleteButton.id);
      });
    });
    document.getElementById('checkout-button')?.addEventListener('click', () => {
      document.location.hash = '/login';
    });
  },
  render: async (): Promise<string> => {
    const cartItems = getCartItems();
    return `
      <div class="cart">
        <div class="cart-list">
          <ul class="cart-list-container">
            <li>
              <h3>Shopping Cart</h3>
              <div>Price</div>
            </li>
            ${
              cartItems.length === 0
                ? `<div>
                    <h4 style="color: #0066ff">Cart is empty.</h4>
                    <a class="goshopping" href="/#/">Go Shopping</a>
                  </div>`
                : cartItems
                    .map(
                      (item: CartItem) => `
                    <li>
                      <div class="cart-image">
                        <img class="img-fluid" src="${item.image}" alt="${item.name}"/>
                      </div>
                      <div class="cart-name">
                        <div class="product-name">
                          <a href="/#/product/${item.product}">${item.name}</a>
                          <div class="cart-price">$${item.price}</div>
                        </div>
                        <div class="but-select">
                          <div class="select-first">
                            <p>Quantity: </p>
                            <select class="qty-select form-select-sm form-select" aria-label="Default select example" id="${item.product}">
                              ${[...Array(item.quantityInStock).keys()]
                                .map((x) =>
                                  item.qty === x + 1
                                    ? `<option selected value="${x + 1}">${x + 1}</option>`
                                    : `<option value="${x + 1}">${x + 1}</option>`
                                )
                                .join('\n')}
                            </select>
                          </div>
                          <button type="button" class="delete-button btn btn-danger" id="${item.product}">Delete</button>
                        </div>
                      </div>
                    </li>
                  `
                    )
                    .join('\n')
            }
          </ul>
        </div>
        <div class="cart-action mb-2">
          <h3>Subtotal (<span>${cartItems.reduce((a, c) => a + c.qty, 0)}</span> items) : <span>$${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}</span> </h3>
          <button id="checkout-button" class="btn btn-success">Checkout</button>
        </div>
      </div>
    `;
  },
};

export default CartScreen;
