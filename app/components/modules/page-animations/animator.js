import $ from 'jquery';


export default class Animator {
  constructor(elements) {
    this.elements = elements;
    this.animations = [];
    this.init();
    this.observe();
    let timer = null;
    let delay = 0;
    this.delay = 0;
    $(window).on('scroll', () => {
      if (delay === 0) {
        const date = new Date();
        delay = date.getTime();
        document.body.dispatchEvent(new window.Event('scrollstart'));
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.body.dispatchEvent(new window.Event('scrollend'));
        const date = new Date();
        delay = date.getTime() - delay;
        this.delay = delay;
        delay = 0;
      }, 100);
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

  static scrollSpeedAnimate(el, index, delay) {
    let fade = 0;
    $(el).removeClass('state-scroll-speed-end');
    $(el).removeAttr('style');
    const scrollPos = window.pageYOffset;
    let scrollRange = 0;
    let savedRange = 0;
    $(el).addClass('state-scroll-speed');
    function tick() {
      if (window.pageYOffset > scrollPos) {
        scrollRange = window.pageYOffset - scrollPos;
        let transform = (scrollRange * ((index + 1) / 12)) - fade;
        if (transform < 0) {
          transform = 0;
        }
        fade += 2;
        $(el).css({ transform: `translate3d(0,${transform}px,0)` });
        if ($(el).hasClass('state-scroll-speed-end')) {
          savedRange = transform;
          $(el).css({ transform: `translate3d(0,${savedRange}`, transition: 'all 0.8s ease' });
          setTimeout(() => {
            $(el).css({ transform: 'translate3d(0,0,0)' });
          }, delay);
          return false;
        }
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
      threshold: 0.3,
    };
    const SpeedScrollOptions = {
      rootMargin: '0px',
      threshold: 0.1,
    };
    let scroll = 0;
    function callback(entries) {
      const check = entries[0];
      if (check.intersectionRatio <= 0) {
        return;
      }
      $(check.target).addClass('state_animate-page');
      if (!$(check.target).hasClass('state_animate-double')) {
        delete check.target.obserber;
        return;
      }
      if (scroll > window.pageYOffset) {
        if ($(check.target).hasClass('state_animate-double')) {
          $(check.target).removeClass('state_animate-page');
        }
      }
      scroll = window.pageYOffset;
    }
    function speedCallback(entries, observer) {
      const check = entries[0];
      if (check.intersectionRatio <= 0) {
        return;
      }
      observer.disconnect();
      $(check.target).find('.js-card').each((index, element) => {
        $('body').bind('scrollstart', () => {
          Animator.scrollSpeedAnimate(element, index, this.delay);
          $('body').unbind('scrollstart');
        });
      });
      if ($(check.target).hasClass('js-card')) {
        Animator.scrollSpeedAnimate(check.target, 0, this.delay);
        $('body').unbind('scrollstart');
      }
    }
    Object.keys(this.animations).forEach((key) => {
      const dataItem = this.animations[key];
      if ($(dataItem.element).offset().top < window.innerHeight) {
        // console.log($(dataItem.element).offset().top, window.innerHeight);
        $(dataItem.element).addClass('state_animate-page');
      }
      dataItem.obserber = new window.IntersectionObserver(callback, options);
      const observe = () => {
        dataItem.obserber.observe(dataItem.element);
      };
      observe();
      if ($(dataItem.element).hasClass('state_animate-double')) {
        if ($(dataItem.element).offset().top + ($(dataItem.element).height() / 2) > (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)) {
          setTimeout(() => {
            $(dataItem.element).removeClass('state_animate-page');
          }, 200);
        }
      }
      dataItem.speedObserber = new window.IntersectionObserver(speedCallback, SpeedScrollOptions);
      const speedObserve = () => {
        dataItem.speedObserber.observe(dataItem.element);
      };
      speedObserve();
    });
  }
}
