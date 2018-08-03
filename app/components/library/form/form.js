import $ from 'jquery';
import 'jquery-validation';
import 'inputmask';
import 'jquery.inputmask';

module.exports = (elem) => {
  class Form {
    constructor(selector) {
      this.form = $(selector);
      this.numericField = this.form.find('.js-numeric-input');
      this.phoneField = this.form.find('.js-phone-masked');
      this.mailField = this.form.find('.js-mail-masked');
      this.bankCardNumber = this.form.find('.js-card-masked');
      this.bankCardCode = this.form.find('.js-cvv-masked');
      this.bankCardPeriod = this.form.find('.js-period-masked');
      this.transferAmount = this.form.find('.js-transfer-amount');
      this.courseAmount = this.form.find('.js-course-input');

      this.driveLicense = this.form.find('.js-license-masked');

      this.nameField = this.form.find('.js-fio-masked');

      this.init();
      this.maskFields();
      // this.formEvents();
      this.blockEvents(); // Обработчик событий не свзяанных непосредственно с работой формы

      this.validateMethods();
      this.validateForm();
    }

    init() {
      this.validateRules = {
        'js-card-masked': {
          required: true,
          checkCardNumber: true,
        },
        'js-cvv-masked': {
          required: true,
          checkCardCVV: 3,
        },
        'js-period-masked': {
          required: true,
          checkCardPeriod: 5,
        },
        'js-transfer-input': {
          checkTransferAmount: true,
        },
        'js-license-masked': {
          minlength: 12,
        },
        'js-fix-course': {
          checkCourseAmount: true,
        },
        'js-fio-masked': {
          fullname: {
            required: true,
          },
        },
      };
    }

    maskFields() {
      this.numericField.inputmask('numeric', {
        placeholder: ' ',
        groupSeparator: ' ',
        radixPoint: ',',
        autoGroup: true,
        clearMaskOnLostFocus: true,
        removeMaskOnSubmit: true,
        rightAlign: false,
      });

      this.bankCardNumber.inputmask({
        mask: '9999 9999 9999 9999 [999]',
        placeholder: '',
        greedy: false,
        showMaskOnHover: false,
      });

      this.bankCardCode.inputmask({
        mask: '9{3}',
        placeholder: ' ',
        showMaskOnHover: false,
      });

      this.bankCardPeriod.inputmask({
        mask: 'M/Y',
        placeholder: ' ',
        showMaskOnHover: false,
        definitions: {
          "M": {
            validator: function (chrs, buffer, pos, strict, opts) {
              var valExp = new RegExp("0[1-9]|1[0-2]");
              return valExp.test(chrs);
            },
            cardinality: 2,
            prevalidator: [
              {validator: "[01]", cardinality: 1},
              {validator: "0[1-9]", cardinality: 2},
              {validator: "1[012]", cardinality: 2},
            ]
          },
          "Y": {
            validator: function (chrs, buffer, pos, strict, opts) {
              var valExp2 = new RegExp("1[8-9]|[2-9][0-9]");
              return valExp2.test(chrs);
            },
            cardinality: 2,
            // prevalidator: [
            //   {validator: "[0-3]", cardinality: 1},
            //   {validator: "0[1-9]", cardinality: 2},
            //   {validator: "(1|2)[0-9]", cardinality: 2},
            //   {validator: "3[01]", cardinality: 2},
            // ]
          },
        }
      });

      this.nameField.inputmask({
        mask: '*{4,40}',
        placeholder: '',
        definitions: {
          '*': {
            validator: '[А-я \-]',
          },
        },
      });

      this.driveLicense.inputmask({
        mask: '99 99 999999',
        placeholder: '',
        greedy: false,
        showMaskOnHover: false,
      });

      this.phoneField.inputmask({
        mask: '+7(999) 999-99-99',
        placeholder: ' ',
        showMaskOnHover: false,
      });

      this.mailField.inputmask({
        mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
        showMaskOnHover: false,
        greedy: false,
        placeholder: '',
        onBeforePaste: (pastedValue, opts) => {
          pastedValue = pastedValue.toLowerCase();
          return pastedValue;
        },
        definitions: {
          '*': {
            validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
            casing: "lower"
          }
        }
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

      const courseRadio = $('.js-course-radio');
      const courseInput = $('.js-course-input');
      const courseResultField = $('.js-course-amount');
      const courseCurrencyLabel = courseInput.find('.js-title');
      const courseInputField = courseInput.find('input');
      const courseResult = $('.js-course-result');

      this.currencyType = 'USD';

      let courseRadioField = courseRadio.find('input[type="radio"]:checked');
      let currencyValue = courseRadioField.val();
      let courseAmount = courseInputField.val().replace(',', '.');
      let calculatedAmount = courseAmount * currencyValue;

      courseRadio.on('click', (e) => {
        courseRadioField = $(e.currentTarget).find('input[type="radio"]');
        this.currencyType = $(e.currentTarget).data('currency');
        this.validateForm();
        courseCurrencyLabel.html(this.currencyType);
        if (courseAmount) {
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

      const checkRadio = $('.js-check-radio');

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

    validateForm() {

      const result = this.form.validate({
        focusInvalid: false,
        errorElement: 'div',
        errorClass: 'input__error',
        errorPlacement(error, element) {
          error.appendTo(element.closest('.js-input'));
          error.appendTo(element.closest('.js-dropdown'));
        },
        highlight(element, errorClass, validClass) {
          $(element).parents('.js-input').addClass('state_error');
          $(element).parents('.js-dropdown').addClass('state_error');
        },
        unhighlight(element, errorClass, validClass) {
          $(element).parents('.js-input').removeClass('state_error');
          $(element).parents('.js-dropdown').removeClass('state_error');
        },
        submitHandler(form) {
          console.log('SEND');
          return false;
        },
      });

      $.validator.addClassRules(this.validateRules);

      $.extend($.validator.messages, {
        required: '',
        checkCardNumber: '',
        checkCardCVV: '',
        checkCardPeriod: '',
        checkTransferAmount: 'Не более 75 000 ₽ с учетом комиссии',
        minlength: '',
        checkCourseAmount: 'Сумма не должна превышать 4 000 ' + this.currencyType,
        fullname: 'Укажите Ф.И.О.',
      });
    }

    validateMethods() {
      this.addValidateCardNumber();
      this.addValidateCardCVV();
      this.addValidateCardPeriod();
      this.addValidateTransferAmount();
      this.addValidateCourseAmount();
    }

    addValidateCardNumber() {
      $.validator.addMethod(
        'checkCardNumber',
        (value, element) => {
          const num = value.replace(/ /g, '');
          return num.length === 16 || num.length === 19;
        },
      );
    }

    addValidateCardCVV() {
      $.validator.addMethod(
        'checkCardCVV',
        (value, element) => {
          const num = value.replace(/ /g, '');

          return num.length === 3;
        },
      );
    }

    addValidateCardPeriod() {
      $.validator.addMethod(
        'checkCardPeriod',
        (value, element) => {
          const num = value.replace(/ /g, '');

          return num.length === 5;
        },
      );
    }

    addValidateTransferAmount() {
      $.validator.addMethod(
        'checkTransferAmount',
        (value, element) => {
          const max = parseInt($(element).closest('.js-input').data('max'));
          const commission = parseFloat($(element).closest('.js-input').data('commission'));
          const num = parseFloat(value.replace(/ /g, ''));

          return num * (1 + commission) <= max;
        },
      );
    }

    addValidateCourseAmount() {
      $.validator.addMethod(
        'checkCourseAmount',
        (value, element) => {
          const max = parseInt($(element).closest('.js-input').data('max'));
          const num = parseFloat(value.replace(/ /g, ''));

          return num <= max;
        },
      );
    }
  }

  return new Form(elem);
};
