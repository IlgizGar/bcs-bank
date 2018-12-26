import $ from 'jquery';

export default class Footer {
  constructor() {
    this.footer = $('.js-footer');
    this.menu = this.footer.find('.js-footer-menu');

    this.events();
  }

  events() {
    this.menu.on('click', (e) => {
      if (window.innerWidth < 767) {
        $(e.currentTarget).find('.js-footer-menu-content').slideToggle(255);
        $(e.currentTarget).toggleClass('state_explored');
      }
    });
    this.menu.find('.js-button').on('click', (e) => {
      const link = $(e.currentTarget);
      const url = String(link[0].href).split('#')[0];
      const currentUrl = String(window.location.href).split('#')[0];
      if (currentUrl === url) {
        window.location.reload();
      }
    });
  }
}
