import $ from 'jquery';

export default class Menubar {
  constructor() {
    this.menubar = $('.js-menubar');
    this.menuControl = this.menubar.find('.js-menubar-burger');
    this.breakpoint = 1280;
    this.mobileMenu = $('.js-mobile-menu');
    this.init();
  }

  init() {
    if (this.checkWidth()) {
      this.controlHandler();
    }
  }

  controlHandler() {
    this.menuControl.on('click', () => {
      this.menuControl.toggleClass('state_open');
      this.mobileMenu.toggleClass('state_explored');
    });
  }

  checkWidth() {
    return window.innerWidth < this.breakpoint;
  }
}
