import $ from 'jquery';

module.exports = (elem) => {
  class Header {
    constructor(selector) {
      this.header = $(selector);
      this.contacts = this.header.find('.js-header-contacts');
      this.btnContacts = this.header.find('.js-btn-header-contacts');
      this.btnOffices = this.header.find('.js-btn-header-offices');
      this.btnOfficesState = false;

      this.mobileMenu = this.header.find('.js-mobile-menu');
      this.exploreMenu = $('#menu-explore');

      this.init();
      this.events();
    }

    init() {
      this.fillMobileMenu();
    }

    events() {
      this.btnContacts.on('click', (e) => {
        this.btnContacts = this.header.find('.js-btn-header-contacts'); // Не удалять! Требуется для синхронизации мобильных и десктопных версий меню.

        if (!$(e.currentTarget).hasClass('state_active')) {
          this.btnContacts.addClass('state_active');
          this.contacts.addClass('state_explored');
          $('main').append('<div class="page__cover js-cover"></div>');
          $('body').addClass('state_unscroll');
          $('.js-navbar').removeClass('state_init');
          if (this.btnOffices.hasClass('state_active')) {
            this.btnOfficesState = true;
            this.btnOffices.removeClass('state_active');
          }
        } else {
          this.btnContacts.removeClass('state_active');
          this.contacts.removeClass('state_explored');
          $('main').find('.js-cover').remove();
          $('body').removeClass('state_unscroll');
            if (this.btnOfficesState) {
              this.btnOffices.addClass('state_active');
              this.btnOfficesState = false;
            } else {
                $('.js-navbar').addClass('state_init');
            }
        }
      });

      $(window).on('click', (e) => {
        if ($(e.target).closest('.js-cover').length) {
          this.btnContacts.removeClass('state_active');
          this.contacts.removeClass('state_explored');
          $('body').removeClass('state_unscroll');
          $(e.target).remove();
        }
      });

      $(window).on('resize', () => {
        // if (window.innerWidth < 1280) {
        //   if (!this.mobileMenu.hasClass('state_filled')) {
        //     this.fillMobileMenu();
        //   }
        // }
      });

      $('html').keydown((e) => {
        if (e.keyCode === 27) {
          this.btnContacts.removeClass('state_active');
          this.contacts.removeClass('state_explored');
          $('main').find('.js-cover').remove();
          $('body').removeClass('state_unscroll');
        }
      });
    }

    fillMobileMenu() {
      const $menu = $.extend(true, {}, $('.js-menu').clone());
      const $nav = $.extend(true, {}, $('.js-nav').clone());
      const $online = $.extend(true, {}, $('.js-online-bank').clone());
      const $explore = $.extend(true, {}, this.exploreMenu.clone());

      $nav.appendTo(this.mobileMenu);
      $menu.find('.js-button')
        .removeClass('button_theme-white')
        .addClass('button_theme-black mobile-menu__link');
      $menu.appendTo(this.mobileMenu);
      $explore.find('a')
        .addClass('button button_view-text button_size-low menu__item js-button button_theme-black mobile-menu__link')
        .appendTo(this.mobileMenu.find('.js-menu .menu__wrapper'));
      $online
        .addClass('button_theme-default mobile-menu__online-bank')
        .removeClass('hidden-mobile button_theme-white button_view-outlined')
        .appendTo(this.mobileMenu);

      this.mobileMenu.addClass('state_filled');
    }
  }

  return new Header(elem);
};
