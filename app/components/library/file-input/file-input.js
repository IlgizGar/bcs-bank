import $ from 'jquery';
import Dropzone from 'dropzone';

export default class FileInput {
  constructor() {
    this.element = document.querySelector('.file-input');
    this.template = $(this.element).find('.file-input__preview-template').html();
    this.init();
  }

  init() {
    const self = this;
    this.dropzone = new Dropzone(this.element, {
      url: '/',
      previewTemplate: self.template,
      autoProcessQueue: false,
      uploadMultiple: true,
    });

    $(this.element).closest('form').on('submit', (e) => {
      // Make sure that the form isn't actually being sent.
      e.preventDefault();
      e.stopPropagation();
      this.dropzone.processQueue();
    });
  }
}
