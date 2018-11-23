import $ from 'jquery';

export default class Transfer {
  constructor(app) {
    this.app = app;
    this.rotateControl = '.services__transfer-rotate-btn';
    this.init();
  }
  init() {
    this.onClick();
  }
  onClick() {
    this.app.on('click', this.rotateControl, (e) => {
      $(e.target).closest('.services__credit-card').css('z-index', 10).siblings('.services__credit-card')
        .css('z-index', 20);
    });
  }
}
