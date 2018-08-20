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
      console.log('FILTER_YEAR', year);
      console.log('FILTER_GROUPS', this.groups);
    }
  }

  return new DocumentsFilter(elem);
};
