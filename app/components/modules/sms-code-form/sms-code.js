import $ from 'jquery';

module.exports = (elem) => {
  class SmsForm {
    constructor(selector) {
      this.smsCodeForm = $(selector);
      this.delay = 120000;
      this.time = 120000;
      this.timer = null;
      this.smsCodeBlock = this.smsCodeForm.find('.js-sms-code-phone');
      this.smsCodeInput = this.smsCodeForm.find('.js-sms-code-input');
      this.smsCodeTimerBlock = this.smsCodeForm.find('.js-sms-code-timer');
      this.smsCodeButton = this.smsCodeForm.find('.js-sms-code-button');
      this.smsCodeText = this.smsCodeForm.find('.js-sms-code-text');
      this.sendText = '';
      this.timerText = this.smsCodeButton.html();
      this.events();
    }
    sendPhone(inputName, callback, err) {
      this.initTimer();
      this.inputName = inputName;
      this.callback = callback;
      this.err = err;
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
          err();
          $('.js-products-error').modal();
          return false;
        },
        error: () => {
          err();
          $('.js-products-error').modal();
        },
      });
    }
    initTimer() {
      this.time = this.delay;
      const initTime = new Date(this.delay);
      const timeInitString = SmsForm.formatTime(initTime.getMinutes(), initTime.getSeconds());
      this.smsCodeTimerBlock.html(`${timeInitString.minutes}:${timeInitString.seconds}`);
      this.smsCodeText.html(this.timerText);
      this.smsCodeButton.removeClass('state_enabled');
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time -= 1000;
          const time = new Date(this.time);
          const timeString = SmsForm.formatTime(time.getMinutes(), time.getSeconds());
          this.smsCodeTimerBlock.html(`${timeString.minutes}:${timeString.seconds}`);
        } else {
          clearInterval(this.timer);
          this.smsCodeTimerBlock.html('');
          this.smsCodeText.html(this.sendText);
          this.smsCodeButton.addClass('state_enabled');
          this.time = this.delay;
        }
        return true;
      }, 1000);
    }
    static formatTime(minutes, seconds) {
      let secondsString = String(seconds);
      if (seconds < 10) {
        secondsString = `0${seconds}`;
      }
      let minutesString = String(minutes);
      if (minutes < 10) {
        minutesString = `0${minutes}`;
      }
      return {
        minutes: minutesString,
        seconds: secondsString,
      };
    }
    events() {
      this.smsCodeButton.on('click', () => {
        console.log('ol');
        if (this.smsCodeButton.hasClass('state_enabled')) {
          this.sendPhone(this.inputName, this.callback, this.err);
        }
      });
    }
  }

  return new SmsForm(elem);
};
