const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '27754305-6c0117069a54d6a4ab2d99661';

export default class ImagesApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  fetchImages() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: this.per_page,
    });

    const URL = `${BASE_URL}?${params}`;

    return axios
      .get(URL)
      .then(({ data }) => {
        console.log(data);
        return data;
      })
      .then(({ hits, totalHits }) => {
        this.incrementPage();
        // if (!totalHits) {
        //   Notify.failure(
        //     'Sorry, there are no images matching your search query. Please try again.'
        //   );
        // } else {
        //   console.log(totalHits);
        return { hits, totalHits };
        // }
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
