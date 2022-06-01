export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.button = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const button = document.querySelector(selector);

    return button;
  }

  show() {
    this.button.classList.remove('is-hidden');
  }

  hide() {
    this.button.classList.add('is-hidden');
  }
}
