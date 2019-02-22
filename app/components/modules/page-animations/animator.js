import $ from 'jquery';

export default class Animator {
  constructor(elements) {
    this.elements = elements;
    this.animations = [];
    this.init();
    this.observe();
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
    });
  }
}
