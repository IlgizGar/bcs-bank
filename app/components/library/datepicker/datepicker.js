import $ from 'jquery';
window.$ = $;
require('air-datepicker');

module.exports = (elem) => {
  class Datepicker {
    constructor(selector) {
      this.datepicker = $(selector);
      this.datepickerInst = null;
      this.init();
      this.events();
    }

    init() {
      this.datepickerInst = $('.datepicker-news-period').datepicker({
        inline: true,
        range: true,
        onSelect(formattedDate, date, inst) {
          if (date.length === 2) {
            const arDate = formattedDate.split(',');
            global.contexts['news-period'].hideList();
            $(inst.el).prev('.js-context-item').text(`с ${arDate[0]} по ${arDate[1]}`).trigger('click');
            console.log(global.contexts['news-period']);
          }
        }
      }).data('datepicker');

      $('.js-context-item-datepicker').on('click', () => {
        this.datepickerInst.clear();
      })
    }

    getDate(date) {
      return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
    }

    events() {

    }
  }

  return new Datepicker(elem);
};
