import $ from 'jquery';
import 'jquery-validation/dist/additional-methods';
import 'jquery-validation';
import 'inputmask';
import 'jquery.inputmask';
import 'suggestions-jquery';

module.exports = (form) => {
  class Validator {
    constructor(selector) {
      this.form = $(selector);

      this.validateRules = {
        'js-fio-masked': {
          minlength: 3,
          checkFio: true,
        },
        'js-course-input': {
          checkCourseAmount: true,
        },
        'js-license-masked': {
          minlength: 12,
        },
        'js-card-masked': {
          checkCardNumber: true,
        },
        'js-cvv-masked': {
          minlength: 3,
        },
        'js-period-masked': {
          minlength: 5,
        },
        'js-transfer-input': {
          checkTransferAmount: true,
        },
        'js-phone-masked': {
          minPhoneLength: true,
        },
        'js-mail-masked': {
          checkEmail: true,
        },
        'js-question-textarea': {},
        'js-question-topic': {},
        'js-city-select': {},
        'js-aims-select': {},
      };

      this.validateMessages = {
        'js-phone-masked': {
          required: 'Укажите номер телефона',
          minPhoneLength: '',
        },
        'js-sms-code-input': {
          required: 'Укажите код из sms',
        },
        'js-fio-masked': {
          required: 'Укажите Ф.И.О.',
          minlength: '',
        },
        'js-course-input': {
          required: '',
          checkCourseAmount: () => {
            const $activeRadio = this.form.find('.js-course-radio input[type="radio"]:checked');
            const currency = $activeRadio.closest('.js-course-radio').data('currency');
            return `Сумма не должна превышать ${this.form.find('.js-course-input').closest('.js-input').data('max')} ${currency}`;
          },
        },
        'js-license-masked': {
          required: '',
          minlength: '',
        },
        'js-card-masked': {
          required: '',
          checkCardNumber: '',
        },
        'js-cvv-masked': {
          required: '',
          minlength: '',
        },
        'js-period-masked': {
          required: '',
          minlength: '',
        },
        'js-transfer-input': {
          required: '',
          checkTransferAmount: () => {
            const max = this.form.find('.js-transfer-input').closest('.js-input').data('max');
            return `Не более ${max} ₽ с учетом комиссии`;
          },
        },
        'js-mail-masked': {
          required: 'Введите электронную почту',
        },
        'js-question-textarea': {
          required: 'Введите текст вопроса',
        },
        'js-question-topic': {
          required: 'Выберите тему',
        },
        'js-city-select': {
          required: 'Укажите Ваш город',
        },
        'js-aims-select': {
          required: 'Укажите цель кредита',
        },
      };

      Validator.setValidateRules();
      Validator.setFieldMask();
    }

    setFieldMessages() {
      const formMessages = {};
      Object.keys(this.validateMessages).forEach((key) => {
        if (this.form.find(`.${key}`).length) {
          this.form.find(`.${key}`).each((i, el) => {
            formMessages[$(el).attr('name')] = this.validateMessages[key];
          });
        }
      });
      return formMessages;
    }

    static setFieldMask() {
      // $('.js-mail-masked').inputmask({
      //   mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
      //   showMaskOnHover: false,
      //   greedy: false,
      //   placeholder: '',
      //   onBeforePaste: pastedValue => pastedValue.toLowerCase(),
      //   definitions: {
      //     '*': {
      //       validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~]",
      //       casing: 'lower',
      //     },
      //   },
      // });

      $('.js-phone-masked').inputmask({
        mask: '+7(999) 999-99-99',
        placeholder: ' ',
        showMaskOnHover: false,
      });

      // $('.js-fio-masked').inputmask({
      //   mask: '*{4,40}',
      //   placeholder: '',
      // });

      $('.js-numeric-input').inputmask('numeric', {
        placeholder: ' ',
        groupSeparator: ' ',
        radixPoint: ',',
        autoGroup: true,
        clearMaskOnLostFocus: true,
        removeMaskOnSubmit: true,
        rightAlign: false,
      });

      $('.js-digit-input').inputmask('numeric', {
        placeholder: ' ',
        groupSeparator: ' ',
        radixPoint: ',',
        autoGroup: false,
        clearMaskOnLostFocus: true,
        removeMaskOnSubmit: true,
        rightAlign: false,
      });

      $('.js-license-masked').inputmask({
        mask: '99 99 999999',
        placeholder: '',
        greedy: false,
        showMaskOnHover: false,
      });

      $('.js-card-masked').inputmask({
        mask: '9999 9999 9999 9999 [999]',
        placeholder: '',
        greedy: false,
        showMaskOnHover: false,
      });

      $('.js-period-masked').inputmask({
        mask: 'M/Y',
        placeholder: '',
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
    }

    static setValidateRules() {
      Validator.addValidateCourseAmount();
      Validator.addValidateCardNumber();
      Validator.addValidateTransferAmount();
      Validator.addValidatePhoneLength();
      Validator.addValidateFio();
      Validator.addValidateEmail();
    }

    static addValidateFio() {
      $('.js-fio-auto-complete').suggestions({
        serviceUrl: 'https://api.bcs.ru/suggestion/v1',
        token: '574fec4e42aa48a2ac22841a3f6def1d',
        type: 'NAME',
        count: 5,
        mobileWidth: 0,
      });
      $('.js-fio-masked').on('keyup', (e) => {
        const input = $(e.currentTarget);
        input.val(Validator.autoLayoutKeyboard(input.val()));
      });
      $.validator.addMethod(
        'checkFio',
        (value) => {
          const regExp = new RegExp('([А-ЯЁ][а-яё]+[\\-\\s]?){3,}');
          console.log(String(value).match(regExp));
          return String(value).match(regExp);
        },
        'Ведите Фамилию Имя Отчество',
      );
    }

    static autoLayoutKeyboard(str) {
      const replacerString = `{
        "q":"й", "w" : "ц", "e":"у", "r":"к", "t":"е", "y":"н", "u":"г",
        "i":"ш", "o":"щ", "p":"з", "[":"х", "]":"ъ", "a":"ф", "s":"ы",
        "d":"в", "f":"а", "g":"п", "h":"р", "j":"о", "k":"л", "l":"д",
        ";":"ж", "'":"э", "z":"я", "x":"ч", "c":"с", "v":"м", "b":"и",
        "n":"т", "m":"ь", ",":"б", ".":"ю", "/":"."
      }`;
      const replacer = JSON.parse(replacerString);
      return str.replace(/[A-z/,.;'\][]/g, x => (x === x.toLowerCase() ? replacer[x] : replacer[x.toLowerCase()].toUpperCase()));
    }

    static addValidateCourseAmount() {
      $.validator.addMethod(
        'checkCourseAmount',
        (value, element) => {
          const max = parseInt($(element).closest('.js-input').data('max'), 0);
          const num = parseFloat(value.replace(/ /g, ''));
          return num <= max;
        },
      );
    }
    static addValidateEmail() {
      $.validator.addMethod(
        'checkEmail',
        (value) => {
          const regExp = new RegExp('^[A-Za-zА-я0-9][A-Za-zА-я0-9\\.-_]*[A-Za-z0-9]*@([A-Za-zА-я0-9]+([A-Za-zА-я0-9-]*[A-Za-zА-я0-9]+)*\\.)+[A-ZА-яa-z]*$');
          console.log(String(value).match(regExp));
          return String(value).match(regExp);
        },
        'Неверный email',
      );
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

    static addValidatePhoneLength() {
      $.validator.addMethod(
        'minPhoneLength',
        (value, element) => {
          const len = $(element).val().replace(/ /g, '').length;
          return len === 16;
        },
      );
    }

    validateForm(handler) {
      $.validator.addClassRules(this.validateRules);
      return this.form.validate({
        focusInvalid: false,
        errorElement: 'div',
        errorClass: 'input__error',
        messages: this.setFieldMessages(),
        errorPlacement(error, element) {
          if ($(element).closest('.js-input').length) {
            error.appendTo($(element).closest('.js-input'));
          }
          if ($(element).closest('.js-dropdown').length) {
            error.appendTo($(element).closest('.js-dropdown'));
          }
          if ($('.js-sms-code-form-counter').length) {
            $('.js-sms-code-form-counter').addClass('state_form_error');
          }
        },
        highlight(element) {
          if ($(element).closest('.js-input').length) {
            $(element).closest('.js-input').addClass('state_error');
          }
          if ($(element).closest('.js-dropdown').length) {
            $(element).closest('.js-dropdown').addClass('state_error');
          }
          if ($('.js-sms-code-form-counter').length) {
            $('.js-sms-code-form-counter').addClass('state_form_error');
          }
        },
        unhighlight(element) {
          if ($(element).closest('.js-input').length) {
            $(element).closest('.js-input').removeClass('state_error');
          }
          if ($(element).closest('.js-dropdown').length) {
            $(element).closest('.js-dropdown').removeClass('state_error');
          }
          if ($('.js-sms-code-form-counter').length) {
            $('.js-sms-code-form-counter').removeClass('state_form_error');
          }
        },
        submitHandler: handler,
      });
    }
  }

  return new Validator(form);
};
