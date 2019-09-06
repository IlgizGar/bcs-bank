import $ from 'jquery';
import Lottie from 'lottie-web';


export default class Animations {
  constructor(elements) {
    this.elements = elements;
    this.animations = [];
    this.init();
    this.observe();
  }
  init() {
    if (this.elements.length) {
      this.elements.each((i, el) => {
        if ($(el).data('illustration').length) {
          this.animations.push({
            element: el,
            animation: Lottie.loadAnimation({
              container: el,
              renderer: 'svg',
              loop: true,
              autoplay: false,
              path: `/assets/illustrations/${$(el).data('illustration')}.json`,
            }),
          });
        }
      });
    }
  }
  observe() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.01,
    };
    Object.keys(this.animations).forEach((key) => {
      const dataItem = this.animations[key];
      function callback(entries) {
        const check = entries[0];
        if (check.isIntersecting) {
          dataItem.animation.play();
        } else {
          dataItem.animation.stop();
        }
      }
      dataItem.obserber = new window.IntersectionObserver(callback, options);
      const observe = () => {
        dataItem.obserber.observe(dataItem.element);
      };
      observe();
    });
  }
}
