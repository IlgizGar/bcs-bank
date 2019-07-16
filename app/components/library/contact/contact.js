import $ from 'jquery';
import sticky from 'stickyfilljs';

module.exports = (elem) => {
  class Contact {
    constructor(selector) {
      this.contact = $(selector);
      // this.offset = -1;
      this.sticky = this.contact.closest('.js-sticky');
      this.init();
    }

    init() {
      sticky.add(this.sticky);
    }
  }

  return new Contact(elem);
};
