import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApi from './api';
import LoadMoreBtn from './load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// =====Refs===========
const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

// =======СlassInstances========
const imagesApi = new ImagesApi();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

// ====Listeners=========
searchFormRef.addEventListener('submit', onSearch);
// loadMoreBtn.button.addEventListener('click', onLoadMoreBtn);

let simpleLightbox = null;
let lastImg = null;

async function onSearch(evt) {
  evt.preventDefault();

  imagesApi.query = evt.currentTarget.elements.searchQuery.value;

  if (imagesApi.query === '') {
    return Notify.failure('Enter something');
  }

  loadMoreBtn.hide();
  imagesApi.resetPage();
  clearImagesBox();

  try {
    const { hits, totalHits } = await imagesApi.fetchImages();

    if (!hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);

      // loadMoreBtn.show();
      createImagesBox(hits);
      makeSimpleLightbox();

      lastImg = document.querySelector('.simplelightbox-gallery:last-child');

      if (lastImg) {
        infiniteObserver.observe(lastImg);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

// async function onLoadMoreBtn() {
//   try {
//     const { hits } = await imagesApi.fetchImages();

//     createImagesBox(hits);
//     refreshSimpleLightbox();
//     // smoothScrolling('.container');

//     if (hits.length < imagesApi.per_page) {
//       Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//       return loadMoreBtn.hide();
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

function clearImagesBox() {
  galleryRef.innerHTML = '';
}

function createImagesBox(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="simplelightbox-gallery" href="${largeImageURL}"
  ><div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" width="430" height="240" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes <span class="info__value">${likes}</span></b>
      </p>
      <p class="info-item">
        <b>Views <span class="info__value">${views}</span></b>
      </p>
      <p class="info-item">
        <b>Comments <span class="info__value">${comments}</span></b>
      </p>
      <p class="info-item">
        <b>Downloads <span class="info__value">${downloads}</span></b>
      </p>
    </div>
  </div></a
>`;
      }
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function makeSimpleLightbox() {
  simpleLightbox = new SimpleLightbox('.gallery a');
}
function refreshSimpleLightbox() {
  simpleLightbox.refresh();
}

// function smoothScrolling(selector) {
//   const { height: cardHeight } = document
//     .querySelector(selector)
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight,
//     behavior: 'smooth',
//   });
// }

// infinite scrolling

const infiniteObserver = new IntersectionObserver(
  async ([entry], observer) => {
    if (entry.isIntersecting) {
      const { hits, totalHits } = await imagesApi.fetchImages();
      createImagesBox(hits);
      observer.unobserve(entry.target);
      lastImg = document.querySelector('.simplelightbox-gallery:last-child');
    }
  },
  { threshold: 0.5 }
);
