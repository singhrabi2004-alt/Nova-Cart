// =====================================================
// NOVACART - COMPLETE JAVASCRIPT
// MONGODB API + SEARCH + CART + CHECKOUT + AUTH
// =====================================================

// =====================================================
// PRODUCTS
// =====================================================

let products = [];

// =====================================================
// LOAD PRODUCTS FROM BACKEND
// =====================================================

async function loadProducts() {

    try {

        const response = await fetch(
            "https://nova-cart-backend.onrender.com/api/products"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products = await response.json();

        console.log(
            "Products loaded from MongoDB:",
            products
        );

        setupProductPage();
        // setupProductDetails();

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        const productList =
            document.getElementById("product-list");

        if (productList) {

            productList.innerHTML = `

                <div class="no-products">

                    <h2>
                        Unable to load products
                    </h2>

                    <p>
                        Please make sure the backend server is running.
                    </p>

                </div>

            `;
        }
    }
}

// =====================================================
// LOCAL STORAGE HELPERS
// =====================================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    } catch (error) {

        console.error(
            "Cart error:",
            error
        );

        return [];
    }
}

function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}

// =====================================================
// GET LOGGED-IN USER
// =====================================================

function getLoggedInUser() {

    const user =
        localStorage.getItem("loggedInUser");

    if (!user) {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch (error) {

        console.error(
            "Logged-in user error:",
            error
        );

        localStorage.removeItem(
            "loggedInUser"
        );

        return null;
    }
}

// =====================================================
// CART COUNT
// =====================================================

function updateCartCount() {

    const cartCount =
        document.querySelector(".cart-count");

    if (!cartCount) return;

    const cart = getCart();

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total +
                (Number(item.quantity) || 1),
            0
        );

    cartCount.textContent =
        totalQuantity;
}

// =====================================================
// PRODUCT CARD
// =====================================================

function createProductCard(product) {

    const card =
        document.createElement("div");

    card.className = "card";

    card.innerHTML = `

        <h2>
            ${product.name}
        </h2>

        <div class="product-image">
            ${product.image || ""}
        </div>

        <p>
            ${product.description || ""}
        </p>

        <strong>
            ₹${Number(
                product.price
            ).toLocaleString("en-IN")}
        </strong>

        <span class="discount">
            ${product.discount}% off
        </span>

        <br><br>

        <a href="product.html?id=${product.id}">
            View Product
        </a>

    `;

    return card;
}

// =====================================================
// PRODUCT LIST + SEARCH
// =====================================================

function setupProductPage() {

    const productList =
        document.getElementById("product-list");

    if (!productList) return;

    const searchInput =
        document.querySelector(
            ".search-box input"
        );

    const searchButton =
        document.querySelector(
            ".search-box button"
        );

    const categorySelect =
        document.querySelector(
            ".search-box select"
        );

    function displayProducts(list) {

        productList.innerHTML = "";

        if (list.length === 0) {

            productList.innerHTML = `

                <div class="no-products">

                    <h2>
                        No products found
                    </h2>

                    <p>
                        Try another search.
                    </p>

                </div>

            `;

            return;
        }

        list.forEach(
            product => {

                productList.appendChild(
                    createProductCard(product)
                );

            }
        );
    }

    function searchProducts() {

        const searchText =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        const category =
            categorySelect
                ? categorySelect.value
                : "All";

        const filtered =
            products.filter(
                product => {

                    const name =
                        (product.name || "")
                            .toLowerCase();

                    const productCategory =
                        (product.category || "")
                            .toLowerCase();

                    const description =
                        (product.description || "")
                            .toLowerCase();

                    const matchesSearch =
                        searchText === "" ||

                        name.includes(
                            searchText
                        ) ||

                        productCategory.includes(
                            searchText
                        ) ||

                        description.includes(
                            searchText
                        );

                    const matchesCategory =
                        category === "All" ||

                        product.category ===
                        category;

                    return (
                        matchesSearch &&
                        matchesCategory
                    );
                }
            );

        displayProducts(filtered);
    }

    displayProducts(products);

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                searchProducts();

            }
        );
    }

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchProducts
        );

        searchInput.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    searchProducts();

                }
            }
        );
    }

    if (categorySelect) {

        categorySelect.addEventListener(
            "change",
            searchProducts
        );
    }
}

// =====================================================
// PRODUCT DETAILS PAGE
// =====================================================

async function setupProductDetails() {

    const productId =
        new URLSearchParams(
            window.location.search
        ).get("id");

    if (!productId) return;

    const selectedProduct =
        products.find(
            product =>
                String(product.id) ===
                String(productId)
        );

    if (!selectedProduct) {

        console.log(
            "Product not found:",
            productId
        );

        return;
    }

    const productImage =
        document.getElementById(
            "product-image"
        );

    const productName =
        document.getElementById(
            "product-name"
        );

    const productCategory =
        document.getElementById(
            "product-category"
        );

    const productDescription =
        document.getElementById(
            "product-description"
        );

    const productPrice =
        document.getElementById(
            "product-price"
        );

    const productDiscount =
        document.getElementById(
            "product-discount"
        );

    if (productImage) {

        productImage.textContent =
            selectedProduct.image || "";

    }

    if (productName) {

        productName.textContent =
            selectedProduct.name;

    }

    if (productCategory) {

        productCategory.textContent =
            selectedProduct.category;

    }

    if (productDescription) {

        productDescription.textContent =
            selectedProduct.description;

    }

    if (productPrice) {

        productPrice.textContent =
            `₹${Number(
                selectedProduct.price
            ).toLocaleString("en-IN")}`;

    }

    if (productDiscount) {

        productDiscount.textContent =
            `${selectedProduct.discount}% off`;

    }

    // =================================================
    // ADD TO CART
    // =================================================

    const addButton =
        document.getElementById(
            "add-to-cart"
        );

    if (addButton) {

        addButton.addEventListener(
            "click",
            async function() {

                // CHECK LOGIN

                const user =
                    getLoggedInUser();

                if (!user) {

                    alert(
                        "Please login first."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }

                try {

                    const cart =
                        getCart();

                    const existingProduct =
                        cart.find(
                            item =>
                                String(item.id) ===
                                String(
                                    selectedProduct.id
                                )
                        );

                    if (existingProduct) {

                        existingProduct.quantity =
                            (
                                Number(
                                    existingProduct.quantity
                                ) || 1
                            ) + 1;

                    } else {

                        cart.push({
                            ...selectedProduct,
                            quantity: 1
                        });

                    }

                    saveCart(cart);

                    updateCartCount();

                    // USER-SPECIFIC CART

                    const response =
                        await fetch(
                            `https://nova-cart-backend.onrender.com/api/cart/${user.id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    items: cart
                                })
                            }
                        );

                    if (!response.ok) {

                        throw new Error(
                            "Could not update cart"
                        );

                    }

                    alert(
                        `${selectedProduct.name} added to cart!`
                    );

                } catch (error) {

                    console.error(
                        "Add to cart error:",
                        error
                    );

                    alert(
                        "Unable to add product to cart"
                    );
                }
            }
        );
    }
}

// =====================================================
// CART PAGE
// =====================================================

function setupCartPage() {

    const cartContainer =
        document.getElementById(
            "cart-container"
        );

    if (!cartContainer) return;

    async function loadCartFromBackend() {

        const user =
            getLoggedInUser();

        if (!user) {
            return;
        }

        try {

            const response =
                await fetch(
                    `https://nova-cart-backend.onrender.com/api/cart/${user.id}`
                );

            if (!response.ok) {

                throw new Error(
                    "Failed to load cart"
                );
            }

            const cart =
                await response.json();

            saveCart(
                cart.items || []
            );

            updateCartCount();

        } catch (error) {

            console.error(
                "Error loading cart:",
                error
            );
        }
    }

    function displayCart() {

        const cart =
            getCart();

        cartContainer.innerHTML =
            "";

        let total =
            0;

        if (cart.length === 0) {

            cartContainer.innerHTML = `

                <div class="no-products">

                    <h2>
                        Your cart is empty.
                    </h2>

                    <p>
                        Add some products first.
                    </p>

                    <a href="index.html">
                        Continue Shopping
                    </a>

                </div>

            `;

            const totalElement =
                document.getElementById(
                    "cart-total"
                );

            if (totalElement) {

                totalElement.textContent =
                    "₹0";
            }

            return;
        }

        cart.forEach(
            (product, index) => {

                const quantity =
                    Number(
                        product.quantity
                    ) || 1;

                const price =
                    Number(
                        product.price
                    ) || 0;

                total +=
                    price *
                    quantity;

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "cart-item";

                item.innerHTML = `

                    <div class="cart-item-image">
                        ${product.image || ""}
                    </div>

                    <div class="cart-item-info">

                        <h2>
                            ${product.name}
                        </h2>

                        <p>
                            ${product.category}
                        </p>

                        <strong>
                            ₹${price.toLocaleString("en-IN")}
                        </strong>

                        <div class="quantity">

                            <button
                                class="minus-btn"
                                data-index="${index}"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                class="plus-btn"
                                data-index="${index}"
                            >
                                +
                            </button>

                        </div>

                        <button
                            class="remove-btn"
                            data-index="${index}"
                        >
                            🗑️ Remove
                        </button>

                    </div>

                `;

                cartContainer.appendChild(
                    item
                );
            }
        );

        const totalElement =
            document.getElementById(
                "cart-total"
            );

        if (totalElement) {

            totalElement.textContent =
                `₹${total.toLocaleString("en-IN")}`;
        }

        // =================================================
        // PLUS
        // =================================================

        cartContainer
            .querySelectorAll(".plus-btn")
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        async function() {

                            const user =
                                getLoggedInUser();

                            if (!user) {

                                alert(
                                    "Please login first."
                                );

                                window.location.href =
                                    "login.html";

                                return;
                            }

                            const cart =
                                getCart();

                            const index =
                                Number(
                                    button.dataset.index
                                );

                            if (!cart[index])
                                return;

                            cart[index].quantity =
                                (
                                    Number(
                                        cart[index]
                                            .quantity
                                    ) || 1
                                ) + 1;

                            saveCart(cart);

                            updateCartCount();

                            try {

                                await fetch(
                                    `https://nova-cart-backend.onrender.com/api/cart/${user.id}`,
                                    {
                                        method: "PUT",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body:
                                            JSON.stringify({
                                                items: cart
                                            })
                                    }
                                );

                            } catch (error) {

                                console.error(
                                    "Cart update error:",
                                    error
                                );
                            }

                            displayCart();
                        }
                    );
                }
            );

        // =================================================
        // MINUS
        // =================================================

        cartContainer
            .querySelectorAll(".minus-btn")
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        async function() {
const user =
                                getLoggedInUser();

                            if (!user) {

                                alert(
                                    "Please login first."
                                );

                                window.location.href =
                                    "login.html";

                                return;
                            }

                            const cart =
                                getCart();

                            const index =
                                Number(
                                    button.dataset.index
                                );

                            if (!cart[index])
                                return;

                            const quantity =
                                Number(
                                    cart[index]
                                        .quantity
                                ) || 1;

                            if (quantity > 1) {

                                cart[index].quantity =
                                    quantity - 1;
                            }

                            saveCart(cart);

                            updateCartCount();

                            try {

                                await fetch(
                                    `https://nova-cart-backend.onrender.com/api/cart/${user.id}`,
                                    {
                                        method: "PUT",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body:
                                            JSON.stringify({
                                                items: cart
                                            })
                                    }
                                );

                            } catch (error) {

                                console.error(
                                    "Cart update error:",
                                    error
                                );
                            }

                            displayCart();
                        }
                    );
                }
            );

        // =================================================
        // REMOVE
        // =================================================

        cartContainer
            .querySelectorAll(".remove-btn")
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        async function() {

                            const user =
                                getLoggedInUser();

                            if (!user) {

                                alert(
                                    "Please login first."
                                );

                                window.location.href =
                                    "login.html";

                                return;
                            }

                            const cart =
                                getCart();

                            const index =
                                Number(
                                    button.dataset.index
                                );

                            if (!cart[index])
                                return;

                            const name =
                                cart[index].name;

                            cart.splice(
                                index,
                                1
                            );

                            saveCart(cart);

                            updateCartCount();

                            try {

                                await fetch(
                                    `https://nova-cart-backend.onrender.com/api/cart/${user.id}`,
                                    {
                                        method: "PUT",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body:
                                            JSON.stringify({
                                                items: cart
                                            })
                                    }
                                );

                            } catch (error) {

                                console.error(
                                    "Cart update error:",
                                    error
                                );
                            }

                            displayCart();

                            alert(
                                `${name} removed from cart.`
                            );
                        }
                    );
                }
            );
    }

    loadCartFromBackend().then(
        () => {
            displayCart();
        }
    );
}
// =====================================================
// CHECKOUT PAGE
// =====================================================

function setupCheckoutPage() {

    const checkoutItems =
        document.getElementById(
            "checkout-items"
        );

    if (!checkoutItems) return;

    const itemsTotal =
        document.getElementById(
            "items-total"
        );

    const orderTotal =
        document.getElementById(
            "order-total"
        );

    const payButton =
        document.getElementById(
            "pay-button"
        );

    const cardDetails =
        document.getElementById(
            "card-details"
        );

    const upiDetails =
        document.getElementById(
            "upi-details"
        );

    function displayCheckout() {

        const cart =
            getCart();

        checkoutItems.innerHTML =
            "";

        let total =
            0;

        if (cart.length === 0) {

            checkoutItems.innerHTML = `

                <p>
                    Your cart is empty.
                </p>

            `;

            if (itemsTotal) {
                itemsTotal.textContent =
                    "₹0";
            }

            if (orderTotal) {
                orderTotal.textContent =
                    "₹0";
            }

            if (payButton) {
                payButton.disabled =
                    true;
            }

            return;
        }

        cart.forEach(
            product => {

                const quantity =
                    Number(
                        product.quantity
                    ) || 1;

                const price =
                    Number(
                        product.price
                    ) || 0;

                const productTotal =
                    price *
                    quantity;

                total +=
                    productTotal;

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "checkout-item";

                item.innerHTML = `

                    <div>

                        <strong>
                            ${product.image || ""}
                            ${product.name}
                        </strong>

                        <p>
                            Quantity: ${quantity}
                        </p>

                    </div>

                    <strong>
                        ₹${productTotal.toLocaleString("en-IN")}
                    </strong>

                `;

                checkoutItems.appendChild(
                    item
                );
            }
        );

        if (itemsTotal) {

            itemsTotal.textContent =
                `₹${total.toLocaleString("en-IN")}`;
        }

        if (orderTotal) {

            orderTotal.textContent =
                `₹${total.toLocaleString("en-IN")}`;
        }

        if (payButton) {

            payButton.disabled =
                false;
        }
    }

    displayCheckout();

    // =================================================
    // PAYMENT METHOD
    // =================================================

    const paymentOptions =
        document.querySelectorAll(
            'input[name="payment"]'
        );

    function updatePaymentFields() {

        const selected =
            document.querySelector(
                'input[name="payment"]:checked'
            );

        if (cardDetails) {
            cardDetails.style.display =
                "none";
        }

        if (upiDetails) {
            upiDetails.style.display =
                "none";
        }

        if (!selected) return;

        if (selected.value === "card") {

            if (cardDetails) {

                cardDetails.style.display =
                    "block";
            }
        }

        if (selected.value === "upi") {

            if (upiDetails) {

                upiDetails.style.display =
                    "block";
            }
        }
    }

    paymentOptions.forEach(
        option => {

            option.addEventListener(
                "change",
                updatePaymentFields
            );
        }
    );

    updatePaymentFields();

    // =================================================
    // DEMO PAYMENT
    // =================================================

    if (payButton) {

        payButton.addEventListener(
            "click",
            async function(event) {

                event.preventDefault();

                // CHECK LOGIN

                const user =
                    getLoggedInUser();

                if (!user) {

                    alert(
                        "Please login first."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }

                const cart =
                    getCart();

                if (cart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;
                }

                // ADDRESS

                const nameInput =
                    document.getElementById(
                        "full-name"
                    );

                const phoneInput =
                    document.getElementById(
                        "phone"
                    );

                const addressInput =
                    document.getElementById(
                        "address"
                    );

                const cityInput =
                    document.getElementById(
                        "city"
                    );

                const pincodeInput =
                    document.getElementById(
                        "pincode"
                    );

                const name =
                    nameInput
                        ? nameInput.value.trim()
                        : "";

                const phone =
                    phoneInput
                        ? phoneInput.value.trim()
                        : "";

                const address =
                    addressInput
                        ? addressInput.value.trim()
                        : "";

                const city =
                    cityInput
                        ? cityInput.value.trim()
                        : "";

                const pincode =
                    pincodeInput
                        ? pincodeInput.value.trim()
                        : "";

                if (
                    !name ||
                    !phone ||
                    !address ||
                    !city ||
                    !pincode
                ) {

                    alert(
                        "Please enter your complete delivery address."
                    );

                    return;
                }

                // PAYMENT

                const selectedPayment =
                    document.querySelector(
                        'input[name="payment"]:checked'
                    );

                if (!selectedPayment) {

                    alert(
                        "Please select a payment method."
                    );

                    return;
                }

                const paymentMethod =
                    selectedPayment.value;

                // CARD VALIDATION

                if (
                    paymentMethod === "card"
                ) {

                    const cardInput =
                        document.getElementById(
                            "card-number"
                        );

                    const expiryInput =
                        document.getElementById(
                            "expiry"
                        );

                    const cvvInput =
                        document.getElementById(
                            "cvv"
                        );

                    const cardNumber =
                        cardInput
                            ? cardInput.value
                                .replace(
                                    /\s/g,
                                    ""
                                )
                            : "";

                    const expiry =
                        expiryInput
                            ? expiryInput.value.trim()
                            : "";

                    const cvv =
                        cvvInput
                            ? cvvInput.value.trim()
                            : "";

                    if (
                        !/^\d{16}$/.test(
                            cardNumber
                        )
                    ) {

                        alert(
                            "Enter a valid 16-digit demo card number."
                        );

                        return;
                    }

                    if (
                        !/^\d{2}\/\d{2}$/.test(
                            expiry
                        )
                    ) {

                        alert(
                            "Enter expiry as MM/YY."
                        );

                        return;
                    }

                    if (
                        !/^\d{3}$/.test(
                            cvv
                        )
                    ) {

                        alert(
                            "Enter a valid 3-digit CVV."
                        );

                        return;
                    }
                }

                // UPI VALIDATION

                if (
                    paymentMethod === "upi"
                ) {

                    const upiInput =
                        document.getElementById(
                            "upi-id"
                        );

                    const upi =
                        upiInput
                            ? upiInput.value.trim()
                            : "";

                    if (
                        !/^[^@\s]+@[^@\s]+$/.test(
                            upi
                        )
                    ) {

                        alert(
                            "Enter a valid demo UPI ID, for example example@upi."
                        );

                        return;
                    }
                }

                // TOTAL

                let total =
                    0;

                cart.forEach(
                    product => {

                        const quantity =
                            Number(
                                product.quantity
                            ) || 1;

                        const price =
                            Number(
                                product.price
                            ) || 0;

                        total +=
                            quantity *
                            price;
                    }
                );

                // ORDER NUMBER

                const orderNumber =
                    Math.floor(
                        100000 +
                        Math.random() *
                        900000
                    );

                // SAVE ORDER

                const order = {

                    userId:
                        user.id,

                    orderNumber:
                        orderNumber,

                    customerName:
                        name,

                    phone:
                        phone,

                    address:
                        address,

                    city:
                        city,

                    pincode:
                        pincode,

                    paymentMethod:
                        paymentMethod,

                    items:
                        cart,

                    total:
                        total,

                    date:
                        new Date()
                            .toLocaleString(
                                "en-IN"
                            )
                };

                try {

                    const response =
                        await fetch(
                            "https://nova-cart-backend.onrender.com/api/orders",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        order
                                    )
                            }
                        );

                    const result =
                        await response.json();

                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Order could not be created"
                        );
                    }

                    console.log(
                        "Order saved to MongoDB:",
                        result.order
                    );

                    localStorage.setItem(
                        "lastOrder",
                        JSON.stringify(
                            result.order
                        )
                    );

                } catch (error) {

                    console.error(
                        "Order API error:",
                        error
                    );

                    alert(
                        "Unable to place order. Please try again."
                    );

                    return;
                }

                // CLEAR CART

if (user) {
    await fetch(
        `https://nova-cart-backend.onrender.com/api/cart/${user.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: []
            })
        }
    );
}

localStorage.removeItem("cart");

window.location.href =
    "success.html";

            }
        );
    }
}
// =====================================================
// BACK TO TOP
// =====================================================

function setupBackToTop() {

    const backTop =
        document.querySelector(
            ".back-top"
        );

    if (!backTop) return;

    backTop.addEventListener(
        "click",
        function() {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });
        }
    );
}

// =====================================================
// SHOP NOW BUTTON
// =====================================================

function setupShopButton() {

    const button =
        document.querySelector(
            ".shop-btn"
        );

    if (!button) return;

    button.addEventListener(
        "click",
        function() {

            const productList =
                document.getElementById(
                    "product-list"
                );

            if (productList) {

                productList.scrollIntoView({

                    behavior: "smooth"

                });
            }
        }
    );
}

// =====================================================
// USER REGISTRATION
// =====================================================

function setupRegistration() {

    const registerForm =
        document.getElementById(
            "register-form"
        );

    if (!registerForm) return;

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "register-name"
                ).value.trim();

            const email =
                document.getElementById(
                    "register-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "register-password"
                ).value;

            const message =
                document.getElementById(
                    "register-message"
                );

                const isValidPassword =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

if (!isValidPassword) {

    message.textContent =
        "Password does not meet all requirements.";

    return;
}

            try {

                const response =
                    await fetch(
                        "https://nova-cart-backend.onrender.com/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name:
                                        name,

                                    email:
                                        email,

                                    password:
                                        password
                                })
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Registration failed"
                    );
                }

                message.textContent =
                    "Account created successfully!";

                // Registration does NOT log the user in.
                // User can now go to Login.

            } catch (error) {

                message.textContent =
                    error.message;
            }
        }
    );
}

// =====================================================
// USER LOGIN
// =====================================================

function setupLogin() {

    const loginForm =
        document.getElementById(
            "login-form"
        );

    if (!loginForm) return;

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document.getElementById(
                    "login-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "login-password"
                ).value;

            const message =
                document.getElementById(
                    "login-message"
                );

            try {

                const response =
                    await fetch(
                        "https://nova-cart-backend.onrender.com/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email:
                                        email,

                                    password:
                                        password
                                })
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Login failed"
                    );
                }

                // SAVE LOGGED-IN USER

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(
                        result.user
                    )
                );

                message.textContent =
                    "Login successful!";

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1000);

            } catch (error) {

                message.textContent =
                    error.message;
            }
        }
    );
}
// =====================================================
// START EVERYTHING
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupCartPage();

        setupCheckoutPage();

        setupBackToTop();

        setupShopButton();

        setupRegistration();

        setupLogin();

        const toggleLoginPassword =
    document.getElementById("toggle-login-password");

const loginPassword =
    document.getElementById("login-password");

    if (toggleLoginPassword && loginPassword) {

        toggleLoginPassword.addEventListener("click", function() {
    
            if (loginPassword.type === "password") {
    
                loginPassword.type = "text";
    
                this.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';
    
            } else {
    
                loginPassword.type = "password";
    
                this.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';
    
            }
    
        });
    
    }
        updateCartCount();
        loadProducts();

    }
);
const registerPassword =
    document.getElementById("register-password");

if (registerPassword) {

    registerPassword.addEventListener("input", function() {

        const password = this.value;

        const lengthRule =
            document.getElementById("length-rule");

        const uppercaseRule =
            document.getElementById("uppercase-rule");

        const lowercaseRule =
            document.getElementById("lowercase-rule");

        const numberRule =
            document.getElementById("number-rule");

        const specialRule =
            document.getElementById("special-rule");


        lengthRule.style.color =
            password.length >= 8 ? "green" : "#777";

        uppercaseRule.style.color =
            /[A-Z]/.test(password) ? "green" : "#777";

        lowercaseRule.style.color =
            /[a-z]/.test(password) ? "green" : "#777";

        numberRule.style.color =
            /[0-9]/.test(password) ? "green" : "#777";

        specialRule.style.color =
            /[^A-Za-z0-9]/.test(password) ? "green" : "#777";

    });

}
const toggleRegisterPassword =
    document.getElementById("toggle-register-password");

const registerPasswordField =
    document.getElementById("register-password");

if (toggleRegisterPassword && registerPasswordField) {

    toggleRegisterPassword.addEventListener("click", function() {

        if (registerPasswordField.type === "password") {

            registerPasswordField.type = "text";

            this.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        } else {

            registerPasswordField.type = "password";

            this.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        }

    });

}