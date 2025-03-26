document.addEventListener("DOMContentLoaded", initialise);
let allProducts;
let cart = []; // <= added code
function initialise() {
    console.log("Working!!");
    fetchProducts();
    filterCategories();
    searchProducts();
    openCart();
    closeCart();
}

async function fetchProducts() {
    try {
        const resp = await fetch("https://fakestoreapi.com/products");
        const data = await resp.json();
        allProducts = data;
        displayProducts(allProducts);
    } catch (error) {
        console.log(error);
    }
}
function displayProducts(products) {
    const list = document.querySelector("#list")
    products.map((product) => {
        const { image, category, price, title, id } = product;
        list.innerHTML += `
        <li class="card">
        <div class="img-content">
        <img src=${image} alt=${category} />
        </div>
        <div class="card-content">
        <p class="card-price">$${price.toFixed(2)}</p>
        <h4 class="card-title">${title.substring(0, 45)}....</h4>
        <p class="card-desc hide">${category.toUpperCase()}</p>
        <div class="btn-container">
        <button class="card-btn" onclick="addToCart(${id})"> Add to Cart</button>
        </div>
        </li>
        `;
    })
        .join("");
}

function filterCategories() {
    const select = document.querySelector("#filter-btn");
    select.addEventListener("change", filterProducts);

    function filterProducts(e) {
        let list = document.querySelector("#list");
        let content;
        let option = e.target.value;
        list.innerHTML = "";
        switch (option) {
            case "All":
                content = allProducts;
                break;
            case "Men":
                content = allProducts.filter((product) => {
                    return product.category === "men's clothing";
                })
                break;
            case "Women":
                content = allProducts.filter((product => {
                    return product.category === "women's clothing";
                }))
                break;
            case "Electronics":
                content = allProducts.filter((product => {
                    return product.category === "electronics";
                }))
                break
            case "Jewellery":
                content = allProducts.filter((product) => {
                    return product.category === "jewelery";
                })
                break;
            default:
                content = allProducts;
        }
        content.map((product) => {
            const { image, category, price, title, id } = product;
            list.innerHTML += `
            <li class="card">
            <div class="img-content">
            <img src=${image} alt=${category} />
            </div>
            <div class="card-content">
            <p class="card-price"> $${price}</p>
            <h4 class="card-title">${title.substring(0, 45)}....</h4>
            <p class="card-desc hide"> ${category.toUpperCase()}</p>
            <div class="btn-container">
            <button class="card-btn" onclick="addToCart(${id})"> Add to Cart </button>
            </div>
            </li>
            `;
        }).join("");
    }
}
function searchProducts() {
    const searchInput = document.querySelector("#searchinput");
    const list = document.querySelector("#list");
    searchInput.addEventListener("keyup", (e) => {
        list.innerHTML = "";
        let searchTerm = e.target.value.toLowerCase();
        let content = allProducts.filter((product) => {
            return product.title.toLowerCase().includes(searchTerm);
        });
        content.map((product) => {
            const { image, price, category, title, id } = product;
            list.innerHTML += `
            <li class= "card"> 
            <div class="img-content"> 
            <img src=${image} alt=${category}/>
            </div>
            <div class="card-content"> 
            <p class="card-price"> $${price}</p>
            <h4 class="card-title">${title.substring(0, 45)}....</h>
            <p class="card-desc hide"> ${category.toUpperCase()}</p>
            <div class="btn-container">
            <button class="card-btn" onclick="addToCart(${id})"> Add to Cart </button>
            </div>
            </li>
            `;
        }).join("");
    });
}
function openCart() {
    const cartBtn = document.querySelector("#cart-container");
    // on click, open modal
    cartBtn.addEventListener("click", seeModal);
}

// see modal function
function seeModal() {
    const body = document.body;
    const cartModal = document.querySelector(".modal");
    cartModal.classList.remove("hide");
    body.classList.add("modal-open");
}

function closeCart() {
    const closeBtn = document.querySelector(".fa-xmark");
    closeBtn.addEventListener("click", closeModal);
}

function closeModal() {
    const body = document.body;
    const cartModal = document.querySelector(".modal");
    cartModal.classList.add("hide");
    body.classList.remove("modal-open");
}

function addToCart(id) {
    const searchCart = cart.find((product) => product.id === id);
    if (searchCart) {
        alert("Product already in the cart!");
    } else {
        const oldProduct = allProducts.find((product) => product.id === id);
        cart.push({ ...oldProduct, quantity: 1 });
    }
    console.log(cart);
    shoppingCart();
}

function shoppingCart() {
    const cartList = document.querySelector("#cart-list");
    const cartNumber = document.querySelector(".cart-number-container");
    const cartTotal = document.querySelector("#cart-total");
    let cartHTML = "";
    cart.map((product) => {
        const { title, price, quantity, id } = product;
        cartHTML += `
        <li id="item-container">
        <div class="cart-title">
        <h3>${title.substring(0, 30)}...</h3>
        </div>
        <div class="cart-quantity-container">
        <p class="cart-price">$${price.toFixed(2)}</p>
        <div class="button-quantity-container">
        <button class="minus" onclick="decrement(${id}, event)">-</button>
        <p> ${quantity}</p>
        <button class="plus" onclick="increment(${id}, event)">+</button>
        </div>
        <p id="item-total">$${(price * quantity).toFixed(2)}</p>
        <div class="remove-cart-item">
        <button onclick="deleteCartItem(${id}, event)">Remove item</button>
        </div>
        </div>
        </li>
        `;
    }).join("");
    cartList.innerHTML = cartHTML;
    const itemTotals = document.querySelectorAll("#item-total");
    let sum = 0;
    itemTotals.forEach((itemTotals) => {
        const numericValue = itemTotals.innerHTML;
        const index = numericValue.indexOf("$");
        sum += Number(numericValue.slice(index + 1));
    });
    cartTotal.innerHTML = sum >= 1 ? `<button id="checkout" onclick="checkout()">Pay Now: $${sum.toFixed(2)}</button>` : `No items in the Cart`;
    let newSum = 0;
    cart.map((product) => {
        newSum += product.quantity;
    });
    if (newSum < 1) {
        cartNumber.classList.add("hide");
    } else {
        cartNumber.classList.remove("hide");
        cartNumber.innerHTML = newSum;
    }
}
function decrement(id) {
    const cartProduct = cart.find((product) => product.id === id);
    if (cartProduct) {
        cartProduct.quantity--;
    }
    shoppingCart();
}

function increment(id) {
    const cartProduct = cart.find((product) => product.id === id);
    if (cartProduct) {
        cartProduct.quantity++;
    }
    shoppingCart();
}

function deleteCartItem(id){
    cart = cart.filter((product) => product.id !== id);
    shoppingCart();
}
function checkout(){
    const cartList=document.querySelector("#cart-list");
    cart = [];
    shoppingCart();
    cartList.innerHTML=`<p class="checkout-message">Thank you for your purchase!</p>`;
}