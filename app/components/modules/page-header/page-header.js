import $ from 'jquery'

export default class PageHeader {
  constructor() {
    this.stickyClass = 'page-header__nav_type-sticky';
    this.nav = null
  }

  stickyHandler() {
    let startPosition = this.nav.offset().top;
    $(window).scroll((e) => {
      if( $(e.target).scrollTop() > startPosition ) {
        this.nav.addClass(this.stickyClass).parent().css('padding-bottom', this.nav.outerHeight());
      } else {
        this.nav.removeClass(this.stickyClass).parent().css('padding-bottom', 0);
      }
    });
  }

  addStickyTitle(text) {
    const title = !!text ? text : $('.page-header__title').text();
    this.nav.find('.section__wrap').append(`<div class="page-header__nav-title">${title}</div>`)
  }


}
