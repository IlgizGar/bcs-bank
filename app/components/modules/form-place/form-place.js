import $ from 'jquery';

module.exports = (elem) => {
  class PlaceForm {
    constructor(selector) {
      this.block = $(selector);
      this.checkBox = $('.js-reg-addr');
      this.events();
    }
    events() {
      this.setState(this.checkBox.prop('checked'));
      this.checkBox.on('change', (e) => {
        this.setState($(e.currentTarget).prop('checked'));
      });
    }
    setState(state) {
      if (state) {
        this.block.hide();
      } else {
        this.block.show();
      }
    }
  }

  return new PlaceForm(elem);
};
