import $ from 'jquery';
import 'jscrollpane';

require('jquery-mousewheel')($);

module.exports = (elem) => {
  class Dropdown {
    constructor(selector) {
      this.dropdown = $(selector);
      this.select = this.dropdown.find('select');
      this.options = this.select.find('option');
      this.input = this.dropdown.find('.js-input');
      this.clear = this.dropdown.find('.js-dropdown-clear');
      this.scrollBarInited = false;
      this.init();
      this.events();
    }

    init() {
      this.list = $('<div class="dropdown__list state_invisible scroll-pane js-dropdown-list mt-10"><ul></ul></div>');
      $('body').append(this.list);

      this.options.each((i, el) => {
        this.list.find('ul').append(`
          <li data-val="${$(el).val()}">${$(el).html()}</li>
        `);
        if ($(el).attr('selected')) {
          this.dropdown.addClass('state_filled');
          this.input.val($(el).html());
        }
      });
    }

    events() {
      this.dropdown.on('click', (e) => {
        e.preventDefault();
        if (!this.scrollBarInited) {
          $('.scroll-pane').jScrollPane({
            contentWidth: 100,
            verticalDragMinHeight: 16,
            verticalDragMaxHeight: 16,
            verticalGutter: 16,
            mouseWheelSpeed: 1,
            animateDuration: 1000,
          });
          this.scrollBarInited = true;
        }
        if (!$(e.target).closest('.js-dropdown-clear').length) {
          $(e.currentTarget).toggleClass('state_explored');
          this.list.toggleClass('state_inactive');
          this.list.css('min-width', this.dropdown.outerWidth());
          this.list.css('top', this.dropdown.offset().top + this.dropdown.outerHeight());
          this.list.css('left', this.dropdown.offset().left);
        }
      });

      this.list.on('click', (e) => {
        if ($(e.target).closest('ul').length) {
          this.dropdown.addClass('state_filled');
          this.input.val($(e.target).html());

          this.options.attr('selected', false);
          this.select.find(`[value="${$(e.target).data('val')}"]`).attr('selected', 'selected');
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
          global.dropdowns.forEach((el) => {
            el.hideList();
          });
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
