import axios from "axios";
import Notiflix from 'notiflix'; 
const container = document.querySelector(".js-cat-list");
const searchForm = document.querySelector(".search-form")
const guard = document.querySelector(".js-guard");
let value=""
container.classList.add("gallery")
const options = {
    root: null,
    rootMargin: "300px",
    threshold: 0
};
const observer = new IntersectionObserver(handlePagination, options);


let page=1;
// console.log("global",page);
searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();
    page = 1;
    container.innerHTML = "";
    value = searchForm.searchQuery.value.trim();

    // Disconnect the observer before making a new request
    observer.disconnect();

    serviceCats(value)
        .then(data => {
            if (data.totalHits === 0) {
                throw new Error();
            }

            container.insertAdjacentHTML("beforeend", createMarkup(data.hits));
            let lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250, overlayOpacity: 0.5 });
            smoothScrollGallery();
       console.log(page);
                    console.log( Math.floor(data.totalHits / 40));
            if (page < Math.floor(data.totalHits / 40)) {
         console.log(page);
                    console.log( Math.floor(data.totalHits / 40));
                observer.observe(guard);
            } else {
                   Notiflix.Notify.info(
                            `We're sorry, but you've reached the end of search results.`,
                        );
            }
        })
        .catch(() =>
            Notiflix.Notify.failure(
                ` Sorry, there are no images matching your search query. Please try again.`,
            )
        )
        .finally(() => searchForm.reset());
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
      console.log("service", page);
    return axios.get(`${BASE_URL}?${queryParams}`)
        .then(resp => {
   
            // if (data.totalHits === 0) {  
            //     throw new Error;
            // }
            console.log("1234567890--098765432345");
            return resp.data
        })
    //   .catch(() => 
    //        Notiflix.Notify.failure(
    //            ` Sorry, there are no images matching your search query. Please try again.`,
    //        )
    // )
}







function handlePagination(entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            page += 1;
            console.log("pagination", page);

            serviceCats(value, page)
                .then((data) => {
                    container.insertAdjacentHTML("beforeend", createMarkup(data.hits));
                    let lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250, overlayOpacity: 0.5 });
                    smoothScrollGallery();
                    console.log(page);
                    console.log( Math.floor(data.totalHits / 40));
                    if (page >= Math.floor(data.totalHits / 40)) {
                        observer.unobserve(entry.target);
                        Notiflix.Notify.info(
                            `We're sorry, but you've reached the end of search results.`,
                        );
                    }
                })
                .catch(() => {
                    // Handle error during pagination
                });
        }
    });
}

// ... (remaining code)



let prevScrollPos = window.pageYOffset;

window.addEventListener('scroll', () => {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
        searchForm.classList.remove('hidden');
    } else {
        searchForm.classList.add('hidden');
    }
    prevScrollPos = currentScrollPos;
});
function smoothScrollGallery() {
    const { height } = container.firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: height * 2.5,
  behavior: "smooth",
});

}
