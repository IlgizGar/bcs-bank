import $ from 'jquery';

module.exports = (elem) => {
  class Card {
    constructor(selector) {
      this.card = $(selector);

      this.events();
    }

    events() {
      this.card.on('click', (e) => {
        if ($(e.currentTarget).data('href')) {
          window.location.href = $(e.currentTarget).data('href');
        }
      });
    }
  }

  return new Card(elem);
};
