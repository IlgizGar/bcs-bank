import $ from 'jquery';
import 'slick-carousel';

module.exports = (elem) => {
  class Carousel {
    constructor(selector) {
      this.carouselBlock = $(selector);
      this.carousel = this.carouselBlock.children('.media-slider__slides');
      this.progressWrapper = this.carouselBlock.find('.media-slider__progressbar');
      this.totalSlides = this.carouselBlock.find('.media-slider__slides-item').length;
      this.slidePreview = $('<span class="media-slider__progressbar-preview"><img src=""></span>');
      this.currentSlide = 1;
      this.slideTime = 12000;
      this.init();
    }

    init() {
      this.slidesCounter();
      this.slidersProgress();
      this.initSlider();
    }

    slidesCounter() {
      const counterWrapper = this.carouselBlock.find('.media-slider__counter');
      this.carousel.on('init reInit afterChange', (event, slick, currentSlide) => {
        this.currentSlide = (!currentSlide ? 0 : currentSlide) + 1;
        counterWrapper.children('.media-slider__counter-current').html(this.currentSlide < 10 ? `0${this.currentSlide}` : this.currentSlide);
        counterWrapper.children('.media-slider__counter-total').html(slick.slideCount < 10 ? `0${slick.slideCount}` : slick.slideCount);
      });
    }

    initSlider() {
      this.carousel.slick({
        autoplay: true,
        autoplaySpeed: this.slideTime,
        appendArrows: this.carouselBlock.find('.media-slider__arrows'),
        nextArrow: Carousel.renderButton('next'),
        prevArrow: Carousel.renderButton('prev'),
      });
    }

    static renderButton(mod) {
      const arrow = ' <svg role="presentation" class="icon icon-tr-arrow">\n' +
        '    <use xlink:href="assets/images/icons.svg#icon_tr-arrow"></use>\n' +
        '  </svg>';
      const clases = 'media-slider__control-button media-slider__control-button_type';
      return `<button class="${clases}-${mod}">${arrow}</button>`;
    }

    slidersProgress() {
      let progressPart = '';
      let offset = null;
      let x = 0;
      // let y = 0;

      this.progressWrapper.html('');

      this.progressWrapper.append(this.slidePreview);
      for (let i = 0; i < this.totalSlides; i += 1) {
        progressPart = $(`<span class="media-slider__progressbar-part"><span class="media-slider__progressbar-part-color" style="animation-duration: ${this.slideTime}ms;"></span></span>`);
        progressPart.on('mouseenter', () => {
          this.slidePreview.children('img').attr('src', this.carouselBlock.find('.slick-slide:not(.slick-cloned)').eq(i).find('img').attr('src'));
        });
        progressPart.on('click', () => {
          this.carousel.slick('slickGoTo', i);
        });

        this.progressWrapper.append(progressPart);
      }

      this.progressWrapper.on('mousemove', (e) => {
        offset = $(e.target).closest('.media-slider__progressbar').offset();
        x = e.pageX - offset.left;
        // const y = e.pageY - offset.top;

        this.slidePreview.css({
          left: `${x - (this.slidePreview.outerWidth() / 2)}px`,
        });
      });

      // TODO: не работает в обратном направлении
      this.carousel.on('init reInit afterChange', () => {
        this.progressWrapper.children('.media-slider__progressbar-part').each((i, el) => {
          if (i + 1 === this.currentSlide) {
            $(el).addClass('media-slider__progressbar-part_filling');
          } else {
            $(el).removeClass('media-slider__progressbar-part_filling');
          }
        });
      });
    }
  }

  return new Carousel(elem);
};
