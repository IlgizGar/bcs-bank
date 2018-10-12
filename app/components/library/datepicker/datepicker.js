import $ from 'jquery';

window.$ = $;
require('air-datepicker');

module.exports = (elem) => {
  class Datepicker {
    constructor(selector) {
      this.el = $(selector);
      this.datepickerInst = null;
    }

    init() {
      this.datepickerInst = this.el.datepicker({
        inline: true,
        range: true,
      }).data('datepicker');

      $('.js-context-item-datepicker').on('click', () => {
        this.datepickerInst.clear();
      });
    }

    static getDate(date) {
      return `${Datepicker.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
    }
  }

  return new Datepicker(elem);
};
