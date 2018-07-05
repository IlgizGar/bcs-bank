import $ from 'jquery';
import 'datepicker';

module.exports = (elem) => {
  class Datepicker {
    constructor(selector) {
      this.datepicker = $(selector);

      this.init();
      this.events();
    }

    init() {
      // this.cdatepicker.datepicker({});
    }

    events() {

    }
  }

  return new Datepicker(elem);
};
