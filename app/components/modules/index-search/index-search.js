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
      this.exploredClass = 'state_explored';
      this.hiddenClass = 'state_hidden';

      this.$btnContacts = $('.js-btn-header-contacts');
      this.$btnOffices = $('.js-btn-header-offices');

      this.events();
    }

    events() {
      this.submit.on('click', (e) => {
        e.preventDefault();
        if (!this.search.hasClass(this.exploredClass)) {
          this.input.focus();
          this.search.addClass(this.exploredClass);
          this.submit.attr('type', 'submit');
          this.search.parent().find('.navbar__button').addClass(this.hiddenClass);
        } else {
          const queryString = `/search?searchid=160570&text=${encodeURIComponent(this.input.val())}&web=0#`;
          if (this.input.val()) {
            window.location.href = queryString;
          }
          // this.form.submit();
        }
      });

      this.input.on('click', () => {
        this.label.addClass(this.hiddenClass);
      });
      this.input.on('focus', () => {
        this.label.addClass(this.hiddenClass);
      });

      this.input.on('blur', () => {
        if (!this.input.val().length) {
          this.label.removeClass(this.hiddenClass);
        }
      });

      this.close.on('click', (e) => {
        e.preventDefault();
        this.input.val('');
        this.label.removeClass(this.hiddenClass);
        this.search.removeClass('state_explored');
        setTimeout(() => {
          this.search.parent().find('.navbar__button').removeClass(this.hiddenClass);
        }, 300);
      });
    }
  }

  return new IndexSearch(elem);
};
