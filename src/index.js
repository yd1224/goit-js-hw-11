import axios from "axios";
const container = document.querySelector(".js-cat-list");
const searchForm = document.querySelector(".search-form")
container.classList.add("gallery")
console.log(searchForm);
searchForm.addEventListener("submit", handleSubmit)
function handleSubmit(event) {
    event.preventDefault()
    const value = searchForm.searchQuery.value.trim();
    console.log(value);
    let page = 1;

const options = {
    root: null,
    rootMargin: "300px",
    threshold: 0
}
const observer = new IntersectionObserver(handlePagination, options)
    serviceCats(value, page)
        .then(data => {
            console.log(data);
            container.insertAdjacentHTML("beforeend", createMarkup(data.hits))
let lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250, overlayOpacity: 0.5 });
            if(data.page < data.totalHits/40) { 
                   observer.observe(guard)
            }
        })
}
function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <li class="cat-card">
         <div class="gallery__item">
            <a class="gallery__link" href="${largeImageURL}" rel="noopener" onclick="return false;" download>
            <img class="gallery__image lazyload"  data-src="${webformatURL}" alt="${tags}"/>
            </a>
         </div>
      
         <div class="cat-info">
                <p class="text">Likes: ${likes}</p>
                <p>Views: ${views}</p>
                <p>Comments: ${comments}</p>
                <p>Downloads: ${downloads}</p>
            </div>
        </li>
    `).join("")
  


}

function serviceCats(value, page=1) {
    const BASE_URL = "https://pixabay.com/api/";
     const API_KEY = "41223528-c58fe2fc7fc280c0bcaa36972";
    const queryParams = new URLSearchParams({
        key: API_KEY,
        q: value,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        per_page: "40"
    })
    return axios.get(`${BASE_URL}?${queryParams}`)
        .then(resp => {
          console.log(resp.data.hits);
            return resp.data
        })
        .catch(error => {
            throw new Error(error)
        })
}
function handlePagination(entries, observer) {
    entries.forEach((entry) => {
        console.log(entry);
        if(entry.isIntersecting) {
            console.log("ok");
            page += 1;
            serviceCats(page)
                .then((data) => {
                    container.insertAdjacentHTML("beforeend", createMarkup(data.hits))

                    if(data.page >= data.totalHits/40) {
                        observer.unobserve(entry.target)
                    }
                })
                .catch(error => console.log(error))
        }
    })
}