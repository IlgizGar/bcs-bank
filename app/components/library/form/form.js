import $ from 'jquery';
import 'jquery-validation';
import 'suggestions-jquery';
import Validator from './validator';
import StepForm from '../../library/step-form/step-form';
import SmsForm from '../../modules/sms-code-form/sms-code';
import PlaceForm from '../../modules/form-place/form-place';
import FormHelper from './formHelper';
import TransferForm from './transferForm';
import formDelivery from '../../modules/form-delivery/form-delivery';


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
      this.validator = Validator(this.form);
      this.initServices();
      this.validateForm();
      this.events();

      this.transferForm = new TransferForm();
      this.transferForm.blockEvents.call(this);
    }
    initServices() {
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
      if (this.form.find('.js-place-to-live').length) {
        this.placeToLive = new PlaceForm('.js-place-to-live');
      }
    }
    events() {
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
      this.formValidator = this.validator.validateForm(this.getSubmitHundler());
    }
    getSubmitHundler() {
      const formTypeHandler = (this.formType === 'fix-course') ? FormHelper.setGetHandler() : FormHelper.setPostHandler(this);
      return this.steps ? FormHelper.setStepPostHandler(this) : formTypeHandler;
    }
    formSubmit(form, url, callback, sendStep) {
      $(form)
        .addClass('state_loading');
      $.ajax({
        method: 'POST',
        type: 'POST',
        url: (url !== undefined) ? url : form.getAttribute('action'),
        dataType: 'json',
        data: FormHelper.formatOutput(sendStep ? FormHelper.collectStepData(this) : $(form).serializeArray()),
        success: (data) => {
          console.log('DATA', data);
          $(form).removeClass('state_loading');
          this.processResult(url, form, data, callback);
        },
        error: () => {
          if (!url) {
            $(form).removeClass('state_loading');
            FormHelper.showErrorModal();
          }
        },
      });
    }
    processResult(url, form, data, callback) {
      console.log(this.steps);
      const self = this;
      function showSmsError() {
        FormHelper.showInputError('sms_code', data.error, this.formValidator);
      }
      function showSuccessModal() {
        self.addPixelMetric(form, data);
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
      }
      function showInputErrors() {
        Object.keys(data.errors)
          .forEach((item) => {
            const dataItem = data.errors[item];
            const itemValue = Array.isArray(dataItem) ? String(dataItem.join(','))
              .replace(new RegExp(',', 'g'), ', ') : dataItem;
            FormHelper.showInputError(item, itemValue, this.formValidator);
          });
      }
      function setHiddenFields() {
        Object.keys(data.set_hidden_value)
          .forEach((key) => {
            const value = data.set_hidden_value[key];
            FormHelper.setHiddenValue(key, value, this.form);
          });
      }
      function showDeliveryBlock() {
        formDelivery.deliveryAvailability(data);
      }

      if (this.steps.currentStep === 1) {
        showDeliveryBlock.apply(this);
      }

      if (data.success === 'incorrect-code') {
        showSmsError.apply(this);
        return;
      }

      if (!url) {
        if (data.success === true) {
          showSuccessModal.apply(this);
        } else {
          FormHelper.showErrorModal();
        }
        return;
      }

      if (data.success === false) {
        if (data.errors) {
          showInputErrors.apply(this);
        } else {
          FormHelper.showErrorModal();
        }
      } else {
        callback(data);
      }
      if (data.set_hidden_value) {
        setHiddenFields.apply(this);
      }
    }
    addPixelMetric(form, response) {
      let pixelUrl = $(form).data('pixel');

      if (pixelUrl.indexOf('#ORDER_ID#') !== -1 && response.request_id) {
        pixelUrl = pixelUrl.replace('#ORDER_ID#', response.request_id)
      }
      if (pixelUrl) {
        $('head').append(`<img src="${pixelUrl}" width="1"  height="1"/>`)
      }
    }
  }
  return new Form(elem);
};
