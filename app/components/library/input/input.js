import $ from 'jquery';
// import Slider from 'nouislider';

module.exports = (elem) => {
  class Input {
    constructor(selector) {
      this.input = $(selector);
      this.field = this.input.find('input, textarea');

      this.init();
      this.events();
    }

    init() {
      this.slider = this.input.find('.js-input-slider');
      if (this.slider.length) {
        // Slider.create(this.slider, {
        //   start: [20, 80],
        //   connect: true,
        //   range: {
        //     'min': 0,
        //     'max': 100
        //   }
        // });
        // this.slider.slider();
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
        }
      });

      this.field.on('keyup', () => {
        if (this.field.val().length < 1) {
          this.input.removeClass('state_filled');
        } else if (!this.input.hasClass('state_filled')) {
          this.input.addClass('state_filled');
        }
      });
    }
  }

  return new Input(elem);
};
