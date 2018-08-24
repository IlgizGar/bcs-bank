import $ from 'jquery';
window.$ = $;
require('air-datepicker');

module.exports = (elem) => {
  class Datepicker {
    constructor(selector) {
      this.datepicker = $(selector);

      this.init();
      this.events();
    }

    init() {
      $('.datepicker-here2').datepicker({
        inline: true
      });
    }

    events() {

    }
  }

  return new Datepicker(elem);
};
