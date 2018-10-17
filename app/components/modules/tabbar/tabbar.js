import $ from 'jquery';

module.exports = (elem) => {
  class Tabs {
    constructor(selector) {
      this.tabbar = $(selector);
      this.anchors = this.tabbar.find('.js-anchor');
      this.scroller = this.tabbar.closest('.js-tab-scroll');
      this.wrapper = this.scroller.parent();

      this.init();
      this.events();
    }

    init() {
      this.active = this.tabbar.find('.js-anchor.state_active');
      if (!this.active.length) {
        this.active = this.anchors.eq(0);
        this.active.addClass('state_active');
      }

      this.$tab = $(this.active.attr('href'));
      this.$tab.removeClass('state_invisible');
    }

    events() {
      this.anchors.on('click', (e) => {
        e.preventDefault();

        const $anchor = $(e.currentTarget);

        if (!$anchor.hasClass('state_active')) {
          this.active.removeClass('state_active');
          this.$tab.addClass('state_invisible');

          this.active = $anchor;
          this.active.addClass('state_active');
          this.setAnchorPosition();
          this.$tab = $(this.active.attr('href'));
          this.$tab.removeClass('state_invisible');
        }

        if($anchor.closest('.js-products-tabbar').length) {
          this.handleProductsFilter($anchor);
        }
      });
    }

    setAnchorPosition() {
      if (window.innerWidth < this.tabbar.outerWidth()) {
        if (this.anchors.index(this.active) === 0) {
          this.wrapper.addClass('gradient_right').removeClass('gradient_left');
        } else if (this.anchors.index(this.active) === this.anchors.length - 1) {
          this.wrapper.addClass('gradient_left').removeClass('gradient_right');
        } else {
          this.wrapper.addClass('gradient_left gradient_right');
        }
        this.scroller.animate({ scrollLeft: this.active[0].offsetLeft - ((window.innerWidth / 2) - (this.active.outerWidth() / 2)) }, 300);
      } else {
        this.wrapper.removeClass('gradient_left gradient_right');
      }
    }

    handleProductsFilter($el) {
      const id = $el.attr('href').slice(1);
      const $filter = $('.js-products-filter');

      if(id !== 'debet') {
        $filter.addClass('state_hidden');
      } else {
        $filter.removeClass('state_hidden');
      }
    }
  }

  return new Tabs(elem);
};
