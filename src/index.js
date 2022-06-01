import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApi from './api';
import LoadMoreBtn from './load-more-btn';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

const imagesApi = new ImagesApi();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

searchFormRef.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', fetchImages);

function onSearch(evt) {
  evt.preventDefault();

  imagesApi.query = evt.currentTarget.elements.searchQuery.value;

  if (imagesApi.query === '') {
    return Notify.failure('Enter something');
  }

  loadMoreBtn.hide();

  imagesApi.resetPage();
  clearImagesBox();
  fetchImages();
}

function fetchImages() {
  imagesApi.fetchImages().then(({ hits, totalHits }) => {
    if (totalHits > 1000) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createImagesBox(hits);
      loadMoreBtn.show();
    }
  });
}

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
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
</div>`;
      }
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}
