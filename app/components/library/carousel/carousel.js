import $ from 'jquery';
import 'slick-carousel';

module.exports = (elem) => {
  class Carousel {
    constructor(selector) {
      this.carousel = $(selector);

      this.init();
    }

    init() {
      this.carousel.slick({});
    }
  }

  return new Carousel(elem);
};
