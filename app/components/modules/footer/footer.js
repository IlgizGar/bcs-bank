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
      document.location.href = link.attr('href');
      document.location.reload();
    });
  }
}
