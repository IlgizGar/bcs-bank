import $ from 'jquery';

export default class Collapse {
  constructor($el) {
    this.$itemsBlock = $el;
    this.init();
  }

  init() {
    this.$itemsBlock.find('.collapse__control').each((i, el) => {
      $(el).on('click', (e) => {
        Collapse.openContent(e.currentTarget);
      });
    });
  }
  static openContent(el) {
    $(el).next('.collapse__content').slideToggle(225).closest('.collapse__item')
      .toggleClass('collapse__item_state-open')
      .siblings()
      .removeClass('collapse__item_state-open')
      .children('.collapse__content')
      .slideUp(225);
  }
}
