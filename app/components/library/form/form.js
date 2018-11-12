import $ from 'jquery';
import 'jquery-validation';
import Validator from './validator';

module.exports = (elem) => {
  class Form {
    constructor(selector) {
      this.form = $(selector);
      this.validator = Validator(this.form);
      this.msgSucess = this.form.closest('.js-form').find('.js-form-success');
      this.msgError = this.form.closest('.js-form').find('.js-form-error');

      this.validateForm();
      this.blockEvents(); // Обработчик событий не свзяанных непосредственно с работой формы
      this.events();
    }

    events() {
      if (this.form.closest('.modal').length) {
        this.form.closest('.modal').on($.modal.BEFORE_CLOSE, () => {
          // if (this.msgError.hasClass('state_hidden') || this.msgSucess.hasClass('state_hidden')) {
          //   this.form.find('.js-input').each((el) => {
          //     $(el).removeClass('state_filled');
          //   });
          //   this.form.removeClass('state_hidden');
          //   this.msgError.addClass('state_hidden');
          //   this.msgSucess.addClass('state_hidden');
          // }
        });
      }
    }

    validateForm() {
      const submitHandler = (form) => {
        if (form.getAttribute('data-fix-course') !== undefined) {
          const redirectUrl = `${form.getAttribute('action')}?partner=bcs-bank&operation=${form.querySelector('.radio__field:checked').id.match(/buy|sell/g)}&amount=${form.querySelector('.js-course-input').value.replace(' ', '')}&currency=${form.querySelector('.js-course-field .js-title').innerText}`;
          document.location.href = redirectUrl;
        }
      };

      this.validator.validateForm(submitHandler);
    }

    blockEvents() {
      const transferAmountField = $('.js-transfer-input');
      const commInfoBlock = $('.js-commission-info');
      const commResultBlock = $('.js-commission-res');
      const commResultInfo = $('.js-commission-user-amount');
      const commResultField = $('.js-commission-amount');
      if (transferAmountField.length) {
        transferAmountField.on('keyup', () => {
          if (transferAmountField.val().length) {
            const totalAmount = (parseFloat(transferAmountField.val().replace(/ /g, '').replace(',', '.')) * (1 + transferAmountField.closest('.js-input').data('commission'))).toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            commInfoBlock.addClass('state_hidden');
            commResultBlock.removeClass('state_hidden');
            commResultInfo.html(totalAmount.replace('.', ','));
            commResultField.val(totalAmount);
          } else {
            commInfoBlock.removeClass('state_hidden');
            commResultBlock.addClass('state_hidden');
            commResultInfo.html('0');
            commResultField.val(0);
          }
        });
      }

      const courseRadio = $('.js-course-radio');
      const courseInput = $('.js-course-field');
      const courseResultField = $('.js-course-result-field');
      const courseCurrencyLabel = courseInput.find('.js-title');
      const courseInputField = courseInput.find('input');
      const courseResult = $('.js-course-result');

      this.currencyType = 'USD';

      if (courseInput.length) {
        let courseRadioField = courseRadio.find('input[type="radio"]:checked');
        let currencyValue = courseRadioField.val();
        let courseAmount = courseInputField.val().replace(',', '.');
        let calculatedAmount = courseAmount * currencyValue;
        courseRadio.on('click', (e) => {
          courseRadioField = $(e.currentTarget).find('input[type="radio"]');
          this.currencyType = $(e.currentTarget).data('currency');
          courseCurrencyLabel.html(this.currencyType);
          if (courseAmount) {
            currencyValue = courseRadioField.val();
            calculatedAmount = courseAmount * currencyValue;
            courseResult.html(parseFloat(calculatedAmount).toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace('.', ','));
            courseResultField.val(calculatedAmount);
            courseInputField.valid();
          }
        });
        courseInputField.on('keyup', (e) => {
          if ($(e.target).val().length) {
            courseAmount = parseFloat(courseInputField.val().replace(/ /g, '').replace(',', '.'));
            calculatedAmount = courseAmount * currencyValue;
            courseResult.html(parseFloat(calculatedAmount).toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace('.', ','));
            courseResultField.val(calculatedAmount);
          } else {
            courseResult.html('0');
            courseAmount = 0;
          }
        });
      }

      const checkRadio = $('.js-check-radio');
      if (checkRadio.length) {
        checkRadio.on('click', (e) => {
          if ($(e.currentTarget).data('check') === 'vu') {
            $('.js-check-vu').removeClass('state_hidden');
            $('.js-check-post').addClass('state_hidden');
          } else {
            $('.js-check-vu').addClass('state_hidden');
            $('.js-check-post').removeClass('state_hidden');
          }
        });
      }
    }
  }

  return new Form(elem);
};
