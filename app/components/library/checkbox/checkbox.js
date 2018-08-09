import $ from 'jquery';

module.exports = (elem) => {
  class Checkbox {
    constructor(selector) {
      this.checkbox = $(selector);
      this.field = this.checkbox.find('input[type="checkbox"]');

      this.events();
    }

    events() {
      this.checkbox.on('click', () => {
        if (this.checkbox.hasClass('js-personal-checkbox')) {
          const $form = this.checkbox.closest('.js-form');
          const $submit = $form.find('button[type="submit"]');

          if (this.field.prop('checked')) {
            $submit.prop('disabled', false);
          } else {
            $submit.prop('disabled', true);
          }
        }
      });
    }
  }

  return new Checkbox(elem);
};
