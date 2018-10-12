import $ from 'jquery';

export default class Search {
  constructor() {
    this.cardsBlock = $('.js-search');
    this.contentBlock = this.cardsBlock.find('.js-search-cards');
    this.moreButton = this.cardsBlock.find('.js-button[data-see-more]');
    this.apiUrl = this.cardsBlock.data('api');

    this.init();
  }

  init() {
    this.pageLoadHandler();
  }

  getCards() {
    $.ajax({
      url: this.apiUrl,
      data: {
      },
      method: 'GET',
      dataType: 'json',
      success: (e) => {
          this.moreButton.remove();
          e.items.forEach((el) => {
            this.contentBlock.append(this.itemTemplate(el));
          });
      },
    });
  }

  pageLoadHandler() {
    this.moreButton.on('click', () => {
      this.getCards();
    });
  }

  itemTemplate(data) {
    return `<div class="search-card" href="${data.link}">
              <div class="search-card__title">${data.title}</div>
              <div class="search-card__content">${data.content}</div>
            </div>`;
  }
}
