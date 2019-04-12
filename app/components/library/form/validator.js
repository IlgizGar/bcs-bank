import $ from 'jquery';
import 'jquery-validation/dist/additional-methods';
import 'jquery-validation';
import 'inputmask';
import 'jquery.inputmask';
import 'suggestions-jquery';

module.exports = (form) => {
  class Validator {
    constructor(selector) {
      this.scrollTimout = null;

      this.form = $(selector);

      const formOffset = this.form.offset() ? this.form.offset() : document.body.clientHeight;

      this.errorElementPos = formOffset.top + $(selector)
        .height();

      this.validateRules = {
        'js-fio-masked': {
          minlength: 3,
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
        'js-date': {},
        'js-snils': {},
        'js-kladr-inline-input': {
          checkAddress: true,
        },
      };

      $.validator.messages.required = 'Поле не может быть пустым';

      this.validateMessages = {
        'js-phone-masked': {
          required: 'Укажите номер телефона',
          minPhoneLength: '',
        },
        'js-snils': {
          required: 'Укажите СНИЛС',
        },
        'js-date': {
          required: 'Укажите дату',
        },
        'js-sms-code-input': {
          required: 'Укажите код из sms',
        },
        'js-fio-masked': {
          required: 'Укажите Ф.И.О.',
          minlength: '',
        },
        'js-pass-serial': {
          required: 'Укажите серию',
        },
        'js-pass-num': {
          required: 'Укажите номер',
        },
        'js-course-input': {
          required: '',
          checkCourseAmount: () => {
            const $activeRadio = this.form.find('.js-course-radio input[type="radio"]:checked');
            const currency = $activeRadio.closest('.js-course-radio')
              .data('currency');
            return `Сумма не должна превышать ${this.form.find('.js-course-input')
              .closest('.js-input')
              .data('max')} ${currency}`;
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
            const max = this.form.find('.js-transfer-input')
              .closest('.js-input')
              .data('max');
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
      Object.keys(this.validateMessages)
        .forEach((key) => {
          if (this.form.find(`.${key}`).length) {
            this.form.find(`.${key}`)
              .each((i, el) => {
                formMessages[$(el)
                  .attr('name')] = this.validateMessages[key];
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

      $('.js-phone-masked')
        .inputmask({
          mask: '+7(999) 999-99-99',
          placeholder: ' ',
          showMaskOnHover: false,
        });
      $('.js-pass-serial')
        .inputmask({
          mask: '99 99',
          placeholder: ' ',
          showMaskOnHover: false,
        });

      $('.js-pass-num')
        .inputmask({
          mask: '999999',
          placeholder: ' ',
          showMaskOnHover: false,
        });

      $('.js-date')
        .inputmask({
          mask: '99.99.9999',
          placeholder: ' ',
          showMaskOnHover: false,
        });

      $('.js-provider-code')
        .inputmask({
          mask: '999-999',
          placeholder: ' ',
          showMaskOnHover: false,
        });
      // $('.js-fio-masked').inputmask({
      //   mask: '*{4,40}',
      //   placeholder: '',
      // });

      $('.js-numeric-input')
        .inputmask('numeric', {
          placeholder: ' ',
          groupSeparator: ' ',
          radixPoint: ',',
          autoGroup: true,
          clearMaskOnLostFocus: true,
          removeMaskOnSubmit: true,
          rightAlign: false,
          allowPlus: false,
          allowMinus: false,
        });

      $('.js-numeric-input').on('keydown', (e) => {
        if ($(e.currentTarget).val() === '-') {
          $(e.currentTarget).val('');
        }
      });

      $('.js-digit-input')
        .inputmask('numeric', {
          placeholder: ' ',
          groupSeparator: ' ',
          radixPoint: ',',
          autoGroup: false,
          clearMaskOnLostFocus: true,
          removeMaskOnSubmit: true,
          rightAlign: false,
        });

      $('.js-license-masked')
        .inputmask({
          mask: '99 99 999999',
          placeholder: '',
          greedy: false,
          showMaskOnHover: false,
        });

      $('.js-card-masked')
        .inputmask({
          mask: '9999 9999 9999 9999 [999]',
          placeholder: '',
          greedy: false,
          showMaskOnHover: false,
        });

      $('.js-period-masked')
        .inputmask({
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
      Validator.addValidateAddress();
      // Validator.addValidateDate();
      // Validator.addValidateSnils();


      $('.js-en-letters')
        .on('keyup', (e) => {
          const input = $(e.currentTarget);
          input.val(Validator.autoLayoutLatinKeyboard(input.val()));
        });
    }

    static addValidateAddress() {
      let errorMessage = '';
      let valid = true;

      $('.js-kladr-inline-input').each((index, element) => {
        let flatInput = $(`[data-adress-input="${$(element).attr('name')}"]`);
        if (flatInput.find('.js-input-field').length) {
          flatInput = flatInput.find('.js-input-field');
        }
        $(element)
          .suggestions({
            serviceUrl: 'https://api.bcs.ru/kladr/v3',
            token: '574fec4e42aa48a2ac22841a3f6def1d',
            type: 'ADDRESS',
            autoSelectFirst: true,
            hint: false,
            mobileWidth: 420,
            geoLocation: true,
            onSelect: (suggestion) => {
              valid = true;
              if (!suggestion.data.city && !suggestion.data.settlement) {
                errorMessage = 'Введите название населенного пункта';
                valid = false;
              } else if (!suggestion.data.settlement && !suggestion.data.street) {
                errorMessage = 'Необходимо указать улицу';
                valid = false;
              } else if (!suggestion.data.house) {
                errorMessage = 'Нужно указать номер дома';
                valid = false;
              } else {
                errorMessage = '';
              }
              if (suggestion.data.flat) {
                flatInput.val(suggestion.data.flat);
                flatInput.trigger('keyup');
              }
            },
          });
      });


      $.validator.addMethod('checkAddress', () => {
        $.validator.messages.checkAddress = errorMessage;
        return valid;
      }, errorMessage);
    }

    static addValidateFio() {
      $('.js-fio-auto-complete')
        .suggestions({
          serviceUrl: 'https://api.bcs.ru/suggestion/v1',
          token: '574fec4e42aa48a2ac22841a3f6def1d',
          type: 'NAME',
          count: 5,
          mobileWidth: 0,
        });
      $('.js-fio-masked')
        .on('keyup', (e) => {
          const input = $(e.currentTarget);
          input.val(Validator.autoLayoutKeyboard(input.val()));
        });
      // $.validator.addMethod(
      //   'checkFio',
      //   (value) => {
      //     const regExp = new RegExp('([А-ЯЁ][а-яё]+[\\-\\s]?){3,}');
      //     return String(value).match(regExp);
      //   },
      //   'Ведите Фамилию Имя Отчество',
      // );
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

    static autoLayoutLatinKeyboard(str) {
      const replacerString = `{
        "й":"yyy", "ц" : "ts", "у":"u", "к":"k", "е":"e", "н":"n", "г":"g",
        "ш":"sh", "щ":"shch", "з":"z", "х":"kh", "ъ":"", "ф":"f", "ы":"yyy",
        "в":"v", "а":"a", "п":"p", "р":"r", "о":"o", "л":"l", "д":"d",
        "ж":"zh", "э":"e", "я":"ya", "ч":"ch", "с":"s", "м":"m", "и":"i",
        "т":"t", "ь":"", "б":"b", "ю":"yu"
      }`;
      const replacer = JSON.parse(replacerString);
      return str.replace(/[А-я\][]/g, x => (x === x.toLowerCase() ? replacer[x] : replacer[x.toLowerCase()].toUpperCase()));
    }

    static addValidateCourseAmount() {
      $.validator.addMethod(
        'checkCourseAmount',
        (value, element) => {
          const max = parseInt($(element)
            .closest('.js-input')
            .data('max'), 0);
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
          return String(value)
            .match(regExp);
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
          const max = parseInt($(element)
            .closest('.js-input')
            .data('max'), 0);
          const commission = parseFloat($(element)
            .closest('.js-input')
            .data('commission'));
          const num = parseFloat(value.replace(/ /g, ''));

          return num * (1 + commission) <= max;
        },
      );
    }

    static addValidatePhoneLength() {
      $.validator.addMethod(
        'minPhoneLength',
        (value, element) => {
          const len = $(element)
            .val()
            .replace(/ /g, '').length;
          return len === 16;
        },
      );
    }

    static checkPassportDate(passportDate, dudeDate) {
      function yearsDiff(dt) {
        if (dt > new Date()) {
          return 0;
        }
        const crntDate = new Date();
        let yearDiff = parseInt(crntDate.getFullYear() - dt.getFullYear(), 10);
        const dat4check = new Date(dt);
        dat4check.setFullYear(crntDate.getFullYear());
        if (dat4check > crntDate) {
          yearDiff -= 1;
        }
        if (yearDiff <= 0) {
          return 0;
        }
        if (yearDiff === 1) {
          const monthDiff = parseInt(crntDate.getMonth() - dt.getMonth(), 10);
          if (monthDiff >= 0) {
            if (monthDiff === 0) {
              const dayDiff = parseInt(crntDate.getDate() - dt.getDate(), 10);
              if (dayDiff > 0) return yearDiff;
              return 0;
            }
            return crntDate.getFullYear() - dt.getFullYear();
          }
          return 0;
        }
        return yearDiff;
      }

      const dob = new Date(dudeDate.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
      const pssprtDate = new Date(passportDate.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
      const pDate20 = new Date(dob);
      pDate20.setFullYear(pDate20.getFullYear() + 20);
      const pDate45 = new Date(dob);
      pDate45.setFullYear(pDate45.getFullYear() + 45);
      const ageDude = parseInt(yearsDiff(new Date(dudeDate.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'))), 10);
      // первая смена паспорта
      if (ageDude >= 20 && ageDude < 45) {
        if (pssprtDate < pDate20) {
          return false;
        }
      }
      // вторая смена паспорта
      if (ageDude >= 45) {
        if (pssprtDate < pDate45) {
          return false;
        }
      }
      return true;
    }

    static validateSnils(sn, err) {
      let snils = sn;
      const error = err;
      let result = false;
      if (typeof snils === 'number') {
        snils = snils.toString();
      } else if (typeof snils !== 'string') {
        snils = '';
      }
      if (!snils.length) {
        error.code = 1;
        error.message = 'СНИЛС пуст';
      } else if (/[^0-9]/.test(snils)) {
        error.code = 2;
        error.message = 'СНИЛС может состоять только из цифр';
      } else if (snils.length !== 11) {
        error.code = 3;
        error.message = 'СНИЛС может состоять только из 11 цифр';
      } else {
        let sum = 0;
        for (let i = 0; i < 9; i += 1) {
          sum += parseInt(snils[i], 10) * (9 - i);
        }
        let checkDigit = 0;
        if (sum < 100) {
          checkDigit = sum;
        } else if (sum > 101) {
          checkDigit = parseInt(sum % 101, 10);
          if (checkDigit === 100) {
            checkDigit = 0;
          }
        }
        if (checkDigit === parseInt(snils.slice(-2), 10)) {
          result = true;
        } else {
          error.code = 4;
          error.message = 'Неправильное контрольное число';
        }
      }
      return result;
    }

    static addValidateDate() {
      $.validator.addMethod('checkDate', (value, element) => {
        function getCurrentAge(date) {
          return ((new Date().getTime() - date) / (24 * 3600 * 365.25 * 1000)) || 0;
        }

        const currentDate = new Date();
        const parsedValue = String(value)
          .split('.');
        const date = new Date(parseInt(parsedValue[2], 10), parseInt((parsedValue[1] - 1), 10), parseInt(parsedValue[0], 10));
        if (!$(element)
          .hasClass('js-default-date')) {
          let valid = true;
          const regExp = new RegExp('^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[1,3-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$');
          valid = !!String(value)
            .match(regExp);
          if ($(element)
            .hasClass('js-date-type__pass-prodused')) {
            if ($('.js-date-type__birth')
              .val()) {
              valid = Validator.checkPassportDate(String(value), $('.js-date-type__birth')
                .val());
              if (!valid) {
                $.validator.messages.checkDate = 'Паспорт просрочен';
              }
            }
          }
          if ($(element)
            .hasClass('js-date-type__birth')) {
            const age = getCurrentAge(date);
            if (age < 18) {
              valid = false;
              $.validator.messages.checkDate = 'Неверный возраст';
            }
            if (age > 130) {
              valid = false;
              $.validator.messages.checkDate = 'Неверный возраст';
            }
          }
          if (valid) {
            return !(Number(currentDate) < Number(date));
          }
          return false;
        }
        return !(Number(currentDate) <= Number(date));
      }, 'Введите верную дату');
    }

    static addValidateSnils() {
      const errors = {
        message: 'Неверный СНИЛС',
      };
      $.validator.addMethod('checkSnils', (value) => {
        const valid = Validator.validateSnils(value, errors);
        $.validator.messages.checkSnils = errors.message;
        return valid;
      }, errors.message);
    }

    scrollToError(el) {
      if (!this.scrollTimout) {
        $(el).focus();
        this.scrollTimout = true;
      }
    }

    validateForm(handler) {
      const self = this;
      $.validator.addClassRules(this.validateRules);
      return this.form.validate({
        focusInvalid: false,
        errorElement: 'div',
        errorClass: 'input__error',
        messages: this.setFieldMessages(),
        errorPlacement(error, element) {
          if ($(element)
            .closest('.js-input').length) {
            error.appendTo($(element)
              .closest('.js-input'));
          }
          if ($(element)
            .closest('.js-dropdown').length) {
            error.appendTo($(element)
              .closest('.js-dropdown'));
          }
          if ($('.js-sms-code-form-counter').length) {
            $('.js-sms-code-form-counter')
              .addClass('state_form_error');
          }
        },
        highlight(element) {
          if ($(element)
            .closest('.js-input').length) {
            $(element)
              .closest('.js-input')
              .addClass('state_error');
          }
          if ($(element)
            .closest('.js-dropdown').length) {
            $(element)
              .closest('.js-dropdown')
              .addClass('state_error');
          }
          if ($('.js-sms-code-form-counter').length) {
            $('.js-sms-code-form-counter')
              .addClass('state_form_error');
          }
          if (element) {
            self.scrollToError(element);
          }
        },
        unhighlight(element) {
          self.scrollTimout = false;
          if ($(element)
            .closest('.js-input').length) {
            $(element)
              .closest('.js-input')
              .removeClass('state_error');
          }
          if ($(element)
            .closest('.js-dropdown').length) {
            $(element)
              .closest('.js-dropdown')
              .removeClass('state_error');
          }
          if ($('.js-sms-code-form-counter').length) {
            $('.js-sms-code-form-counter')
              .removeClass('state_form_error');
          }
        },
        submitHandler: handler,
      });
    }
  }

  return new Validator(form);
};
