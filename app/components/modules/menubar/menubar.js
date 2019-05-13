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
