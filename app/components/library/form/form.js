import $ from 'jquery';
import 'jquery-validation';
import 'inputmask';
import 'jquery.inputmask';

module.exports = (elem) => {
  class Form {
    constructor(selector) {
      this.form = $(selector);
      this.numericField = this.form.find('.js-numeric-input');

      // this.init();
      this.maskFields();

      this.events();
    }

    // init() {
    //   let self = this;
    // }

    maskFields() {
      this.numericField.inputmask('numeric', {
        placeholder: " ",
        groupSeparator: " ",
        autoGroup: true,
        clearMaskOnLostFocus: true,
        removeMaskOnSubmit: true,
        rightAlign: false,
      });
    }

    events() {



      $('.js-transfer-input').on('keyup', () => {

      });
    }
  }

  return new Form(elem);
};
