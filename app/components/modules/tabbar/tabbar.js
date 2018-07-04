import $ from 'jquery';

module.exports = (elem) => {
  class Tabs {
    constructor(selector) {
      this.tabbar = $(selector);
      this.anchors = this.tabbar.find('.js-anchor');

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
          this.$tab = $(this.active.attr('href'));
          this.$tab.removeClass('state_invisible');
        }
      });
    }
  }

  return new Tabs(elem);
};
