import $ from 'jquery';

module.exports = (elem) => {
  class PartnerModalForm {
    constructor(selector) {
      this.modal = $('.js-partners-modal');
      this.title = this.modal.find('.js-partners-modal-title span');
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
        this.setModalData(btn.data('title'), btn.data('text'), btn.data('link'));
        this.modal.modal();
      });
    }
    setModalData(title, text, link) {
      this.title.text(title);
      this.text.text(text);
      this.link.attr('href', link);
      this.theme.val(title);
    }
  }

  return new PartnerModalForm(elem);
};
