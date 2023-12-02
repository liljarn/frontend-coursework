let productDatabase;
if (localStorage.getItem('productDatabase') != null) {
  productDatabase = JSON.parse(localStorage.getItem('productDatabase'));
}

let favouriteProducts;
if (localStorage.getItem('favourites') == null) {
  favouriteProducts = [];
  localStorage.setItem('favourites', JSON.stringify(productDatabase));
} else {
  favouriteProducts = JSON.parse(localStorage.getItem('favourites'));
}

function loadProducts(products) {
  const favouriteContainer = document.querySelector(".favourite-products");
  favouriteContainer.innerHTML = '';

  if(products.length === 0) {
    favouriteContainer.innerHTML = `
    <div class="empty-fav">
      <h2>Вы ещё не добавили ничего в избранное</h2>
      <img class="profile-empty" src="images/chocolate_cart.png">
      <button onclick="window.location.href='catalog.html'">
        К КАТАЛОГУ
      </button>
    </div>`
    return;
  }

  const title = document.createElement("span");
  title.classList.add("favourite-products__title");
  title.textContent = "ИЗБРАННЫЕ ТОВАРЫ";

  favouriteContainer.appendChild(title)

  products.forEach(product => {
    const card = document.createElement("div");
    
    card.classList.add("favourite-product");
      card.innerHTML = `
        <div class="favourite-product__photo"><img src="${product.imageUrl}" alt="favourite-product"></div>
        <div class="favourite-product__info">
            <span class="favourite-product__name">${product.name}</span>
            <button class="like-button" id="${product.id}"><i class="heart fa-solid fa-heart"></i></button>
        </div>
      `;
    
      favouriteContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", function(){
  loadProducts(favouriteProducts);

  const cards = document.querySelectorAll('.favourite-product'); 

  cards.forEach(card => {
    const likeButton = card.querySelector(".favourite-product__info .like-button");
    const productId = likeButton.id;
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
});

window.addEventListener('beforeunload', function() {
  localStorage.setItem('favourites', JSON.stringify(favouriteProducts));
});