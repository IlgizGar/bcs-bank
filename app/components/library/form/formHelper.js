import $ from 'jquery';

export default class FormHelper {
  static formatOutput(formData) {
    Object.keys(formData)
      .forEach((item) => {
        const dataItem = formData[item];
        dataItem.value = String(dataItem.value).trim();
        if ($(`[name=${dataItem.name}]`)
          .hasClass('js-numeric-input')) {
          dataItem.value = dataItem.value.replace(/\s+/g, '');
        }
      });
  }
  static setHiddenValue(name, value, form) {
    let el = form.find(`[name="${name}"]`);
    if (el.length) {
      el.val(value);
    } else {
      el = document.createElement('input');
      el.type = 'hidden';
      el.name = name;
      el.value = value;
      form[0].appendChild(el);
    }
  }
  static showInputError(name, errorMessage, formValidator) {
    const errorObject = {};
    Object.assign(errorObject, { [name]: errorMessage });
    console.log(errorObject);
    formValidator.showErrors(errorObject);
  }
  static collectStepData(self) {
    const formData = [];
    const step = $(self.steps.getCurrent());
    const inputs = step.find('input[name]');
    const textareas = step.find('textarea[name]');
    const selects = step.find('select[name]');
    inputs.each((index, el) => {
      if (($(el)
        .attr('type') === 'checkbox') || ($(el)
        .attr('type') === 'radio')) {
        if ($(el)
          .prop('checked')) {
          formData.push({
            name: $(el)
              .attr('name'),
            value: $(el)
              .val(),
          });
        }
      } else {
        formData.push({
          name: $(el)
            .attr('name'),
          value: $(el)
            .val(),
        });
      }
    });
    textareas.each((index, el) => {
      formData.push({
        name: $(el)
          .attr('name'),
        value: $(el)
          .val(),
      });
    });
    selects.each((index, el) => {
      formData.push({
        name: $(el)
          .attr('name'),
        value: $(el)
          .val(),
      });
    });
    const $formIdBlock = $('#form_id');
    if ($formIdBlock.length) {
      formData.push({
        name: $formIdBlock
          .attr('name'),
        value: $formIdBlock
          .val(),
      });
    }
    return formData;
  }

  static getHandler() {
    return (form) => {
      const redirectUrl = `${form.getAttribute('action')}?partner=bcs-bank&operation=${form.querySelector('.radio__field:checked')
        .id
        .match(/buy|sell/g)}&amount=${form.querySelector('.js-course-input')
        .value
        .replace(' ', '')}&currency=${form.querySelector('.js-course-field .js-title').innerText}`;
      document.location.href = redirectUrl;
    };
  }
  static postHandler(self) {
    return (form) => {
      self.formSubmit(form);
      return false;
    };
  }
  static stepPostHandler(self) {
    function send(step, form, selfInner, full) {
      if (step.hasClass('js-send-form')) {
        selfInner.formSubmit(form, step.data('send-url'), () => {
          FormHelper.setStepFront(selfInner);
        }, !full);
      } else {
        FormHelper.setStepFront(selfInner);
      }
    }
    return (form) => {
      let step = $(self.steps.getCurrent());
      if (self.steps.isLast()) {
        if (step.hasClass('js-send-validate-form')) {
          self.formSubmit(form, step.data('send-validate-url'), () => {
            self.formSubmit(form);
          }, true);
        } else {
          self.formSubmit(form);
        }
      } else {
        step = $(self.steps.getCurrent());
        if (step.hasClass('js-sms-step')) {
          self.smsCodeForm.sendPhone(['question_phone', 'form_id', 'bid_user_name'], 'question_phone', () => {
          }, () => {
            FormHelper.setStepBack(self);
          });
        }
        if (step.hasClass('js-send-validate-form')) {
          self.formSubmit(form, step.data('send-validate-url'), () => {
            send(step, form, self);
          }, true);
        } else {
          send(step, form, self, true);
        }
      }
    };
  }
  static setStepsCount(self) {
    self.form.closest('.js-form')
      .find('.js-step-informer-all')
      .text(self.steps.getCount());
  }
  static setStepBack(self) {
    self.form.closest('.js-form')
      .find('.js-step-informer')
      .text(self.steps.prevStep() + 1);
  }
  static setStepFront(self) {
    self.form.closest('.js-form')
      .find('.js-step-informer')
      .text(self.steps.nextStep() + 1);
  }
}
