function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('cart'));

  const menuCart = document.querySelector('.cart');
  const menuCartMobile = document.querySelector('.mobile-cart')

  if (cart && cart.products.length > 0) {
    let totalQuantity = cart.products.reduce((acc, product) => acc + product.quantity, 0);

    let cartCountSpan = menuCart.querySelector('.cart-count');
    let cartCountSpanMobile = menuCartMobile.querySelector('.cart-count');
    if (!cartCountSpan) {
      cartCountSpan = document.createElement('span');
      cartCountSpan.classList.add('cart-count');
      cartCountSpanMobile = document.createElement('span');
      cartCountSpanMobile.classList.add('cart-count');
      menuCartMobile.appendChild(cartCountSpanMobile);
      menuCart.appendChild(cartCountSpan);
    }

    cartCountSpan.textContent = totalQuantity;
    cartCountSpanMobile.textContent = totalQuantity;
  } else {
    const cartCountSpan = menuCart.querySelector('.cart-count');
    const cartCountSpanMobile = menuCartMobile.querySelector('.cart-count');
    if (cartCountSpan) {
      cartCountSpan.remove();
      cartCountSpanMobile.remove();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCounter();
    const showLoginFormButton = document.getElementById("showLoginFormButton");
    const showLoginFormButtonMobile = document.getElementById("showLoginFormButtonMobile");
    const popupLoginForm = document.getElementById("loginForm");
    const closeLoginFormButton = document.getElementById("closeLoginFormButton");
    showLoginFormButton.addEventListener("click", function () {
      popupLoginForm.style.display = "flex";
    });
  
    showLoginFormButtonMobile.addEventListener("click", function () {
      popupLoginForm.style.display = "flex";
    });
  
    closeLoginFormButton.addEventListener("click", function () {
        popupLoginForm.style.display = "none";
    });
  
    document.getElementById('login-button').addEventListener('click', function() {
        console.log('click');
        window.location.href = 'catalog.html';
    });
  
    const burgerButton = document.querySelector(".header-burger");
    const mobileMenu = document.querySelector(".mobile-menu");
  
    burgerButton.addEventListener("click", function(event) {
      event.stopPropagation(); 
      if (!mobileMenu.classList.contains("active")) {
        mobileMenu.classList.add("active");
        mobileMenu.style.display = "block";
        // burgerButton.style.transform = "rotate(90deg)";
        burgerButton.classList.add("active_burger");
      } else {
        mobileMenu.classList.remove("active");
        mobileMenu.style.display = "none";
        burgerButton.classList.remove("active_burger");
        // burgerButton.style.transform = "rotate(0deg)";
      }
    });
});