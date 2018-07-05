import $ from 'jquery';
import 'jscrollpane';

require('jquery-mousewheel')($);

module.exports = (elem) => {
  class Dropdown {
    constructor(selector) {
      this.dropdown = $(selector);
      this.select = this.dropdown.find('select');
      this.options = this.select.find('option');
      this.list = this.dropdown.find('.js-dropdown-list');
      this.input = this.dropdown.find('.js-input');
      this.clear = this.dropdown.find('.js-dropdown-clear');

      this.init();
      this.events();
    }

    init() {
      for (const option of this.options) {
        this.list.find('ul').append(`
          <li data-val="${$(option).val()}">
            ${$(option).html()}
          </li>
        `);
      }

      $('.scroll-pane').jScrollPane({
        contentWidth: 100,
        verticalDragMinHeight: 16,
        verticalDragMaxHeight: 16,
        verticalGutter: 16,
        mouseWheelSpeed: 1,
        animateDuration: 1000,
      });
    }

    events() {
      this.dropdown.on('click', (e) => {
        if (!$(e.target).closest('.js-dropdown-clear').length) {

          $(e.currentTarget).toggleClass('state_explored');
          this.list.toggleClass('state_inactive');

          if ($(e.target).closest('.js-dropdown-list').length) {
            if ($(e.target).closest('ul').length) {
              this.dropdown.addClass('state_filled');
              this.input.val($(e.target).html());
              this.options.attr('selected', false);
              this.select.find('[value="' + $(e.target).data('val') + '"]').attr('selected', 'selected');
            }
          }
        }
      });

      this.clear.on('click', () => {
        this.dropdown.removeClass('state_filled');
        this.hideList();
        this.input.val('');
        this.options.attr('selected', false);
      });

      $(window).on('click', (e) => {
        if (!$(e.target).closest('.js-dropdown').length) {
          for (const dropdown of global.dropdowns) {
            dropdown.hideList();
          }
        }
      });
    }

    hideList() {
      this.dropdown.removeClass('state_explored');
      this.list.addClass('state_inactive');
    }
  }

  return new Dropdown(elem);
};
