/**
 * Makes Steps for froms
 * @param {settings} settings for initialization
 * @param {settings.selector} class for step item
 * @param {settings.wraper} html for seps wrapper
 * @param {settings.activeClass} class for active tab
 * @param {callback} callback function for  nextStep and prevStep methods
 * @method {nextStep} step forwards method
 * @method {prevStep} step backwards method
 * @method {getCurrent} return element that contains current step
 * @method {isLast} check is step last if last return true
 * @method {getCount} return count of steps
 * @method {tofFirstStep} set steps to first
 */

import $ from 'jquery';

export default class StepForm {
  constructor(settings, el) {
    this.stepsNum = 0;
    this.currentStep = 0;
    this.activeElement = null;
    this.stepsWrapper = null;
    this.settings = {
      selector: settings.selector ? settings.selector : 'js-step-form',
      wraper: settings.wrapper ? this._wrapper(settings.wrapper) : this._wrapper(),
      activeClass: settings.activeClass ? settings.activeClass : 'active',
    };
    this.stepElements = el.getElementsByClassName(this.settings.selector);
    this._init(this.settings.wraper);
  }
  _init(wrapper) {
    if (this.stepElements.length > 1) {
      for (let i = 0; i < this.stepElements.length; i += 1) {
        const element = this.stepElements[i];
        element.setAttribute('data-step', String(i));
        this.stepsNum += 1;
      }
      const activeElement = this.stepElements[0];
      activeElement.classList.add(this.settings.activeClass);
      this._wrapContent(wrapper);
      this.activeElement = activeElement;
      return true;
    }
    return false;
  }
  nextStep(callback) {
    if (this.currentStep + 1 < this.stepsNum) {
      this.currentStep += 1;
      const activeElement = this._setActive(this.currentStep);
      if (callback) {
        callback(activeElement);
      }
      return this.currentStep;
    }
    return false;
  }
  prevStep(callback) {
    if (this.currentStep > 0) {
      this.currentStep -= 1;
      const activeElement = this._setActive(this.currentStep);
      if (callback) {
        callback(activeElement);
      }
      return this.currentStep;
    }
    return false;
  }
  _setActive(num) {
    let activeElement;
    for (let i = 0; i < this.stepElements.length; i += 1) {
      const element = this.stepElements[i];
      const elementNum = element.getAttribute('data-step');
      element.classList.remove(this.settings.activeClass);
      if (parseInt(elementNum, 10) === num) {
        element.classList.add(this.settings.activeClass);
        activeElement = element;
      }
    }
    this.activeElement = activeElement;
    $('html, body').animate({ scrollTop: $(this.stepsWrapper).closest('form').offset().top }, 500);
    return activeElement;
  }
  _wrapContent(wrapper) {
    this.stepElements[0].parentElement.insertBefore(wrapper, this.stepElements[0]);
    for (let i = 0; i < this.stepElements.length; i += 1) {
      const element = this.stepElements[i];
      $(wrapper).append($(element));
    }
  }
  _wrapper(html) {
    let template = html;
    template = html ? template : '<div class="step-form__wrapper"></div>';
    const div = document.createElement('div');
    div.innerHTML = template.trim();
    this.stepsWrapper = div.firstChild;
    return div.firstChild;
  }
  getCurrent() {
    return this.activeElement;
  }
  isLast() {
    return (this.currentStep + 1 >= this.stepsNum);
  }
  getCount() {
    return this.stepsNum;
  }
  tofFirstStep() {
    this._setActive(0);
    this.currentStep = 0;
    return this.currentStep;
  }
}
