import $ from 'jquery';

export default class Collapse {
  constructor($el) {
    this.$itemsBlock = $el;
    this.event = false;
    this.openClass = 'collapse__item_state-open';
    this.init();
  }

  init() {
    this.$itemsBlock.find('.collapse__control').each((i, el) => {
      $(el).on('click', (e) => {
        this.openContent(e.currentTarget);
      });
    });
  }

  openContent(el) {
    this.event = true;
    let collapseItem = $(el)
      .next('.collapse__content')
      .closest('.collapse__item');
    console.log(collapseItem);
    if (collapseItem.hasClass(this.openClass)) {
      collapseItem.css('order', collapseItem.attr('data-order'));
    }
    $(el)
      .next('.collapse__content')
      .slideToggle(225)
      .closest('.collapse__item')
      .toggleClass(this.openClass)
      .siblings()
      .removeClass(this.openClass)
      .children('.collapse__content')
      .slideUp(225);
    $('.js-route-built')
      .removeClass('route-built--active');
    $('.js-button-bild-route')
      .removeClass('hidden-block');
  }

  closeContent() {
    this.$itemsBlock.find(this.openClass)
      .removeClass(this.openClass)
      .find('.collapse__content')
      .slideUp(225);
    $('.js-route-built').removeClass('route-built--active');
    $('.js-button-bild-route').removeClass('hidden-block');
  }
}
