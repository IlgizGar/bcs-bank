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

    let countOrders = 0;
    $.each($('.offices__collapse.state_active .collapse__item'), function (i, item) {
      if ($(item)
        .css('order') === '-1') {
        // eslint-disable-next-line no-plusplus
        countOrders++;
      }
    });

    if ($(el)
      .next('.collapse__content')
      .closest('.collapse__item')
      .hasClass(this.openClass)) {
      $.each($('.offices__collapse.state_active .collapse__item'), function (i, item) {
        $(item)
          .css('order', $(item)
            .attr('data-order'));
      });
    }
    if (countOrders > 1) {
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
      $('.collapse__item_state-open').find('.collapse__control-icon').css({ transform: 'scaleY(-1)' });
      // $(el).on('click', (e) => {
      //   console.log($(el));
      //   $('.collapse__content').css({ display: 'block' });
      // });
    } else {
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
