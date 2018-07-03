import $ from 'jquery';

module.exports = (elem) => {
  class Contact {
    constructor(selector) {
      this.contact = $(selector);
      this.offset = -1;

      this.events();
    }

    events() {
      let lastPos = -1;

      $(window).on('scroll', () => {
        if (this.contact.offset().top - window.pageYOffset <= 20) {
          if (!this.contact.hasClass('state_sticky')) {
            this.contact.addClass('state_sticky');
            if (lastPos < 0) lastPos = this.contact.offset().top;
          }
        }
        if (window.pageYOffset <= lastPos - 20) {
          if (this.contact.hasClass('state_sticky')) {
            this.contact.removeClass('state_sticky');
          }
        }
      });
    }
  }

  return new Contact(elem);
};
