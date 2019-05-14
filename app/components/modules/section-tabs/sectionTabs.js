import $ from 'jquery';

module.exports = (elem) => {
  class SectionTabs {
    constructor(selector) {
      this.tabsContainer = $(selector);
      this.tab = this.tabsContainer.find('[data-tab-show]');
      this.marker = $(this.createTabbarMarker());
      this.init();
      this.events();
    }

    createTabbarMarker() {
      const marker = document.createElement('div');
      marker.classList.add('tabbar__marker');
      marker.style.color = '#3b66c5';
      marker.style.bottom = '0';
      marker.style.top = 'auto';
      this.tab.parent()[0].appendChild(marker);
      return marker;
    }

    setMarkerPos(activeAnchor) {
      const width = activeAnchor.width();
      const position = activeAnchor.position();
      const props = {};
      props.width = width;
      props.transform = `translate3d(${position.left}px, 0, 0)`;
      this.marker.css(props);
    }

    init() {
      this.showTab($(this.tab[0]).attr('data-tab-show'));
    }
    showTab(id) {
      this.tab.removeClass('state_active');
      const activeTab = this.tabsContainer.find(`[data-tab-show="${id}"]`);
      activeTab.addClass('state_active');
      this.setMarkerPos(activeTab);
      this.tab.each((index, element) => {
        const tab = $($(element).attr('data-tab-show'));
        tab.addClass('state_hidden');
        $(id).removeClass('state_hidden');
        if ($(id).find('.slick-slider').length) {
          $(id).find('.slick-slider').slick('setPosition', '0');
        }
      });
    }
    events() {
      this.tab.on('click', (event) => {
        const element = $(event.currentTarget);
        this.showTab(element.attr('data-tab-show'));
      });
    }
  }
  return new SectionTabs(elem);
};
