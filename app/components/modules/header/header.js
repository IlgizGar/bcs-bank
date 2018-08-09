import $ from 'jquery';

module.exports = (elem) => {
  class Header {
    constructor(selector) {
      this.header = $(selector);
      this.contacts = this.header.find('.js-header-contacts');
      this.btnContacts = this.header.find('.js-btn-header-contacts');

      this.events();
    }

    events() {
      this.btnContacts.on('click', (e) => {
        if (!$(e.currentTarget).hasClass('state_active')) {
          $(e.currentTarget).addClass('state_active');
          this.contacts.addClass('state_explored');
          $('main').append('<div class="page__cover js-cover"></div>');
        } else {
          $(e.currentTarget).removeClass('state_active');
          this.contacts.removeClass('state_explored');
          $('main').find('.js-cover').remove();
        }
      });

      $(window).on('click', (e) => {
        if ($(e.target).closest('.js-cover').length) {
          this.btnContacts.removeClass('state_active');
          this.contacts.removeClass('state_explored');
          $(e.target).remove();
        }
      });

      // $('body').on('keypress', (e) => {
      //   console.log('BUT', e.which());
      // });
    }
  }

  return new Header(elem);
};
