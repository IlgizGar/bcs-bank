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
      uploadMultiple: true
    });

    $(this.element).closest('form').on('submit', () => {
      // Make sure that the form isn't actually being sent.
      e.preventDefault();
      e.stopPropagation();
      this.dropzone.processQueue();
    })
  }
}
/*
 Dropzone.prototype.defaultOptions.dictDefaultMessage = "Чтобы прикрепить файлы, перетяните их в эту область";
    Dropzone.prototype.defaultOptions.dictFallbackMessage = "Ваш браузер не поддерживает drag'n'drop для загрузки файлов.";
    Dropzone.prototype.defaultOptions.dictFileTooBig = "Файл слишком большой ({{filesize}}Mb). Максимальный размер: {{maxFilesize}}Mb.";
    Dropzone.prototype.defaultOptions.dictInvalidFileType = "Допустимые типы файлов: " + self.acceptedFiles;
    Dropzone.prototype.defaultOptions.dictResponseError = "Ошибка сервера: {{statusCode}}";
    Dropzone.prototype.defaultOptions.dictCancelUpload = "Отменить загрузку";
    Dropzone.prototype.defaultOptions.dictCancelUploadConfirmation = "Отменить загрузку?";
    Dropzone.prototype.defaultOptions.dictUploadCanceled = "Загрузка отменена";
    Dropzone.prototype.defaultOptions.dictRemoveFile = "Удалить файл";
    Dropzone.prototype.defaultOptions.dictMaxFilesExceeded = "Вы можете загрузить не больше " + self.maxFiles + " файлов";

*/
