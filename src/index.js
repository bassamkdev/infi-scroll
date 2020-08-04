const flash = require("./flash");

//loading content of website

const gallery = document.getElementById("gallery");
const loader = document.getElementById("loader");
const errorDisplay = document.getElementById("errorHandler");
let totalImages;
let ready = false;

let apiConfig = {
  count: 10,
  query: "",
  key: "AwOj7l-fd3FxyJ8qS67leQmEsmyU58KQj54rl6smAcc",
  orientation: "squarish",
};

function generateUrl(apiConfig) {
  return `https://api.unsplash.com/photos/random/?client_id=${apiConfig.key}&count=${apiConfig.count}&orientation=${apiConfig.orientation}&query=${apiConfig.query}`;
}

function imageRendered() {
  totalImages--;
  if (totalImages === 0) {
    ready = true;
    loader.hidden = true;
  }
}
function errorHandler() {
  loader.hidden = true;
  errorDisplay.hidden = false;
}

async function displayImages(images) {
  try {
    let imagesArray = await images;
    totalImages = imagesArray.length;
    imagesArray.forEach((image) => {
      let element = flash.createElement(
        "div",
        { className: "gallery-card" },
        flash.createElement("img", {
          className: "gallery-card__image",
          src: image.urls.regular,
          alt: image.alt_description,
          title: image.alt_description,
        }),
        flash.createElement(
          "div",
          { className: "gallery-card__footer" },
          flash.createElement(
            "p",
            { className: "gallery-card__text" },
            image.alt_description
          ),
          flash.createElement(
            "a",
            {
              className: "gallery-card__view",
              href: image.links.html,
              target: "_blank",
            },
            flash.createElement("i", {
              className: "fa fa-eye gallery-card__view",
              "aria-hidden": true,
            })
          )
        )
      );
      flash.render(element, gallery);
      imageRendered();
    });
  } catch (err) {
    errorHandler();
  }
}

async function getImages(baseUrl) {
  const response = await fetch(baseUrl);
  return await response.json();
}

function loadContent() {
  errorDisplay.hidden = true;
  [generateUrl, getImages, displayImages].reduce((input, fn) => {
    return fn(input);
  }, apiConfig);
}

// handling search

const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("searchIcon");
let SearchInputVisible = false;

function toggleSearchInput() {
  if (!SearchInputVisible) {
    SearchInputVisible = true;
    searchInput.classList.add("search__input--visible");
  } else {
    SearchInputVisible = false;
    searchInput.classList.remove("search__input--visible");
  }
}

const handleInputChange = (evt) => {
  apiConfig.query = evt.target.value;
  let galleryCards = document.querySelectorAll(".gallery-card");
  if (galleryCards.length) {
    for (let element of galleryCards) {
      element.remove();
    }
  }
  loadContent();
  loader.hidden = false;
};

// handling Scroll

const handleScroll = () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
    ready
  ) {
    ready = false;
    loadContent();
  }
};

//listening for requests and events

loadContent();
window.addEventListener("scroll", handleScroll);
searchInput.addEventListener("change", handleInputChange);
searchIcon.addEventListener("click", toggleSearchInput);
