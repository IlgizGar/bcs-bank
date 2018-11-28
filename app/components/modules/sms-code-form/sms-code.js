import $ from 'jquery';

module.exports = (elem) => {
  class SmsForm {
    constructor(selector) {
      this.smsCodeForm = $(selector);
      this.smsCodeBlock = this.smsCodeForm.find('.js-sms-code-phone');
      this.smsCodeInput = this.smsCodeForm.find('.js-sms-code-input');
    }
    sendPhone(inputName, callback, err) {
      const formData = {};
      const phoneInput = $(`[name="${inputName}"]`);
      formData[inputName] = phoneInput.val();
      this.smsCodeBlock.text(phoneInput.val());
      $.ajax({
        method: 'post',
        url: this.smsCodeForm.data('action'),
        dataType: 'json',
        data: formData,
        success: (data) => {
          if (data.success === true) {
            callback(data);
            return true;
          }
          this.smsCodeInput.closest('.js-input').addClass('state-error');
          return false;
        },
        error: () => {
          err();
          $('.js-products-error').modal();
        },
      });
    }
  }
  return new SmsForm(elem);
};
