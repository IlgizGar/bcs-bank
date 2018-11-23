import $ from 'jquery';

export default class QuestionPopup {
  constructor(id, text) {
    this.id = id;
    this.questionText = text;
    this.popup = $(`<div style="position: absolute;" data-id="${this.id}" class="js-question question-popup">
        <div class="question-popup__text">${this.questionText}</div>
      </div>`);
  }

  generatePopup() {
    this.popup.append(this.generatePopupButtons());
    if (!$(`.js-question[data-id="${this.id}"]`).length) {
      $('.js-page').append(this.popup);
    }
  }

  generatePopupButtons() {
    const buttonWrapper = $('<div class="question-popup__buttons"></div>');
    const allowButton = $(`<button class="button button_theme-default button_view-text js-button-allow" type="button">
        <span class="button__wrap">
          <span class="button__title">Да</span>
        </span>
       </button>`);
    const disallowButton = $(`<button class="button button_theme-default button_view-text js-button-disallow" type="button">
         <span class="button__wrap">
           <span class="button__title">Нет</span>
         </span>
       </button>`);
    allowButton.on('click', (e) => {
      $(e.target).closest('.js-question').hide();
      this.popup.trigger('questionresolve', { response: true });
    });
    disallowButton.on('click', (e) => {
      $(e.target).closest('.js-question').hide();
      this.popup.trigger('questionresolve', { response: false });
    });
    buttonWrapper.append(allowButton);
    buttonWrapper.append(disallowButton);
    return buttonWrapper;
  }

  onQuestionResolve(e) {
    function CustomEvent(event, params) {
      const par = params || { bubbles: false, cancelable: false, detail: undefined };
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, par.bubbles, par.cancelable, par.detail);
      return evt;
    }
    if (typeof window.CustomEvent !== 'function') {
      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent;
    }
    const event = new CustomEvent('questionresolve', { detail: e.response });
    this.popup.dispatchEvent(event);
  }
}

