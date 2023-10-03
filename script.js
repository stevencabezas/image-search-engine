const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightbox = document.querySelector(".lightbox");
const closeBtn = lightbox.querySelector(".uil-times");
const downloadBtn = lightbox.querySelector(".uil-import");

// API key, paginations, searchTerm variables
const API_KEY = "EphfA8oVHCPYMyDgNvzG9eJCr07AuuAhDKfcMbnphkauIKrzzUUu6125";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;
let img_download = '';

const downloadImg = (imgURL) => {
    // Converting received img to blob, creating its download link, & downloading it
    fetch(imgURL).then(res => res.blob()).then(file =>{
        // console.log(file);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);// Creates URL of passed object
        a.download = new Date().getTime();// Passing current time in miliseconds as <a> download value
        a.click();
    }).catch(() => alert("Failed to download image!"))
}

const showLightbox = (name, img) => {
    // Showing lightbox and setting img source, name and button attribute
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name;
    downloadBtn.setAttribute("data-img", img);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";// Remove scroll when card is open
}

const generateHTML = (images) => {
    // Making li of all fetched images and adding them to the existing image wrapper
    // stopPropagation() prevents propagation of the same event from being called
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img-1">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
}

const getImages = (apiURL) => {
    // Fetching images by API call with authorization header

    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, {
        headers: {
            Authorization: API_KEY
        }
    }).then(res => res.json()).then(data => {
        // console.log(data.photos)
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!"))
}

const loadMoreImages = () => {
    currentPage++; // Increment currentPage by 1
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    // If searchTerm has some value then call API with search term else call default API
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL ;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // If search input is empty, set the search term to null and return from here
    if(e.target.value === "") return searchTerm = null;
    // If pressed key is Enter, update the current page, search term & call the getImages
    if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML="";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
//Passing btn img attribute value as argument to the downloading function
downloadBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));