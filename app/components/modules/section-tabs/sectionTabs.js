import $ from 'jquery';

module.exports = (elem) => {
  class SectionTabs {
    constructor(selector) {
      this.tabsContainer = $(selector);
      this.tab = this.tabsContainer.find('[data-tab-show]');
      this.init();
      this.events();
    }

    init() {
      this.showTab($(this.tab[0]).attr('data-tab-show'));
    }
    showTab(id) {
      this.tab.removeClass('state_active');
      this.tabsContainer.find(`[data-tab-show="${id}"]`).addClass('state_active');
      this.tab.each((index, element) => {
        const tab = $($(element).attr('data-tab-show'));
        tab.addClass('state_hidden');
        $(id).removeClass('state_hidden');
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
