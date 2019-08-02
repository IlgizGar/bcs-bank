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
      this.activateTabOnLoad();
    }
    createTabbarMarker() {
      const marker = document.createElement('div');
      marker.classList.add('tabbar__marker');
      const anchorStyle = window.getComputedStyle(this.active.find('span')[0], null) || this.active.find('span')[0];
      if (this.anchors.hasClass('button_line-blue')) {
        marker.style.color = '#4573d9';
      } else {
        marker.style.color = anchorStyle.color;
      }


      if (this.active.hasClass('button_view-underscore')) {
        marker.style.top = 'auto';
        marker.style.bottom = '0';
      }
      this.tabbar[0].appendChild(marker);
      return marker;
    }

    init() {
      this.active = this.tabbar.find('.js-anchor.state_active');
      if (!this.active.length) {
        this.active = this.anchors.eq(0);
        this.active.addClass('state_active');
      }
      this.marker = $(this.createTabbarMarker());
      this.setMarkerPos(this.active);

      this.$tab = $(this.active.attr('href'));
      this.$tab.removeClass('state_invisible');
    }

    events() {
      this.anchors.on('click', (e) => {
        e.preventDefault();
        this.triggerAnchor(e);
        window.history.pushState({}, '', this.active.attr('href'));
      });
      $('[data-scroll]').on('click', (e) => {
        $(this.anchors[0]).trigger('click');
        setTimeout(() => {
          document.location.hash = String($(e.currentTarget).attr('data-scroll')).replace('#', '');
        }, 600);
      });
    }
    triggerAnchor(e) {
      const $anchor = $(e.currentTarget);
      const id = $anchor.attr('href');
      if (id !== '#') {
        if (!$anchor.hasClass('state_active')) {
          this.active.removeClass('state_active');
          this.$tab.addClass('state_invisible');
          this.active = $anchor;
          this.active.addClass('state_active');
          this.setAnchorPosition();
          this.$tab = $(this.active.attr('href'));
          this.$tab.removeClass('state_invisible');
          this.setMarkerPos(this.active);
        }
        if ($anchor.closest('.js-products-tabbar').length) {
          Tabs.handleProductsFilter($anchor);
        }
      }
    }

    setMarkerPos(activeAnchor) {
      const width = activeAnchor.width();
      const position = activeAnchor.position();
      const props = {};
      props.width = width;
      props.transform = `translate3d(${position.left}px, 0, 0)`;
      this.marker.css(props);
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

    static handleProductsFilter($el) {
      const id = $el.attr('href').slice(1);
      const $filter = $('.js-products-filter');

      if (id !== 'debet') {
        $filter.addClass('state_hidden');
      } else {
        $filter.removeClass('state_hidden');
      }
    }

    activateTabOnLoad() {
      const urlHash = document.location.hash;
      if (urlHash) {
        const selector = `.js-anchor[href="${urlHash}"]`;
        console.log($(selector).length);
        if ($(selector).length) {
          const element = {
            currentTarget: $(selector)[0],
          };
          if ($(urlHash).hasClass('js-tab')) {
            if ($(urlHash).parent().hasClass('js-tab')) {
              const outerElement = {
                currentTarget: $(`.js-anchor[href="#${$(urlHash).parent('.js-tab').attr('id')}"]`)[0],
              };
              this.triggerAnchor(outerElement);
            } else {
              this.triggerAnchor(element);
            }
          }
        } else {
          setTimeout(() => {
            $('html, body').animate({ scrollTop: $(urlHash).offset().top }, 500);
          }, 3000);
        }
      }
    }
  }
  return new Tabs(elem);
};
