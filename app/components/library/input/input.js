import $ from 'jquery';
import 'ion-rangeslider';

module.exports = (elem) => {
  class Input {
    constructor(selector) {
      this.input = $(selector);
      this.field = this.input.find('.js-input-field');
      this.ionSlider = null;
      this.initClass = 'state_init';
      this.focusClass = 'state_focus';
      this.filledClass = 'state_filled';

      this.init();
      this.events();
    }

    init() {
      this.slider = this.input.find('.js-input-slider');
      if (this.slider.length) {
        this.slider.ionRangeSlider({
          type: 'single',
          hide_min_max: false,
          hide_from_to: true,
          min: this.slider.data('min'),
          max: this.slider.data('max'),
          from: this.slider.data('from'),
          step: this.slider.data('step'),
          postfix: this.slider.data('postfix') || '',
          prettify_enabled: true,
          onChange: (data) => {
            this.field.val(data.from);
          },
          onFinish: () => {
            this.field.trigger('change');
          },
          onUpdate: (data) => {
            this.slider.data('min', data.min);
            this.slider.data('max', data.max);
          },
        });
        this.slider[0].ioSlider = this.slider.data('ionRangeSlider');
        this.field.val(this.slider.data('from'));
        this.input.removeClass(this.initClass);
        this.input.addClass(this.filledClass);

        this.ionSlider = this.slider.data('ionRangeSlider');
      }
    }
    stateChange() {
      if (String(this.field.val()).length < 1) {
        if (this.ionSlider === null) {
          this.input.removeClass(this.filledClass);
        }
      } else {
        if (!this.input.hasClass(this.filledClass)) {
          this.input.addClass(this.filledClass);
          this.input.removeClass(this.initClass);
        }
        if (this.ionSlider !== null) {
          this.ionSlider.update({
            from: parseFloat(this.field.val().replace(/ /g, '')),
          });
        }
      }
      if (this.field.attr('readonly')) {
        this.input.addClass('state_readonly');
      }
    }

    events() {
      function triggerInputState(self) {
        if (self.input.hasClass(self.initClass)) {
          self.input.removeClass(self.initClass);
          self.field.focus();
        }
      }

      this.input.find('input').on('focus', () => {
        triggerInputState(this);
        this.input.addClass(this.focusClass);
      });

      this.input.find('input').on('blur', () => {
        this.input.removeClass(this.focusClass);
      });

      this.input.on('click', () => {
        triggerInputState(this);
      });

      this.field.on('blur', () => {
        if (!this.input.hasClass(this.filledClass)) {
          this.input.addClass(this.initClass);
        } else if (this.ionSlider !== null) {
          if (parseFloat(this.field.val().replace(/ /g, '')) > this.slider.data('max')) {
            this.field.val(this.slider.data('max'));
          } else if (parseFloat(this.field.val().replace(/ /g, '')) < this.slider.data('min')) {
            this.field.val(this.slider.data('min'));
          } else if (this.field.val().length < 1) {
            this.field.val(this.slider.data('min'));
          }
          this.ionSlider.update({
            from: parseFloat(this.field.val().replace(/ /g, '')),
          });
        }
      });

      this.field.on('keyup', () => {
        this.stateChange();
      });
      this.stateChange();
    }
  }

  return new Input(elem);
};
