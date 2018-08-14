import $ from 'jquery';
import 'inputmask';
import 'jquery.inputmask';
import 'jquery-validation';
import 'jquery-validation/dist/additional-methods';


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
      this.validateForm();
    }

    init() {
      this.validateRules = {
        'js-card-masked': {
          checkCardNumber: true,
        },
        'js-cvv-masked': {
          checkCardCVV: 3,
        },
        'js-period-masked': {
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
          M: {
            validator(chrs) {
              const valExp = new RegExp('0[1-9]|1[0-2]');
              return valExp.test(chrs);
            },
            cardinality: 2,
            prevalidator: [
              {
                validator: '[01]',
                cardinality: 1,
              }, {
                validator: '0[1-9]',
                cardinality: 2,
              }, {
                validator: '1[012]',
                cardinality: 2,
              },
            ],
          },
          Y: {
            validator(chrs) {
              const valExp2 = new RegExp('1[8-9]|[2-9][0-9]');
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
        },
      });

      this.nameField.inputmask({
        mask: '*{4,40}',
        placeholder: '',
        definitions: {
          '*': {
            validator: '[А-я]',
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
        mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
        showMaskOnHover: false,
        greedy: false,
        placeholder: '',
        onBeforePaste: pastedValue => pastedValue.toLowerCase(),
        definitions: {
          '*': {
            validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~]",
            casing: 'lower',
          },
        },
      });
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
      const courseInput = $('.js-course-input');
      const courseResultField = $('.js-course-amount');
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

    validateForm() {
      $.validator.addClassRules(this.validateRules);
      $.extend($.validator.messages, {
        required: '',
        minlength: '',
        checkCardNumber: '',
        checkCardCVV: '',
        checkCardPeriod: '',
        checkTransferAmount: 'Не более 75 000 ₽ с учетом комиссии',
        checkCourseAmount: `Сумма не должна превышать 4 000 ${this.currencyType}`,
      });
      this.form.validate({
        focusInvalid: false,
        errorElement: 'div',
        errorClass: 'input__error',
        errorPlacement(error, element) {
          error.appendTo($(element).closest('.js-input'));
          error.appendTo($(element).closest('.js-dropdown'));
        },
        highlight(element) {
          $(element).closest('.js-input').addClass('state_error');
          $(element).closest('.js-dropdown').addClass('state_error');
        },
        unhighlight(element) {
          $(element).closest('.js-input').removeClass('state_error');
          $(element).closest('.js-dropdown').removeClass('state_error');
        },
        submitHandler(form) {
          console.log('SEND');

          form.serializeArray();
          return false;
        },
      });
    }

    static addValidateCardNumber() {
      $.validator.addMethod(
        'checkCardNumber',
        (value) => {
          const num = value.replace(/ /g, '');
          return num.length === 16 || num.length === 19;
        },
      );
    }

    static addValidateCardCVV() {
      $.validator.addMethod(
        'checkCardCVV',
        (value) => {
          const num = value.replace(/ /g, '');

          return num.length === 3;
        },
      );
    }

    static addValidateCardPeriod() {
      $.validator.addMethod(
        'checkCardPeriod',
        (value) => {
          const num = value.replace(/ /g, '');

          return num.length === 5;
        },
      );
    }

    static addValidateTransferAmount() {
      $.validator.addMethod(
        'checkTransferAmount',
        (value, element) => {
          const max = parseInt($(element).closest('.js-input').data('max'), 0);
          const commission = parseFloat($(element).closest('.js-input').data('commission'));
          const num = parseFloat(value.replace(/ /g, ''));

          return num * (1 + commission) <= max;
        },
      );
    }

    static addValidateCourseAmount() {
      $.validator.addMethod(
        'checkCourseAmount',
        (value, element) => {
          // const max = parseInt($(element).closest('.js-input').data('max'), 0);
          // const num = parseFloat(value.replace(/ /g, ''));
          console.log('ELEMENT', element);
          return false;
          // return num <= max;
        },
      );
    }
  }

  return new Form(elem);
};
