import $ from 'jquery';

module.exports = (elem) => {
  class Accordion {
    constructor(selector) {
      this.accordion = $(selector);

      this.init();
      this.events();
    }

    init() {
      console.log('INITED');
      this.accordion.accordion();
    }

    events() {

    }
  }

  return new Accordion(elem);
};
