import $ from 'jquery';

export default class Menubar {
  constructor() {
    this.menubar = $('.js-menubar');
    this.menuControl = this.menubar.find('.js-menubar-burger');
    this.breakpoint = 1280;
    this.mobileMenu = $('.js-mobile-menu');
    this.bodyState = false;
    this.openClass = 'state_open';
    this.exploredClass = 'state_explored';
    this.uscrollClass = 'state_unscroll';
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
      const mobileNav = $('.js-mobile-menu .js-nav');
      let menuWidth = 0;
      mobileNav.find('.js-button').each((index, element) => {
        menuWidth += $(element).outerWidth(true);
      });
      const activePosition = mobileNav.find('.state_active.js-button').position();
      if (mobileNav.outerWidth(true) < menuWidth) {
        mobileNav[0].scrollTo(activePosition.left - 30, 0);
      }
      this.controlHandler();
    });

    this.mobileMenu.on('click', (e) => {
      console.log(e);
      if ($(e.target).hasClass('js-landings-menu__item') || $(e.target).closest('.js-landings-menu__item').length) {
        this.controlHandler();
        $(e.target).find('a').trigger('click');
      }
    });

    $(window).on('resize', () => {
      if (window.innerWidth >= 1280) {
        if (this.menuControl.hasClass(this.openClass)) {
          this.controlHandler();
        }
      }
    });
  }

  checkWidth() {
    return window.innerWidth < this.breakpoint;
  }

  controlHandler() {
    const $body = $('body');
    if (!this.menuControl.hasClass(this.openClass)) {
      this.menuControl.addClass(this.openClass);
      this.mobileMenu.addClass(this.exploredClass);
      if ($body.hasClass(this.uscrollClass)) {
        this.bodyState = true;
      }
      $body.addClass(this.uscrollClass);
    } else {
      this.menuControl.removeClass(this.openClass);
      this.mobileMenu.removeClass(this.exploredClass);
      if (!this.bodyState) {
        $body.removeClass(this.uscrollClass);
        this.bodyState = false;
      }
    }
  }
}
