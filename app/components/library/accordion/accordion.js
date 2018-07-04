import $ from 'jquery';

module.exports = (elem) => {
  class Accordion {
    constructor(selector) {
      this.accordion = $(selector);

      // this.init();
      // this.events();
    }
  }

  return new Accordion(elem);
};
