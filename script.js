const tags = document.querySelectorAll(".tag");
const galleryContainer = document.querySelector(".gallery-container");

async function queryProductsApi() {
  // fetch products.json data
  const response = await fetch("products.json");
  // store products data in json variable
  const json = await response.json();

  // destructure json variable
  const { products } = json;

  return products;
}

async function getProductsData() {
  // since not ES6 module :( call the queryProductsApi in async function
  const products = await queryProductsApi();

  createGalleryItems(products);
}
getProductsData();

function createGalleryItems(items) {
  // get each items category array
  const productCategories = Object.values(items);

  // loop through each array
  productCategories.forEach((category) => {
    // loop through each arrays items and map the image to gallery item
    category.map((item) => {
      galleryContainer.innerHTML += `
        <div class="gallery-item">
          <img src="https://source.unsplash.com/${item.imageId}" alt="${item.imageId}" />
        </div>
      `;
    });
  });

  // add event handler to all images
  addListenerToImages();
}

async function filterGalleryItems(e) {
  const tagName = e.target.dataset.tag;
  const products = await queryProductsApi();

  // clear gallery container items
  galleryContainer.innerHTML = "";

  if (tagName === "all") {
    return createGalleryItems(products);
  }

  // loop through the correct product array *Ex: products["shoes"]*
  products[tagName].forEach((product) => {
    galleryContainer.innerHTML += `
      <div class="gallery-item">
        <img src="https://source.unsplash.com/${product.imageId}" alt="${product.imageId}" />
      </div>
    `;
  });

  addListenerToImages();
}

function addListenerToImages() {
  // create an array of the gallery items
  const productImages = [...galleryContainer.children];

  // add event handler to all images
  productImages.forEach((img) => {
    img.addEventListener("click", displayModal);
  });
}

const handleAriaAttribute = (e) => {
  // remove aria-selected tag on button
  tags.forEach((tag) => {
    tag.removeAttribute("aria-selected");
  });

  // set aria-selected on e.target
  e.target.setAttribute("aria-selected", true);
};

// looping over each tag
tags.forEach((tag) => {
  // adding a click event listener to each tag
  tag.addEventListener("click", (e) => {
    // set aria-selected tag on active button
    handleAriaAttribute(e);
    filterGalleryItems(e);
  });
});

// * MODAL FUNCTIONALITY

// get the modal
const modal = document.querySelector(".modal");

// get the image and insert it inside the modal
const modalImg = document.querySelector(".modal-img");

// get the button that closes the modal
const closeBtn = document.querySelector(".close");

function displayModal(e) {
  // add active class to modal
  modal.classList.add("active");
  // set the modalImg src to e.target src
  modalImg.src = e.target.src;
}

closeBtn.addEventListener("click", () => {
  // remove active class from modal
  modal.classList.remove("active");
});
