import $ from 'jquery';

export default class Footer {
  constructor() {
    this.footer = $('.js-footer');
    this.menu = this.footer.find('.js-footer-menu');

    this.events();
  }

  events() {
    this.menu.on('click', (e) => {
      $(e.currentTarget).find('.js-footer-menu-content').slideToggle(255);
      $(e.currentTarget).toggleClass('state_explored');
    });
  }
}
