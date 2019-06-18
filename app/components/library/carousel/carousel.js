import $ from 'jquery';
import 'slick-carousel';
import Tabs from '../../modules/tabbar/tabbar';
// import Context from '../context/context';

module.exports = (elem) => {
  class Carousel {
    constructor(selector) {
      this.carousel = $(selector);
      this.progressbar = $('.js-carousel-progressbar');
      this.ProgressBarSpeed = 0;
      this.progressBarstoped = false;
      this.id = this.carousel.data('id');
      this.paging = null;
      this.progressBarTimer = null;
      this.init();
      this.events();
    }

    static setPagination(paging, slick, currentSlide) {
      const i = (!currentSlide ? 0 : currentSlide) + 1;
      paging.find('span:first-child').html(i < 10 ? `0${i}` : i);
      paging.find('span:last-child').html(slick.slideCount < 10 ? `0${slick.slideCount}` : slick.slideCount);
    }

    init() {
      const self = this;
      this.paging = $(`.js-carousel-pagination[data-carousel="${this.id}"]`);

      this.carousel.on('init reInit', (event, slick, currentSlide) => {
        // console.log('SLICK', slick);
        if (!slick.$slider.hasClass('controls-initialized')) {
          const paging = this.paging.length ? this.paging : slick.$slider.next('.js-carousel-controls').find('.js-carousel-pagination');
          Carousel.setPagination(paging, slick, currentSlide);
          slick.$slider.addClass('controls-initialized');
        }
      });

      // this.carousel.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
      //   if ((currentSlide === 0 && nextSlide === slick.$slides.length - 1) || (currentSlide === slick.$slides.length - 1 && nextSlide === 0)) {
      //     console.log('NEXT_ROUND');
      //   } else {
      //     this.carousel.find('.slick-slide:not(.slick-active) .js-scroll-animate.state_animate-page').removeClass('state_animate-page');
      //   }
      //
      // });

      this.carousel.on('afterChange', (event, slick, currentSlide) => {
        const paging = this.paging.length ? this.paging : slick.$slider.next('.js-carousel-controls').find('.js-carousel-pagination');
        Carousel.setPagination(paging, slick, currentSlide);
        if (this.carousel.find('.slick-slide:not(.slick-active) .js-scroll-animate').hasClass('state_animate-page')) {
          // console.log('REMOVE_ANIMATION');
          this.carousel.find('.slick-slide:not(.slick-active) .js-scroll-animate.state_animate-page').removeClass('state_animate-page');
        }
        // console.log('ANIMATED', slick);
      });
      this.carousel.on('mouseenter', () => {
        console.log('pause');
        self.progressBarPause();
      });
      this.carousel.on('mouseleave', () => {
        self.progressBarPlay();
      });
      self.progressbar.removeClass('state_busy');
      this.next = '<button class="carousel-controls__button carousel-controls__button_type-next">' +
        ' <svg role="presentation" class="icon icon-tr-arrow">\n' +
        '    <use xlink:href="/assets/images/icons.svg#icon_tr-arrow"></use>\n' +
        '  </svg>' +
        '</button>';

      this.prev = '<button class="carousel-controls__button carousel-controls__button_type-prev">' +
        ' <svg role="presentation" class="icon icon-tr-arrow">\n' +
        '    <use xlink:href="/assets/images/icons.svg#icon_tr-arrow"></use>\n' +
        '  </svg>' +
        '</button>';
      const count = this.carousel.find('>*').length;
      const global = {};
      global.tabs = [];
      switch (this.id) {
        case 'index-header':
          this.carousel.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
            Carousel.setButtonsUrls(event, slick, currentSlide, nextSlide);
            $(slick.$slides[currentSlide]).removeClass('state_animate');
            $(slick.$slides[nextSlide]).addClass('state_init');
            $(slick.$slides[nextSlide]).addClass('state_animate');
            this.progressBarPause();
          });
          this.carousel.on('afterChange', () => {
            this.progressBarPlay();
          });
          this.carousel.on('init', (event, slick) => {
            Carousel.setButtonsUrls(event, slick);
            $(slick.$slides[0]).addClass('state_animate');
            setTimeout(() => {
              $('.js-carousel-progressbar').addClass('state_busy');
            }, 200);
          });

          this.carousel.not('.slick-initialized').slick({
            autoplay: true,
            autoplaySpeed: 12000,
            speed: 800,
            appendArrows: $('.js-index-carousel-controls'),
            nextArrow: this.next,
            prevArrow: this.prev,
            fade: true,
            cssEase: 'linear',
          });
          break;
        case 'advice-filtered':
          this.initDefault([
            {
              breakpoint: 9999,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              },
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ], this.carousel.next('.js-carousel-controls'), false, false);
          break;
        case 'bonus-card':
          if (count <= 3) {
            this.carousel.prev('.js-carousel-controls').hide();
          } else {
            this.carousel.prev('.js-carousel-controls').show();
          }
          this.initDefault([
            {
              breakpoint: 9999,
              settings: (count > 3) ? {
                slidesToShow: 3,
                slidesToScroll: 1,
              } : 'unslick',
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ], this.carousel.prev('.js-carousel-controls'), false, false);
          break;
        default:
          this.initMobileSlick(this.carousel.data('breakpoint') - 1);
          break;
      }
    }

    progressBarPlay() {
      this.progressbar.addClass('state_busy');
    }

    progressBarPause() {
      this.progressbar.removeClass('state_busy');
    }

    static setButtonsUrls(event, slick, prevSlide, currentSlide) {
      const slideNum = (currentSlide !== undefined) ? currentSlide : 0;

      const url = $(slick.$slides[slideNum]).find('[data-href]').data('href');
      const urlSecond = $(slick.$slides[slideNum]).find('[data-read-more-href]').data('read-more-href');
      const el = $(slick.$slides[slideNum]).find('[data-scroll-id]').data('scroll-id');
      const $redirectScroll = $('.js-redirect-scroll');
      const $redirectUrl = $('.js-redirect-url');

      if (url !== undefined) {
        $redirectUrl.attr('href', url);
      }
      if (urlSecond !== undefined) {
        $redirectScroll.attr('href', urlSecond);
      } else if (url !== undefined && el !== undefined) {
        $redirectScroll.attr('href', `${url}${el ? '?' : ''}${el}`);
      }
    }

    events() {
      const global = {};
      global.tabs = [];

      this.carousel.on('destroy', () => {
        this.carousel.each((i, el) => {
          global.tabs.push(Tabs(el));
        });
      });
      this.carousel.on('breakpoint', () => {
        this.carousel.each((i, el) => {
          global.tabs.push(Tabs(el));
        });
      });
      $(window).on('resize', () => {
        if (typeof this.carousel.data('breakpoint') !== 'undefined') {
          if (parseInt(this.carousel.data('breakpoint'), 0) - 1 >= window.innerWidth) {
            this.initMobileSlick(parseInt(this.carousel.data('breakpoint'), 0) - 1);
          }
        }
      });
    }

    initMobileSlick(bpoint) {
      // this.carousel.not('.slick-initialized').slick({
      //   appendArrows: this.carousel.next('.js-carousel-controls'),
      //   nextArrow: this.next,
      //   prevArrow: this.prev,
      //   mobileFirst: true,
      //   responsive: [
      //     {
      //       breakpoint: bpoint,
      //       settings: 'unslick',
      //     },
      //   ],
      // });
      this.initDefault([
        {
          breakpoint: bpoint,
          settings: 'unslick',
        },
      ], this.carousel.next('.js-carousel-controls'), true, true);
    }

    initDefault(responsiveSettings, appendArrowsSet, mobileFirst, infinite) {
      this.carousel.not('.slick-initialized').slick({
        appendArrows: appendArrowsSet,
        nextArrow: this.next,
        prevArrow: this.prev,
        mobileFirst: !!mobileFirst,
        infinite: !!infinite,
        responsive: responsiveSettings,
      });
    }
  }

  return new Carousel(elem);
};
