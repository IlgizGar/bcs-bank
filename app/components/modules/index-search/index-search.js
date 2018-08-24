import $ from 'jquery';

module.exports = (elem) => {
  class IndexSearch {
    constructor(selector) {
      this.search = $(selector);
      this.form = this.search.find('form');
      this.submit = this.search.find('.js-search-submit');
      this.input = this.search.find('input');
      this.label = this.search.find('.js-search-label');
      this.close = this.search.find('.js-search-close');

      this.$btnContacts = $('.js-btn-header-contacts');
      this.$btnOffices = $('.js-btn-header-offices');

      this.events();
    }

    events() {
      this.submit.on('click', (e) => {
        e.preventDefault();
        if (!this.search.hasClass('state_explored')) {
          this.search.addClass('state_explored');
          this.submit.attr('type', 'submit');
          this.search.parent().find('.navbar__button').addClass('state_hidden');
        } else {
          this.form.submit();
        }
      });

      this.input.on('click', () => {
        this.label.addClass('state_hidden');
      });

      this.input.on('blur', () => {
        if (!this.input.val().length) {
          this.label.removeClass('state_hidden');
        }
      });

      this.close.on('click', () => {
        if (this.input.val().length) {
          this.input.val('');
          this.label.removeClass('state_hidden');
        } else {
          this.search.removeClass('state_explored');
          // this.label.addClass('state_hidden');
          setTimeout(() => {
            this.search.parent().find('.navbar__button').removeClass('state_hidden');
          }, 300);
        }
      });
    }
  }

  return new IndexSearch(elem);
};
