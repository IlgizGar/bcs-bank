import $ from 'jquery';
import 'slick-carousel';
import Context from "../context/context";

module.exports = (elem) => {
  class Carousel {
    constructor(selector) {
      this.carousel = $(selector);
      this.paging = $('.js-carousel-pagination');
      this.progressbar = $('.js-carousel-progressbar');
      this.id = this.carousel.data('id');

      this.init();
      this.events();
    }

    init() {
      const self = this;

      this.carousel.on('init reInit afterChange', (event, slick, currentSlide) => {
        const i = (!currentSlide ? 0 : currentSlide) + 1;
        self.paging.find('span:first-child').html(i < 10 ? `0${i}` : i);
        self.paging.find('span:last-child').html(slick.slideCount < 10 ? `0${slick.slideCount}` : slick.slideCount);
        self.progressbar.addClass('state_busy');
      });
      this.carousel.on('beforeChange', () => {
        self.progressbar.removeClass('state_busy');
      });

      this.next = '<button class="carousel-controls__button carousel-controls__button_type-next">' +
        ' <svg role="presentation" class="icon icon-tr-arrow">\n' +
        '    <use xlink:href="assets/images/icons.svg#icon_tr-arrow"></use>\n' +
        '  </svg>' +
        '</button>';

      this.prev = '<button class="carousel-controls__button carousel-controls__button_type-prev">' +
        ' <svg role="presentation" class="icon icon-tr-arrow">\n' +
        '    <use xlink:href="assets/images/icons.svg#icon_tr-arrow"></use>\n' +
        '  </svg>' +
        '</button>';

      switch (this.id) {
        case 'index-header':
          this.carousel.not('.slick-initialized').slick({
            autoplay: true,
            autoplaySpeed: 12000,
            appendArrows: $('.js-index-carousel-controls'),
            nextArrow: this.next,
            prevArrow: this.prev,
          });
          break;
        default:
          this.initMobileSlick(this.carousel.data('breakpoint') - 1);
          break;
      }
    }

    events() {
      $(window).on('resize', () => {
        if (typeof this.carousel.data('breakpoint') !== 'undefined') {
          if (parseInt(this.carousel.data('breakpoint'), 0) - 1 >= window.innerWidth) {
            this.initMobileSlick(parseInt(this.carousel.data('breakpoint'), 0) - 1);
          }
        }
      });
    }

    initMobileSlick(bpoint) {
      this.carousel.not('.slick-initialized').slick({
        appendArrows: this.carousel.next('.js-carousel-controls'),
        nextArrow: this.next,
        prevArrow: this.prev,
        mobileFirst: true,
        responsive: [
          {
            breakpoint: bpoint,
            settings: 'unslick',
          },
        ],
      });
      this.carousel.find('.js-context').each((i, el) => {
        global.contexts[$(el).data('id')] = Context(el);
      });
    }
  }

  return new Carousel(elem);
};
