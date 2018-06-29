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
        } else {
          $(e.currentTarget).removeClass('state_active');
          this.contacts.removeClass('state_explored');
        }
      });
    }
  }

  return new Header(elem);
};
