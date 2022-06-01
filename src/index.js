import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApi from './api';
import LoadMoreBtn from './load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

  console.log(loadMoreBtn.hide() === true);

  imagesApi.resetPage();
  clearImagesBox();

  fetchImages();
}

// Куди це повідомлення?: Notify.success(`Hooray! We found ${totalHits} images.`);

function fetchImages() {
  imagesApi.fetchImages().then(({ hits, totalHits }) => {
    if (!totalHits) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createImagesBox(hits);
      loadMoreBtn.show();

      makeSimpleLightboxGallery();

      // Як має працювати прокрутка? (зверху вниз чи навпаки?) Якщо знизу, то треба створити кнопку?
      smoothScrolling('.container');
    }
  });
}

function makeSimpleLightboxGallery() {
  let simpleLightboxGallery = new SimpleLightbox('.gallery a');
  simpleLightboxGallery.refresh();
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
        return `<a class="simplelightbox-gallery" href="${largeImageURL}"
  ><div class="photo-card">
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
  </div></a
>`;
      }
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function smoothScrolling(selector) {
  const { height: cardHeight } = document
    .querySelector(selector)
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
