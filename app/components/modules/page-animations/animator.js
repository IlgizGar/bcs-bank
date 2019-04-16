import $ from 'jquery';


export default class Animator {
  constructor(elements) {
    this.elements = elements;
    this.animations = [];
    this.init();
    this.observe();
    let timer = null;
    $(window).on('scroll', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.body.dispatchEvent(new window.Event('scrollend'));
      }, 1);
    });
  }
  init() {
    if (this.elements.length) {
      this.elements.each((i, el) => {
        $(el).addClass('animate');
        this.animations.push({
          element: el,
        });
      });
    }
  }

  static scrollSpeedAnimate(el, index) {
    $(el).removeClass('state-scroll-speed-end');
    $(el).removeAttr('style');
    const scrollPos = window.pageYOffset;
    let scrollRange = 0;
    let savedRange = 0;
    $(el).addClass('state-scroll-speed');
    function tick() {
      scrollRange = window.pageYOffset - scrollPos;
      $(el).css({ transform: `translate3d(0,${scrollRange * ((index + 1) / 3)}px,0)` });
      if ($(el).hasClass('state-scroll-speed-end')) {
        savedRange = scrollRange;
        $(el).css({ transform: `translate3d(0,${savedRange * ((index + 1) / 3)}px,0)`, transition: 'all 0.8s ease' });
        setTimeout(() => {
          $(el).css({ transform: 'translate3d(0,0,0)' });
        }, 10);
        return false;
      }
      window.requestAnimationFrame(tick);
      return true;
    }
    tick();
    $('body').bind('scrollend', () => {
      $(el).addClass('state-scroll-speed-end');
      $('body').unbind('scrollend');
    });
  }

  observe() {
    const options = {
      rootMargin: '0px',
      threshold: 0.5,
    };
    let scroll = 0;
    Object.keys(this.animations).forEach((key) => {
      const dataItem = this.animations[key];
      function callback(entries) {
        const check = entries[0];
        if (check.isIntersecting) {
          $(check.target).addClass('state_animate-page');
          if (!$(check.target).hasClass('state_animate-double')) {
            delete dataItem.obserber;
          }
          $(check.target).find('.js-card').each((index, element) => {
            Animator.scrollSpeedAnimate(element, index);
          });
        }
        if (scroll > window.pageYOffset) {
          if ($(check.target).hasClass('state_animate-double')) {
            $(check.target).removeClass('state_animate-page');
          }
        }
        scroll = window.pageYOffset;
      }
      dataItem.obserber = new window.IntersectionObserver(callback, options);
      const observe = () => {
        dataItem.obserber.observe(dataItem.element);
      };
      observe();
      if ($(dataItem.element).offset().top + ($(dataItem.element).height() / 2) > (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)) {
        setTimeout(() => {
          $(dataItem.element).removeClass('state_animate-page');
        }, 200);
      }
    });
  }
}
