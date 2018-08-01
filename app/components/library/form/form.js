import $ from 'jquery';
import 'jquery-validation';
import 'inputmask';
import 'jquery.inputmask';

module.exports = (elem) => {
  class Form {
    constructor(selector) {
      this.form = $(selector);
      this.numericField = this.form.find('.js-numeric-input');

      this.maskFields();
      // this.formEvents();
      this.blockEvents(); // Обработчик событий не свзяанных непосредственно с работой формы
    }

    maskFields() {
      this.numericField.inputmask('numeric', {
        placeholder: " ",
        groupSeparator: " ",
        radixPoint: ",",
        autoGroup: true,
        clearMaskOnLostFocus: true,
        removeMaskOnSubmit: true,
        rightAlign: false,
      });
    }

    blockEvents() {
      const transferAmountField = $('.js-transfer-input');
      const commInfoBlock = $('.js-commission-info');
      const commResultBlock = $('.js-commission-res');
      const commResultInfo = $('.js-commission-user-amount');
      const commResultField = $('.js-commission-amount');

      transferAmountField.on('keyup', () => {
        if (transferAmountField.val().length) {
          const totalAmount = (parseFloat(transferAmountField.val().replace(/ /g, '').replace(',', '.')) * 1.05).toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
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

      const courseRadio = $('.js-course-radio');
      const courseInput = $('.js-course-input');
      const courseResultField = $('.js-course-amount');
      const courseCurrencyLabel = courseInput.find('.js-title');
      const courseInputField = courseInput.find('input');
      const courseResult = $('.js-course-result');

      let courseRadioField = courseRadio.find('input[type="radio"]:checked');
      let currencyValue = courseRadioField.val();
      let courseAmount = courseInputField.val().replace(',', '.');
      let calculatedAmount = courseAmount * currencyValue;

      courseRadio.on('click', (e) => {
        if (courseAmount) {
          courseRadioField = $(e.currentTarget).find('input[type="radio"]');
          courseCurrencyLabel.html(courseRadioField.data('currency'));
          currencyValue = courseRadioField.val();
          calculatedAmount = courseAmount * currencyValue;
          courseResult.html(parseFloat(calculatedAmount).toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace('.', ','));
          courseResultField.val(calculatedAmount);
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
  }

  return new Form(elem);
};
