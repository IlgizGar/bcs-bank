import $ from 'jquery';
import 'jquery-validation';
import 'suggestions-jquery';
import Validator from './validator';
import StepForm from '../../library/step-form/step-form';
import SmsForm from '../../modules/sms-code-form/sms-code';
import PlaceForm from '../../modules/form-place/form-place';
import TransferForm from './transferForm';
import FormHelper from './formHelper';


module.exports = (elem) => {
  class Form {
    constructor(selector) {
      this.form = $(selector);
      this.steps = null;
      this.smsCodeForm = null;
      this.stepClass = 'js-step';
      this.transferForm = new TransferForm();
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
        FormHelper.setStepsCount(this);
      }
      if (this.form.find('.js-sms-code-form').length) {
        this.smsCodeForm = SmsForm('.js-sms-code-form');
      }
      this.validator = Validator(this.form);
      this.validateForm();
      this.transferForm.blockEvents.call(this);
      this.events();
      if (this.form.find('.js-place-to-live').length) {
        this.placeToLive = new PlaceForm('.js-place-to-live');
      }
    }
    events() {
      if (this.form.closest('.modal').length) {
        this.form.closest('.modal')
          .on($.modal.BEFORE_CLOSE, () => {
          });
      }
      if (this.steps) {
        this.form.find('.js-prev-step')
          .on('click', (e) => {
            e.preventDefault();
            this.steps.prevStep();
          });
        this.form.find('.js-step-backward')
          .on('click', () => {
            this.form.closest('.js-form')
              .find('.js-step-informer')
              .text(this.steps.prevStep(() => {
                if ($(this.steps.getCurrent())
                  .find('.js-sms-code-form').length) {
                  FormHelper.setStepBack(this);
                }
              }) + 1);
          });
      }
    }

    validateForm() {
      let submitHandler = null;
      if (!this.steps) {
        if (this.formType !== undefined) {
          if (this.formType === 'fix-course') {
            submitHandler = FormHelper.getHandler();
          } else if (this.formType === 'cards') {
            submitHandler = FormHelper.postHandler(this);
          } else {
            submitHandler = FormHelper.postHandler(this);
          }
        }
      } else {
        submitHandler = FormHelper.stepPostHandler(this);
      }
      this.validator.validateForm(submitHandler);
      this.formValidator = this.validator.validateForm(submitHandler);
    }

    formSubmit(form, url, callback, sendStep) {
      $(form)
        .addClass('state_loading');
      let formData = $(form)
        .serializeArray();
      if (sendStep) {
        formData = FormHelper.collectStepData(this);
      }
      const sendUrl = url;
      FormHelper.formatOutput(formData);
      $.ajax({
        method: 'POST',
        type: 'POST',
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
                .modal({
                  showClose: false,
                });
              $(form)
                .removeClass('state_loading');
            } else if (data.success === 'incorrect-code') {
              $(form)
                .removeClass('state_loading');
              FormHelper.showInputError('sms_code', data.error, this.formValidator);
            } else {
              $(form)
                .removeClass('state_loading');
              $('.js-products-error')
                .modal({
                  showClose: false,
                });
            }
          } else if (data.success === 'incorrect-code') {
            $(form)
              .removeClass('state_loading');
            FormHelper.showInputError('sms_code', data.error, this.formValidator);
          } else if (data.success === false) {
            $(form)
              .removeClass('state_loading');
            if (data.errors) {
              Object.keys(data.errors)
                .forEach((item) => {
                  const dataItem = data.errors[item];
                  const itemValue = Array.isArray(dataItem) ? String(dataItem.join(','))
                    .replace(new RegExp(',', 'g'), ', ') : dataItem;
                  FormHelper.showInputError(item, itemValue, this.formValidator);
                });
            } else {
              $('.js-products-error')
                .modal({
                  showClose: false,
                });
              $(form).removeClass('state_loading');
            }
          } else {
            $(form)
              .removeClass('state_loading');
            callback(data);
          }
          if (data.set_hidden_value) {
            Object.keys(data.set_hidden_value)
              .forEach((key) => {
                const value = data.set_hidden_value[key];
                FormHelper.setHiddenValue(key, value, this.form);
              });
          }
        },
        error: () => {
          if (!url) {
            $(form).removeClass('state_loading');
            $('.js-products-error')
              .modal({
                showClose: false,
              });
          }
        },
      });
    }
  }

  return new Form(elem);
};
