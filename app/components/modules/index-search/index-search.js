import $ from 'jquery';

module.exports = (elem) => {
  class IndexSearch {
    constructor(selector) {
      this.search = $(selector);
      this.submit = this.search.find('.js-search-submit');

      this.events();
    }

    events() {
      this.submit.on('click', (e) => {
        e.preventDefault();

        if (this.search.hasClass('state_explored')) {
          this.search.removeClass('state_explored');
        } else {
          this.search.addClass('state_explored');
        }
      });
    }
  }

  return new IndexSearch(elem);
};
