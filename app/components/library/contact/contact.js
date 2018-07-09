import $ from 'jquery';

module.exports = (elem) => {
  class Contact {
    constructor(selector) {
      this.contact = $(selector);
      this.offset = -1;
      this.wrapper = this.contact.closest('.js-fixed-area');

      this.events();
    }

    events() {
      let lastPos = -1;

      $(window).on('scroll', () => {
        if (this.wrapper.offset().top - window.pageYOffset <= 20) {
          if (!this.wrapper.hasClass('state_sticky')) {
            this.wrapper.addClass('state_sticky');
            if (lastPos < 0) lastPos = this.wrapper.offset().top;
          }
        }
        if (window.pageYOffset <= lastPos - 20) {
          if (this.wrapper.hasClass('state_sticky')) {
            this.wrapper.removeClass('state_sticky');
          }
        }
      });
    }
  }

  return new Contact(elem);
};
