import Product from "./product_class.js";
import Cart from "./cart_class.js";

let cart;
const cartJSON = localStorage.getItem('cart');

if (cartJSON) {
  cart = new Cart();
  Object.assign(cart, JSON.parse(cartJSON));
} else {
  cart = new Cart();
  localStorage.setItem('cart', JSON.stringify(cart));
}

let productDatabase  = [];

function parseJson() {
    fetch("catalog.json")
        .then(function(response){
            return response.json();
        })
        .then(function(products){
            for (let i = 0; i < products.length; i++) {
                productDatabase.push(new Product
                    (
                        products[i].id,
                        products[i].name,
                        products[i].description,
                        products[i].price,
                        products[i].imageUrl,
                        products[i].isBar,
                        products[i].isCandy,
                        products[i].isBox,
                        products[i].isFigure
                    )
                );
            }
            localStorage.setItem('productDatabase', JSON.stringify(productDatabase));
            console.log(productDatabase);
            loadProducts(productDatabase);
            setEventListenersToButtons();
            setTouchListenersToCards();
        });
}

let favouriteProducts;
if (localStorage.getItem('favourites') == null) {
  favouriteProducts = [];
  localStorage.setItem('favourites', JSON.stringify(productDatabase));
} else {
  favouriteProducts = JSON.parse(localStorage.getItem('favourites'));
}

function loadProducts(products) {
  const catalogContainer = document.querySelector(".shop");
  catalogContainer.innerHTML = '';

  if(!products)
    return;

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("choco_type");

    card.innerHTML = `
      <div class="img-container">
        <button class="like-button"><i class="heart fa-regular fa-heart"></i></button>
        <div class="choco_type__price">${product.price}₽</div>
        <img class="choco_type__image" src="${product.imageUrl}" alt="${product.name}">
      </div>
      <div class="choco_type_text">
        <p class="choco_type_text__name"><b>${product.name}</b></p>
        <p class="choco_type_text__info">${product.description}</p>
      </div>
      <div class="cart-button" id="${product.id}">
        <button class="buy-button">КУПИТЬ</button>
        <div class="addmore">
          <button class="less-button">-</button>
          <span class="count">1</span>
          <button class="more-button">+</button>
        </div>
      </div>
    `;
    catalogContainer.appendChild(card);

    if (favouriteProducts.find(favourite => product.id === favourite.id)) {
      card.querySelector('.img-container .like-button .heart').classList.remove("fa-regular");
      card.querySelector('.img-container .like-button .heart').classList.add("fa-solid"); 
    }
  });
}


const minVal = document.querySelector(".min-val");
const maxVal = document.querySelector(".max-val");
const priceInputMin = document.querySelector(".min-input");
const priceInputMax = document.querySelector(".max-input");
const minToolTip = document.querySelector(".min-tooltip");
const maxToolTip = document.querySelector(".max-tooltip");
const minGap = 0;
const range = document.querySelector(".slider-track");
const sliderMinValue = parseInt(minVal.min);
const sliderMaxValue = parseInt(maxVal.max);

minVal.addEventListener('input', slideMin);
maxVal.addEventListener('input', slideMax);

window.onload = function() {
  slideMin();
  slideMax();
};
function slideMin() {
  let gap = parseInt(maxVal.value) - parseInt(minVal.value);
  if (gap < minGap) {
    minVal.value = parseInt(maxVal.value) - minGap;
  } 
  minToolTip.innerHTML = "₽" + minVal.value;
  priceInputMin.value = minVal.value;
  setArea();
  filter();
};
function slideMax() {
  let gap = parseInt(maxVal.value) - parseInt(minVal.value);
  if (gap < minGap) {
    maxVal.value = parseInt(minVal.value) + minGap;
  } 
  maxToolTip.innerHTML = "₽" + maxVal.value;
  priceInputMax.value = maxVal.value;
  setArea();
  filter();
};
function setArea() {
  range.style.left = (minVal.value / sliderMaxValue) * 100 + "%";
  minToolTip.style.left = (minVal.value / sliderMaxValue) * 100 + "%";
  range.style.right = 100 - (maxVal.value / sliderMaxValue) * 100 + "%";
  maxToolTip.style.right = 100 - (maxVal.value / sliderMaxValue) * 100 + "%";
};

const minInput = document.querySelector(".min-input");
minInput.addEventListener("change", setMinInput);

const maxInput = document.querySelector(".max-input");
maxInput.addEventListener("change", setMaxInput);
    
function setMinInput() {
  let minPrice = parseInt(priceInputMin.value);
  if (minPrice < sliderMinValue) {
    priceInputMin.value = sliderMinValue;
  }
  minVal.value = priceInputMin.value;
  slideMin();
};

function setMaxInput() {
  let maxPrice = parseInt(priceInputMax.value);
  if (maxPrice > sliderMaxValue) {
    priceInputMax.value = sliderMaxValue;
  }
  maxVal.value = priceInputMax.value;
  slideMax();
};

function setEventListenersToButtons() {
  const cartButtons = document.querySelectorAll(".cart-button");
  cartButtons.forEach(button => {
    let count = 0;
    const buyButton = button.querySelector(".buy-button");
    const addMoreContainer = button.querySelector(".addmore");
    const moreButton = button.querySelector(".more-button");
    const lessButton = button.querySelector(".less-button");
    const countSpan = button.querySelector(".count");
    const productId = button.id;
    const selectedProduct = productDatabase.find(product => product.id === productId);
    let isInCart = cart.products.some(product => product.id === productId);
    if (isInCart) {
      buyButton.style.visibility = "hidden";
      addMoreContainer.style.visibility = "visible";
      count = cart.products.find(product => product.id === productId).quantity;
      countSpan.textContent = count;
    }
    buyButton.addEventListener("click", function() {
      console.log('click');
      buyButton.style.visibility = "hidden";
      addMoreContainer.style.visibility = "visible";
      cart.addProduct(selectedProduct);
      count++;
      countSpan.textContent = count;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCounter();
    })
    moreButton.addEventListener("click", function(){
      cart.addProduct(selectedProduct);
      count++;
      countSpan.textContent = count;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCounter();
    })
    lessButton.addEventListener("click", function(){
      cart.removeProduct(selectedProduct);
      count--;
      if (count == 0) {
        buyButton.style.visibility = "visible";
        addMoreContainer.style.visibility = "hidden";
      }
      countSpan.textContent = count;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCounter();
    })
    minPriceInput.addEventListener("input", filter);
    maxPriceInput.addEventListener("input", filter);
  });
}

let currentProducts = productDatabase;

function filter() {
  const minPrice = parseFloat(document.getElementById("minPriceInput").value) || 0;
  const maxPrice = parseFloat(document.getElementById("maxPriceInput").value) || Infinity;
  currentProducts = productDatabase.filter(product => {
    const productPrice = parseFloat(product.price.replace(/[₽]/g, ''));
    return productPrice >= minPrice && productPrice <= maxPrice;
  });
  const sortSelect = document.getElementById("sortSelect");
  const selectedOption = sortSelect.value;
  if (selectedOption === "ascending") {
    currentProducts.sort((a, b) => parseInt(a.price) - parseInt(b.price));
  } else if (selectedOption === "descending") {
    currentProducts.sort((a, b) => parseInt(b.price) - parseInt(a.price));
  }
  loadProducts(currentProducts);
  setTouchListenersToCards();
  setEventListenersToButtons();
}

 function filterByPrice(products) {
   const minPrice = parseFloat(document.getElementById("minPriceInput").value) || 0;
   const maxPrice = parseFloat(document.getElementById("maxPriceInput").value) || Infinity;
   return products.filter(product => {
      const productPrice = parseFloat(product.price.replace(/[₽]/g, ''));
      return productPrice >= minPrice && productPrice <= maxPrice;
    });
 }

function setTouchListenersToCards() {
  const cards = document.querySelectorAll('.choco_type'); 

  cards.forEach(card => {
    var isTouched = false;
    const imgContainer = card.querySelector('.img-container .choco_type__image');
    const textBlock = card.querySelector('.choco_type_text');
    const textInfoBlock = card.querySelector('.choco_type_text__info');

    imgContainer.addEventListener('touchstart', function(event) {
      event.preventDefault();
      if (!isTouched) {
        textBlock.classList.add('touch-active');
        textInfoBlock.classList.add('touch-active__info');
        isTouched = true;
      } else {
        textBlock.classList.remove('touch-active');
        textInfoBlock.classList.remove('touch-active__info');
        isTouched = false;
      }
    });

    const likeButton = card.querySelector(".img-container .like-button");
    const productId = card.querySelector('.cart-button').id;
    const selectedProduct = productDatabase.find(product => product.id === productId);

    likeButton.addEventListener('click', function() {
      console.log("click");
      const heart = likeButton.querySelector(".heart");

      if (heart.classList.contains("fa-regular")) {
        favouriteProducts.push(selectedProduct);
        heart.classList.remove("fa-regular");
        heart.classList.add("fa-solid");
      } else {
        favouriteProducts = favouriteProducts.filter(favourite => favourite.id != selectedProduct.id);
        heart.classList.remove("fa-solid");
        heart.classList.add("fa-regular");
      }
    });
  });
}



document.addEventListener("DOMContentLoaded", function(){
  parseJson();

  const sortSelect = document.getElementById("sortSelect");
  sortSelect.addEventListener("change", function() {
    const selectedOption = this.value;
    
    if (selectedOption === "default") {
      currentProducts = productDatabase.filter(product => {
        const productPrice = parseFloat(product.price.replace(/[₽]/g, ''));
        return productPrice >= parseFloat(minPriceInput.value) && productPrice <= parseFloat(maxPriceInput.value);
      });
      loadProducts(currentProducts);
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "ascending") {
      loadProducts(filterByPrice([...currentProducts]).sort((a, b) => parseInt(a.price) - parseInt(b.price)));
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "descending") {
      loadProducts(filterByPrice([...currentProducts]).sort((a, b) => parseInt(b.price) - parseInt(a.price)));
      setEventListenersToButtons();
      setTouchListenersToCards();
    }
  });

  const typeSelect = document.getElementById("typeSelect");
  typeSelect.addEventListener("change", function() {
    sortSelect.value = "default";
    const selectedOption = this.value;
    if (selectedOption === "default") {
      currentProducts = productDatabase;
      loadProducts(currentProducts);
      setEventListenersToButtons();
      setTouchListenersToCards();

    } else if (selectedOption === "favourite") {
      currentProducts = favouriteProducts;
      loadProducts(filterByPrice(currentProducts));
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "bar") {
      currentProducts = productDatabase.filter(product => product.isBar === true);
      console.log(currentProducts);
      loadProducts(filterByPrice(currentProducts));
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "candy") {
      currentProducts = productDatabase.filter(product => product.isCandy === true);
      loadProducts(filterByPrice(currentProducts));
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "box") {
      currentProducts = productDatabase.filter(product => product.isBox === true);
      loadProducts(filterByPrice(currentProducts));
      setEventListenersToButtons();
      setTouchListenersToCards();
    } else if (selectedOption === "figure") {
      currentProducts = productDatabase.filter(product => product.isFigure === true);
      loadProducts(filterByPrice(currentProducts));
      setEventListenersToButtons();
      setTouchListenersToCards();
    }
  });
  
});

 window.addEventListener('beforeunload', function() {
   localStorage.setItem('favourites', JSON.stringify(favouriteProducts));
 });

 