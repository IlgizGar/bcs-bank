import $ from 'jquery';

module.exports = (elem) => {
  class Header {
    constructor(selector) {
      this.header = $(selector);
      this.contacts = this.header.find('.js-header-contacts');
      this.btnContacts = this.header.find('.js-btn-header-contacts');
      this.btnOffices = this.header.find('.js-btn-header-offices');
      this.btnOfficesState = false;
      this.activeClass = 'state_active';
      this.exploredClass = 'state_explored';
      this.unscrollClass = 'state_unscroll';

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

        if (!$(e.currentTarget).hasClass(this.activeClass)) {
          this.btnContacts.addClass(this.activeClass);
          this.contacts.addClass(this.exploredClass);
          $('main').append('<div class="page__cover js-cover"></div>');
          $('body').addClass(this.unscrollClass);
          $('.js-navbar').removeClass('state_init');
          if (this.btnOffices.hasClass(this.activeClass)) {
            this.btnOfficesState = true;
            this.btnOffices.removeClass(this.activeClass);
          }
        } else {
          this.btnContacts.removeClass(this.activeClass);
          this.contacts.removeClass(this.exploredClass);
          $('main').find('.js-cover').remove();
          $('body').removeClass(this.unscrollClass);
          if (this.btnOfficesState) {
            this.btnOffices.addClass(this.activeClass);
            this.btnOfficesState = false;
          } else {
            $('.js-navbar').addClass('state_init');
          }
        }
      });

      $(window).on('click', (e) => {
        if ($(e.target).closest('.js-cover').length) {
          this.btnContacts.removeClass(this.activeClass);
          this.contacts.removeClass(this.exploredClass);
          $('body').removeClass(this.unscrollClass);
          $(e.target).remove();
        }
      });
      $('html').keydown((e) => {
        if (e.keyCode === 27) {
          this.btnContacts.removeClass(this.activeClass);
          this.contacts.removeClass(this.exploredClass);
          $('main').find('.js-cover').remove();
          $('body').removeClass(this.unscrollClass);
        }
      });
    }

    fillMobileMenu() {
      const $menu = $.extend(true, {}, $('.js-menu').clone());
      const $nav = $.extend(true, {}, $('.js-nav').clone());
      const $contacts = $.extend(true, {}, this.contacts.clone());
      const $online = $.extend(true, {}, $('.js-online-bank').clone());
      const $explore = $.extend(true, {}, this.exploreMenu.clone());
      const linkClass = 'button_theme-black mobile-menu__link';

      $nav.appendTo(this.mobileMenu);

      const $menuWrapper = $('<div class="header__mobile-wrapper"></div>');
      $menu.find('.js-button')
        .removeClass(this.activeClass)
        .addClass(linkClass);
      $menu.appendTo($menuWrapper);
      $explore.find('a')
        .addClass(`button button_view-text button_type-tab button_size-low button_view-underscore menu__item js-button button_theme-black ${linkClass}`)
        .appendTo($menuWrapper.find('.js-menu .menu__wrapper'));
      if ($contacts.find('.header__contact')[1]) {
        $contacts.find('.header__contact')[1].remove();
        $contacts.find('.header__contact')[1].remove();
        $contacts.find('.heading')
          .remove();
        $contacts.find('.header__contacts-links')
          .remove();
        $contacts.appendTo($menuWrapper);
      }
      $online
        .addClass('button_theme-default mobile-menu__online-bank')
        .removeClass('hidden-mobile button_theme-white button_view-outlined')
        .appendTo($menuWrapper);

      $menuWrapper.appendTo(this.mobileMenu);


      this.mobileMenu.addClass('state_filled');
    }
  }

  return new Header(elem);
};
