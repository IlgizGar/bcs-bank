import $ from 'jquery';

export default class Menubar {
  constructor() {
    this.menubar = $('.js-menubar');
    this.menuControl = this.menubar.find('.js-menubar-burger');
    this.breakpoint = 1280;
    this.mobileMenu = $('.js-mobile-menu');
    this.bodyState = false;
    // this.init();
    this.events();
  }

  init() {
    if (this.checkWidth()) {
      this.controlHandler();
    }
  }

  events() {
    this.menuControl.on('click', () => {
      this.controlHandler();
    });

    $(window).on('resize', () => {
      if (window.innerWidth >= 1280) {
        if (this.menuControl.hasClass('state_open')) {
          this.controlHandler();
        }
      }
    });
  }

  checkWidth() {
    return window.innerWidth < this.breakpoint;
  }

  controlHandler() {
    if (!this.menuControl.hasClass('state_open')) {
      this.menuControl.addClass('state_open');
      this.mobileMenu.addClass('state_explored');
      if ($('body').hasClass('state_unscroll')) {
        this.bodyState = true;
      }
      $('body').addClass('state_unscroll');
    } else {
      this.menuControl.removeClass('state_open');
      this.mobileMenu.removeClass('state_explored');
      if (!this.bodyState) {
        $('body').removeClass('state_unscroll');
        this.bodyState = false;
      }
    }
  }
}
