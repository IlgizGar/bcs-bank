export default class Menubar {
  constructor() {
    this.menubar = $('.js-menubar');
    this.menuControl = this.menubar.find('.js-menubar__burger');
    this.breakpoint = 1280;
    this.init();
  }

  init() {
    if (this.checkWidth()) {
      this.controlHandler();
    }
  }

  controlHandler() {
    this.menuControl.on('click', () => {
      this.menuControl.toggleClass('menubar__burger_state-open');
    })
  }

  checkWidth() {
    return window.innerWidth < this.breakpoint;
  }
}
