// same from original website - the product names, prices, categories, and downloaded image assets below are based on the live Dmart pages the user linked.
const PRODUCTS = [
  {
    id: "banana-peppers-yellow",
    name: "Banana Peppers Yellow",
    searchNames: ["banana peppers yellow", "banana paper yellow"],
    price: 3.29,
    category: "Produce",
    image: "assets/banana-peppers-yellow.jpg",
    productPage: null
  },
  {
    id: "bananas",
    name: "Bananas",
    searchNames: ["bananas", "banana"],
    price: 0.89,
    category: "Fruits",
    image: "assets/bananas.jpg",
    productPage: "product-bananas.html"
  },
  {
    id: "blackberries",
    name: "Blackberries",
    searchNames: ["blackberries", "blackberry"],
    price: 2.79,
    category: "Fruits",
    image: "assets/blackberries.jpg",
    productPage: null
  },
  {
    id: "blueberries",
    name: "Blueberries",
    searchNames: ["blueberries", "blueberry"],
    price: 3.15,
    category: "Fruits",
    image: "assets/blueberries.jpg",
    productPage: null
  },
  {
    id: "carrots",
    name: "Carrots",
    searchNames: ["carrots", "carrot"],
    price: 2.30,
    category: "Produce",
    image: "assets/carrots.jpg",
    productPage: "product-carrots.html"
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    searchNames: ["cauliflower"],
    price: 3.29,
    category: "Produce",
    image: "assets/cauliflower.jpg",
    productPage: null
  },
  {
    id: "cucumbers",
    name: "Cucumbers",
    searchNames: ["cucumbers", "cucumber"],
    price: 2.19,
    category: "Produce",
    image: "assets/cucumbers.jpg",
    productPage: "product-cucumbers.html"
  },
  {
    id: "brocolli",
    name: "Brocolli",
    searchNames: ["brocolli", "broccoli"],
    price: 1.69,
    category: "Produce",
    image: "assets/brocolli.jpg",
    productPage: "product-brocolli.html"
  },
  {
    id: "cilantro",
    name: "Cilantro",
    searchNames: ["cilantro"],
    price: 1.09,
    category: "Produce",
    image: "assets/cilantro.jpg",
    productPage: null
  }
];

const CART_STORAGE_KEY = "dmart-redesign-cart";
const DELIVERY_STORAGE_KEY = "dmart-redesign-delivery";

function getProductById(productId) {
  return PRODUCTS.find((product) => product.id === productId);
}

// improvement - cart data is saved in localStorage so the student project works across separate HTML files.
function loadCart() {
  const rawCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!rawCart) {
    return [];
  }

  try {
    return JSON.parse(rawCart);
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadDeliveryAddress() {
  const rawAddress = localStorage.getItem(DELIVERY_STORAGE_KEY);

  if (!rawAddress) {
    return {
      street: "",
      city: "",
      zip: "",
      state: ""
    };
  }

  try {
    return JSON.parse(rawAddress);
  } catch (error) {
    return {
      street: "",
      city: "",
      zip: "",
      state: ""
    };
  }
}

function saveDeliveryAddress(address) {
  localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(address));
}

function getCartCount(cart) {
  let count = 0;

  cart.forEach((item) => {
    count += item.quantity;
  });

  return count;
}

function getCartSubtotal(cart) {
  let total = 0;

  cart.forEach((item) => {
    const product = getProductById(item.id);

    if (product) {
      total += product.price * item.quantity;
    }
  });

  return total;
}

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function updateNavSummary() {
  const cart = loadCart();
  const countElement = document.getElementById("nav-cart-count");
  const totalElement = document.getElementById("nav-cart-total");

  if (countElement) {
    countElement.textContent = `${getCartCount(cart)} Cart`;
  }

  if (totalElement) {
    totalElement.textContent = formatMoney(getCartSubtotal(cart));
  }
}

// improvement - this helper shows a small success message under the product photo instead of using a popup.
function showAddedMessage(triggerElement) {
  let messageElement = null;

  if (triggerElement) {
    const productCard = triggerElement.closest(".product-card");

    if (productCard) {
      messageElement = productCard.querySelector(".js-add-message");
    }
  }

  if (!messageElement) {
    messageElement = document.querySelector(".js-product-added-message");
  }

  if (!messageElement) {
    return;
  }

  messageElement.classList.add("visible");

  if (messageElement.hideTimer) {
    clearTimeout(messageElement.hideTimer);
  }

  messageElement.hideTimer = window.setTimeout(() => {
    messageElement.classList.remove("visible");
  }, 2200);
}

// improvement - this simple add to cart helper lets every shop and product page button work without a browser alert.
function addToCart(productId, quantity, triggerElement) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const cart = loadCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += safeQuantity;
  } else {
    cart.push({
      id: productId,
      quantity: safeQuantity
    });
  }

  saveCart(cart);
  updateNavSummary();
  showAddedMessage(triggerElement);
}

function removeFromCart(productId) {
  const updatedCart = loadCart().filter((item) => item.id !== productId);
  saveCart(updatedCart);
  updateNavSummary();
}

function updateCartQuantity(productId, quantity) {
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const cart = loadCart();
  const itemToUpdate = cart.find((item) => item.id === productId);

  if (itemToUpdate) {
    itemToUpdate.quantity = safeQuantity;
    saveCart(cart);
    updateNavSummary();
  }
}

function getBestSearchMatch(searchValue) {
  const cleanedValue = searchValue.trim().toLowerCase();

  if (!cleanedValue) {
    return PRODUCTS;
  }

  let exactMatch = null;
  let partialMatch = null;

  PRODUCTS.forEach((product) => {
    const allSearchNames = [product.name.toLowerCase()].concat(product.searchNames);

    if (allSearchNames.includes(cleanedValue)) {
      exactMatch = product;
    } else if (!partialMatch) {
      const hasPartialMatch = allSearchNames.some((name) => name.includes(cleanedValue));

      if (hasPartialMatch) {
        partialMatch = product;
      }
    }
  });

  if (exactMatch) {
    return [exactMatch];
  }

  if (partialMatch) {
    return [partialMatch];
  }

  return [];
}

function createProductCard(product) {
  const productLinkStart = product.productPage ? `<a class="product-image-link" href="${product.productPage}">` : `<div class="product-image-link">`;
  const productLinkEnd = product.productPage ? "</a>" : "</div>";
  const detailButton = product.productPage
    ? `<a class="button secondary-button small-button" href="${product.productPage}">View Product</a>`
    : "";

  return `
    <article class="product-card">
      ${productLinkStart}
        <img class="product-card-image" src="${product.image}" alt="${product.name}">
      ${productLinkEnd}
      <p class="add-to-cart-message js-add-message">Product added to cart</p>
      <div class="product-card-body">
        <h3>${product.productPage ? `<a href="${product.productPage}">${product.name}</a>` : product.name}</h3>
        <p class="product-price">${formatMoney(product.price)}</p>
        <div class="card-actions">
          <button class="button primary-button small-button js-add-to-cart" data-product-id="${product.id}" type="button">Add to cart</button>
          ${detailButton}
        </div>
      </div>
    </article>
  `;
}

// improvement - the shop search now filters the visible products to one matched item from the required product list.
function renderShopPage() {
  const productGrid = document.getElementById("shop-product-grid");
  const searchForm = document.getElementById("shop-search-form");
  const searchInput = document.getElementById("shop-search-input");
  const resultsText = document.getElementById("shop-results-text");

  if (!productGrid || !searchForm || !searchInput || !resultsText) {
    return;
  }

  function drawProducts(productsToShow) {
    if (productsToShow.length === 0) {
      productGrid.innerHTML = `
        <section class="empty-state">
          <h2>No selected product matched that search.</h2>
          <p>Try searching for one of the included products such as Bananas, Cucumbers, Carrots, or Cilantro.</p>
        </section>
      `;
      resultsText.textContent = "Showing 0 of 9 results";
      return;
    }

    productGrid.innerHTML = productsToShow.map(createProductCard).join("");
    resultsText.textContent = `Showing ${productsToShow.length} of 9 results`;
  }

  drawProducts(PRODUCTS);

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const matchedProducts = getBestSearchMatch(searchInput.value);
    drawProducts(matchedProducts);
    attachAddToCartHandlers();
  });

  attachAddToCartHandlers();
}

function renderProductPage() {
  const productId = document.body.dataset.productSlug;
  const product = getProductById(productId);
  const detailContainer = document.getElementById("product-detail");

  if (!product || !detailContainer) {
    return;
  }

  detailContainer.innerHTML = `
    <div class="detail-image-wrap">
      <img class="detail-image" src="${product.image}" alt="${product.name}">
      <p class="add-to-cart-message js-product-added-message">Product added to cart</p>
    </div>
    <div class="detail-info">
      <h2>${product.name}</h2>
      <p class="product-price">${formatMoney(product.price)}</p>
      <p class="shop-copy">This page keeps the main product actions from the live Dmart product detail page and removes the extra description and reviews content.</p>

      <div class="quantity-line">
        <label for="product-quantity">Quantity</label>
        <input id="product-quantity" type="number" min="1" value="1">
      </div>

      <button class="button primary-button js-product-page-add" data-product-id="${product.id}" type="button">Add to cart</button>

      <p class="category-line">Category: ${product.category}</p>

      <div class="detail-links">
        <a class="button secondary-button" href="shop.html">Shop</a>
        <a class="button primary-button" href="checkout.html">Checkout</a>
      </div>
    </div>
  `;

  const addButton = document.querySelector(".js-product-page-add");
  const quantityInput = document.getElementById("product-quantity");

  addButton.addEventListener("click", () => {
    addToCart(product.id, quantityInput.value, addButton);
  });
}

function createCartItemMarkup(product, quantity) {
  const subtotal = product.price * quantity;

  return `
    <article class="cart-item">
      <img class="cart-item-image" src="${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <div class="cart-item-meta">
          <span>Price: ${formatMoney(product.price)}</span>
          <span>Category: ${product.category}</span>
        </div>

        <!-- improvement - this red bordered quantity box updates totals immediately when the user changes the number. -->
        <div class="quantity-box highlight-red">
          <label for="quantity-${product.id}">Quantity</label>
          <input id="quantity-${product.id}" class="js-cart-quantity" data-product-id="${product.id}" type="number" min="1" value="${quantity}">
          <button class="button secondary-button small-button js-remove-item" data-product-id="${product.id}" type="button">Remove</button>
        </div>

        <p class="item-subtotal">Subtotal: <span id="subtotal-${product.id}">${formatMoney(subtotal)}</span></p>
      </div>
    </article>
  `;
}

// improvement - the cart page redraws totals right away after every quantity change instead of waiting for another button.
function renderCartPage() {
  const cart = loadCart();
  const emptyState = document.getElementById("cart-empty-state");
  const cartContent = document.getElementById("cart-content");
  const cartItems = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("cart-total");
  const deliveryForm = document.getElementById("delivery-form");

  if (!emptyState || !cartContent || !cartItems || !subtotalElement || !totalElement || !deliveryForm) {
    return;
  }

  if (cart.length === 0) {
    emptyState.classList.remove("hidden");
    cartContent.classList.add("hidden");
  } else {
    emptyState.classList.add("hidden");
    cartContent.classList.remove("hidden");
  }

  function drawCart() {
    const currentCart = loadCart();

    if (currentCart.length === 0) {
      emptyState.classList.remove("hidden");
      cartContent.classList.add("hidden");
      return;
    }

    cartItems.innerHTML = currentCart.map((item) => {
      const product = getProductById(item.id);
      return product ? createCartItemMarkup(product, item.quantity) : "";
    }).join("");

    const subtotal = getCartSubtotal(currentCart);
    subtotalElement.textContent = formatMoney(subtotal);
    totalElement.textContent = formatMoney(subtotal);

    attachCartHandlers(drawCart);
  }

  const savedAddress = loadDeliveryAddress();
  document.getElementById("delivery-street").value = savedAddress.street;
  document.getElementById("delivery-city").value = savedAddress.city;
  document.getElementById("delivery-zip").value = savedAddress.zip;
  document.getElementById("delivery-state").value = savedAddress.state;

  deliveryForm.addEventListener("input", () => {
    saveDeliveryAddress({
      street: document.getElementById("delivery-street").value.trim(),
      city: document.getElementById("delivery-city").value.trim(),
      zip: document.getElementById("delivery-zip").value.trim(),
      state: document.getElementById("delivery-state").value.trim()
    });
  });

  drawCart();
}

function attachCartHandlers(drawCart) {
  const quantityInputs = document.querySelectorAll(".js-cart-quantity");
  const removeButtons = document.querySelectorAll(".js-remove-item");

  quantityInputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      const productId = event.target.dataset.productId;
      updateCartQuantity(productId, event.target.value);
      drawCart();
    });
  });

  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      removeFromCart(event.target.dataset.productId);
      drawCart();
    });
  });
}

function createDeliverySummary(address) {
  if (!address.street && !address.city && !address.zip && !address.state) {
    return `
      <p>No delivery address saved yet.</p>
      <p>Go to the cart page and fill in the shipping box first.</p>
    `;
  }

  return `
    <p>${address.street || "-"}</p>
    <p>${address.city || "-"}, ${address.state || "-"}</p>
    <p>${address.zip || "-"}</p>
  `;
}

function createCheckoutItem(product, quantity) {
  return `
    <div class="checkout-line-item">
      <span><strong>${product.name}</strong> x ${quantity}</span>
      <span>${formatMoney(product.price * quantity)}</span>
    </div>
  `;
}

function fillBillingFromDelivery() {
  const address = loadDeliveryAddress();
  document.getElementById("billing-street").value = address.street;
  document.getElementById("billing-city").value = address.city;
  document.getElementById("billing-zip").value = address.zip;
  document.getElementById("billing-state").value = address.state;
}

// improvement - the checkout page groups payment choice and billing details into one box and copies the cart address when requested.
function renderCheckoutPage() {
  const cart = loadCart();
  const emptyState = document.getElementById("checkout-empty-state");
  const checkoutContent = document.getElementById("checkout-content");
  const checkoutItems = document.getElementById("checkout-items");
  const subtotalElement = document.getElementById("checkout-subtotal");
  const totalElement = document.getElementById("checkout-total");
  const deliverySummary = document.getElementById("delivery-summary");
  const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
  const applePayNote = document.getElementById("apple-pay-note");
  const cardFields = document.getElementById("card-fields");
  const sameAsDeliveryCheckbox = document.getElementById("same-as-delivery");
  const checkoutForm = document.getElementById("checkout-form");

  if (!emptyState || !checkoutContent || !checkoutItems || !subtotalElement || !totalElement || !deliverySummary || !applePayNote || !cardFields || !sameAsDeliveryCheckbox || !checkoutForm) {
    return;
  }

  if (cart.length === 0) {
    emptyState.classList.remove("hidden");
    checkoutContent.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  checkoutContent.classList.remove("hidden");

  checkoutItems.innerHTML = cart.map((item) => {
    const product = getProductById(item.id);
    return product ? createCheckoutItem(product, item.quantity) : "";
  }).join("");

  const subtotal = getCartSubtotal(cart);
  subtotalElement.textContent = formatMoney(subtotal);
  totalElement.textContent = formatMoney(subtotal);
  deliverySummary.innerHTML = createDeliverySummary(loadDeliveryAddress());

  paymentOptions.forEach((option) => {
    option.addEventListener("change", () => {
      const usingCard = document.querySelector('input[name="payment-method"]:checked').value === "card";
      applePayNote.classList.toggle("hidden", usingCard);
      cardFields.classList.toggle("hidden", !usingCard);
    });
  });

  sameAsDeliveryCheckbox.addEventListener("change", () => {
    if (sameAsDeliveryCheckbox.checked) {
      fillBillingFromDelivery();
    }
  });

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const customerName = document.getElementById("customer-name").value.trim();
    const customerEmail = document.getElementById("customer-email").value.trim();

    if (!customerName || !customerEmail) {
      window.alert("Please fill in your name and email.");
      return;
    }

    if (selectedPaymentMethod === "card") {
      const cardNumber = document.getElementById("card-number").value.trim();
      const billingStreet = document.getElementById("billing-street").value.trim();

      if (!cardNumber || !billingStreet) {
        window.alert("Please fill in the card details and billing address.");
        return;
      }
    }

    window.alert("Order placed successfully in this student project flow.");
    localStorage.removeItem(CART_STORAGE_KEY);
    updateNavSummary();
    window.location.href = "shop.html";
  });
}

function attachAddToCartHandlers() {
  const addButtons = document.querySelectorAll(".js-add-to-cart");

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.productId, 1, button);
    });
  });
}

function initializePage() {
  updateNavSummary();

  const currentPage = document.body.dataset.page;

  if (currentPage === "shop") {
    renderShopPage();
  }

  if (currentPage === "product") {
    renderProductPage();
  }

  if (currentPage === "cart") {
    renderCartPage();
  }

  if (currentPage === "checkout") {
    renderCheckoutPage();
  }
}

document.addEventListener("DOMContentLoaded", initializePage);
