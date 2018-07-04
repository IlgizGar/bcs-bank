import $ from 'jquery';

module.exports = (elem) => {
  class Accordion {
    constructor(selector) {
      this.accordion = $(selector);

      this.events();
    }

    events() {
      $('.js-accordion-header').on('click', (e) => {
        const $header = $(e.currentTarget);
        const $active = this.accordion.find('.js-accordion-header.state_active');
        if ($header.hasClass('state_active')) {
          $header.removeClass('state_active');
          $header.next().slideToggle();
        } else {
          $active.removeClass('state_active');
          $active.next().slideToggle();
          $header.addClass('state_active');
          $header.next().slideToggle();
        }
      });
    }
  }

  return new Accordion(elem);
};
