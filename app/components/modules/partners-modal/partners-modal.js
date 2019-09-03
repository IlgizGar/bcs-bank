import $ from 'jquery';

module.exports = (elem) => {
  class PartnerModalForm {
    constructor(selector) {
      this.modal = $('.js-partners-modal');
      this.title = this.modal.find('.js-partners-modal-title span');
      this.subscriptionText = this.modal.find('.js-partners-modal-subscription-text');
      this.text = this.modal.find('.js-partners-modal-text');
      this.link = this.modal.find('.js-partners-modal-button');
      this.theme = this.modal.find('.js-partners-modal-theme');
      this.showModalButton = $(selector);
      this.events();
    }
    events() {
      this.showModalButton.on('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const btn = $(event.currentTarget);
        this.setModalData(btn.data('title'), btn.data('text'), btn.data('link'), btn.data('subscriptiontext'));
        this.modal.modal();
      });
    }
    setModalData(title, text, link, subscriptionText) {
      this.title.text(title);
      this.text.text(text);
      this.subscriptionText.text(subscriptionText);
      this.link.attr('href', link);
      this.theme.val(title);
    }
  }

  return new PartnerModalForm(elem);
};
