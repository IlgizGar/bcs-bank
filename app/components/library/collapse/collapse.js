import $ from 'jquery';

export default class Collapse {
  constructor($el) {
    this.$itemsBlock = $el;
    this.event = false;
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
    $(el).next('.collapse__content').slideToggle(225).closest('.collapse__item')
      .toggleClass('collapse__item_state-open')
      .siblings()
      .removeClass('collapse__item_state-open')
      .children('.collapse__content')
      .slideUp(225);
  }

  closeContent() {
    this.$itemsBlock.find('.collapse__item_state-open')
      .removeClass('collapse__item_state-open')
      .find('.collapse__content')
      .slideUp(225);
  }
}
