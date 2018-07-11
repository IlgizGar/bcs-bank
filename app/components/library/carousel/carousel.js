import $ from 'jquery';
import 'slick-carousel';

module.exports = (elem) => {
  class Carousel {
    constructor(selector) {
      this.carousel = $(selector);
      this.paging = $('.js-carousel-pagination');
      this.progressbar = $('.js-carousel-progressbar');

      this.init();
    }

    init() {
      let self = this;

      this.carousel.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        const i = (!currentSlide ? 0 : currentSlide) + 1;
        self.paging.find('span:first-child').html(i < 10 ? '0' + i : i);
        self.paging.find('span:last-child').html(slick.slideCount < 10 ? '0' + slick.slideCount : slick.slideCount);
        self.progressbar.addClass('state_busy');
      });
      this.carousel.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        self.progressbar.removeClass('state_busy');
      });

      this.carousel.slick({
        autoplay: true,
        autoplaySpeed: 12000,
        appendArrows: $('.js-carousel-controls'),
        nextArrow: '<button class="carousel-controls__button carousel-controls__button_type-next">' +
        ' <svg role="presentation" class="icon icon-tr-arrow">\n' +
        '    <use xlink:href="assets/images/icons.svg#icon_tr-arrow"></use>\n' +
        '  </svg>' +
        '</button>',
        prevArrow: '<button class="carousel-controls__button carousel-controls__button_type-prev">' +
        ' <svg role="presentation" class="icon icon-tr-arrow">\n' +
        '    <use xlink:href="assets/images/icons.svg#icon_tr-arrow"></use>\n' +
        '  </svg>' +
        '</button>',
      });
    }
  }

  return new Carousel(elem);
};
