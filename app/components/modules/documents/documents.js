import $ from 'jquery';

module.exports = (elem) => {
  class DocumentsFilter {
    constructor(selector) {
      this.filter = $(selector);
      this.groups = $('.js-documents-group');

      this.init();
    }

    init() {
      this.applyFilter(this.filter.find('option:selected').val());
    }

    applyFilter(year) {
      this.groups.each((i, el) => {
        const $docs = $(el).find('[data-documents-year]');
        const $actual = $(el).find(`[data-documents-year="${year}"]`);
        if (year.length) {
          $docs.addClass('state_hidden');
          if ($actual.length) {
            $(el).removeClass('state_hidden');
            $actual.removeClass('state_hidden');
          } else {
            $(el).addClass('state_hidden');
          }
        } else {
          $(el).removeClass('state_hidden');
          $docs.removeClass('state_hidden');
        }
      });
    }
  }

  return new DocumentsFilter(elem);
};
