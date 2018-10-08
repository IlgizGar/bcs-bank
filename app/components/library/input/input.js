import $ from 'jquery';
import 'ion-rangeslider';

module.exports = (elem) => {
  class Input {
    constructor(selector) {
      this.input = $(selector);
      this.field = this.input.find('.js-input-field');
      this.ionSlider = null;

      this.init();
      this.events();
    }

    init() {
      this.slider = this.input.find('.js-input-slider');
      if (this.slider.length) {
        this.slider.ionRangeSlider({
          type: 'single',
          min: this.slider.data('min'),
          max: this.slider.data('max'),
          from: this.slider.data('from'),
          step: this.slider.data('step'),
          prettify_enabled: true,
          onChange: (data) => {
            this.field.val(data.from);
          }
        });
        this.field.val(this.slider.data('from'));
        this.input.removeClass('state_init');
        this.input.addClass('state_filled');

        this.ionSlider = this.slider.data('ionRangeSlider');
      }
    }

    events() {
      this.input.on('click', () => {
        if (this.input.hasClass('state_init')) {
          this.input.removeClass('state_init');
          this.field.focus();
        }
      });

      this.field.on('blur', () => {
        if (!this.input.hasClass('state_filled')) {
          this.input.addClass('state_init');
        } else {
          if (this.field.val().length < 1) {
            if (this.ionSlider !== null) {
              this.field.val(this.slider.attr('data-from'));
              this.ionSlider.update({from: this.slider.attr('data-from')})
            }
          }
        }
      });

      this.field.on('keyup', () => {

        if (this.field.val().length < 1) {
          if (this.ionSlider === null) {
            this.input.removeClass('state_filled');
          }
        } else {
          if (!this.input.hasClass('state_filled')) {
            this.input.addClass('state_filled');
          }

          if (this.ionSlider !== null) {
            if (parseFloat(this.field.val().replace(/ /g, '')) > this.slider.data('max')) {
              this.field.val(this.slider.data('max'));
            }
            if (parseFloat(this.field.val().replace(/ /g, '')) < this.slider.data('min')) {
              this.field.val(this.slider.data('min'));
            }
            this.ionSlider.update({
              from: parseFloat(this.field.val().replace(/ /g, ''))
            });
          }
        }
      });
    }
  }

  return new Input(elem);
};
