import $ from 'jquery';
import 'jquery-validation';
import Validator from './validator';
import StepForm from '../../library/step-form/step-form';
import SmsForm from '../../modules/sms-code-form/sms-code';
import PlaceForm from '../../modules/form-place/form-place';

module.exports = (elem) => {
  class Form {
    constructor(selector) {
      this.form = $(selector);
      this.steps = null;
      this.smsCodeForm = null;
      this.stepClass = 'js-step';
      this.msgSucess = this.form.closest('.js-form')
        .find('.js-form-success');
      this.msgError = this.form.closest('.js-form')
        .find('.js-form-error');
      this.formType = this.form.closest('.js-form')
        .data('form');
      if (this.form.find(`.${this.stepClass}`).length) {
        this.steps = new StepForm({
          selector: this.stepClass,
          activeClass: 'state_active',
        }, this.form[0]);
        this.form.find('.js-step-backward').on('click', () => {
          this.steps.prevStep(() => {
            if ($(this.steps.getCurrent()).hasClass('js-sms-step')) {
              this.steps.prevStep();
            }
          });
        });
        this.form.closest('.js-form')
          .find('.js-step-informer-all')
          .text(this.steps.getCount());
      }
      if (this.form.find('.js-sms-code-form').length) {
        this.smsCodeForm = SmsForm('.js-sms-code-form');
      }
      this.validator = Validator(this.form);
      this.validateForm();
      this.blockEvents(); // Обработчик событий не свзяанных непосредственно с работой формы
      this.events();
      if (this.form.find('.js-place-to-live').length) {
        this.placeToLive = new PlaceForm('.js-place-to-live');
      }
    }

    events() {
      if (this.form.closest('.modal').length) {
        this.form.closest('.modal')
          .on($.modal.BEFORE_CLOSE, () => {
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
      if (this.steps) {
        this.form.find('.js-prev-step')
          .on('click', (e) => {
            e.preventDefault();
            this.steps.prevStep();
          });
      }
    }

    validateForm() {
      let submitHandler = null;
      if (!this.steps) {
        if (this.formType !== undefined) {
          if (this.formType === 'fix-course') {
            submitHandler = (form) => {
              const redirectUrl = `${form.getAttribute('action')}?partner=bcs-bank&operation=${form.querySelector('.radio__field:checked')
                .id
                .match(/buy|sell/g)}&amount=${form.querySelector('.js-course-input')
                .value
                .replace(' ', '')}&currency=${form.querySelector('.js-course-field .js-title').innerText}`;
              document.location.href = redirectUrl;
            };
          }

          if (this.formType === 'cards') {
            submitHandler = (form) => {
              this.formSubmit(form);
              return false;
            };
          }
          submitHandler = (form) => {
            this.formSubmit(form);
            return false;
          };
        }
      } else {
        submitHandler = (form) => {
          let step = $(this.steps.getCurrent());
          if (this.steps.isLast()) {
            this.formSubmit(form);
          } else {
            step = $(this.steps.getCurrent());
            if (step.hasClass('js-sms-step')) {
              this.smsCodeForm.sendPhone(['question_phone', 'form_id', 'bid_user_name'], 'question_phone', () => {
              }, () => {
                this.form.closest('.js-form')
                  .find('.js-step-informer')
                  .text(this.steps.prevStep() + 1);
              });
            }
            if (step.hasClass('js-send-form')) {
              this.formSubmit(form, step.data('send-url'), () => {
                this.form.closest('.js-form')
                  .find('.js-step-informer')
                  .text(this.steps.nextStep() + 1);
              });
            }
          }
        };
      }
      this.validator.validateForm(submitHandler);
      this.formValidator = this.validator.validateForm(submitHandler);
    }

    formSubmit(form, url, callback) {
      const formData = $(form).serializeArray();
      const sendUrl = url;
      Object.keys(formData).forEach((item) => {
        const dataItem = formData[item];
        if ($(`[name=${dataItem.name}]`).hasClass('js-numeric-input')) {
          dataItem.value = dataItem.value.replace(' ', '');
        }
      });
      $.ajax({
        method: 'POST',
        url: url ? sendUrl : form.getAttribute('action'),
        dataType: 'json',
        data: formData,
        success: (data) => {
          if (!url) {
            if (data.success === true) {
              $('.js-products-success')
                .on($.modal.AFTER_CLOSE, () => {
                  form.reset();
                  this.form.closest('.js-form')
                    .find('.js-step-informer')
                    .text(this.steps.tofFirstStep() + 1);
                })
                .modal();
            } else if (data.success === 'incorrect-code') {
              this.formValidator.showErrors({
                sms_code: data.error,
              });
            } else {
              $('.js-products-error')
                .modal();
            }
          } else if (data.success === 'incorrect-code') {
            this.formValidator.showErrors({
              sms_code: data.error,
            });
          } else {
            callback();
          }
        },
        error: () => {
          if (!url) {
            $('.js-products-error')
              .modal();
          }
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
            const totalAmount = (parseFloat(transferAmountField.val()
              .replace(/ /g, '')
              .replace(',', '.')) * (1 + transferAmountField.closest('.js-input')
              .data('commission'))).toFixed(2)
              .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
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
        let courseAmount = courseInputField.val()
          .replace(',', '.');
        let calculatedAmount = courseAmount * currencyValue;
        courseRadio.on('click', (e) => {
          courseRadioField = $(e.currentTarget)
            .find('input[type="radio"]');
          this.currencyType = $(e.currentTarget)
            .data('currency');
          courseCurrencyLabel.html(this.currencyType);
          if (courseAmount) {
            currencyValue = courseRadioField.val();
            calculatedAmount = courseAmount * currencyValue;
            courseResult.html(parseFloat(calculatedAmount)
              .toFixed(2)
              .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
              .replace('.', ','));
            courseResultField.val(calculatedAmount);
            courseInputField.valid();
          }
        });
        courseInputField.on('keyup', (e) => {
          if ($(e.target)
            .val().length) {
            courseAmount = parseFloat(courseInputField.val()
              .replace(/ /g, '')
              .replace(',', '.'));
            calculatedAmount = courseAmount * currencyValue;
            courseResult.html(parseFloat(calculatedAmount)
              .toFixed(2)
              .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
              .replace('.', ','));
            courseResultField.val(calculatedAmount);
          } else {
            courseResult.html('0');
            courseAmount = 0;
          }
        });
        courseInputField.trigger('keyup');
      }

      const checkRadio = $('.js-check-radio');
      if (checkRadio.length) {
        checkRadio.on('click', (e) => {
          if ($(e.currentTarget)
            .data('check') === 'vu') {
            $('.js-check-vu')
              .removeClass('state_hidden');
            $('.js-check-post')
              .addClass('state_hidden');
          } else {
            $('.js-check-vu')
              .addClass('state_hidden');
            $('.js-check-post')
              .removeClass('state_hidden');
          }
        });
      }
    }
  }

  return new Form(elem);
};
