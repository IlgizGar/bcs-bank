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
      this.handle = null;
      this.id = '';

      this.input.attr('readonly', true);

      this.init();
      this.events();
    }

    init() {
      this.id = this.dropdown.data('id') ? this.dropdown.data('id') : `list_for_${this.select.attr('name')}`;
      this.dropdown.find('input').attr('autocomplete', 'off');
      this.list = $(`<div id="${this.id}" class="dropdown__list state_invisible scroll-pane js-dropdown-list mt-10"><ul tabindex="1"></ul></div>`);
      $('.js-page').append(this.list);

      this.options.each((i, el) => {
        this.list.find('ul').append(`
          <li tabindex="${i + 1}" data-val="${$(el).val()}">${$(el).html()}</li>
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
        if (this.dropdown.hasClass('state_explored')) {
          this.hideList();
        } else {
          this.showList(e.target);
        }
      });
      this.dropdown.find('input').on('focus', (e) => {
        e.preventDefault();
        this.showList(e.target);
      });

      let focusedElement;

      this.dropdown.find('input').on('keydown', (e) => {
        console.log(e.keyCode);
        focusedElement = null;
        if (e.keyCode === 40) {
          e.stopPropagation();
          e.preventDefault();
          this.list.find('ul').focus();
        }
      });
      let listEl;
      this.list.on('mousedown', (e) => {
        listEl = e.target;
      });


      this.list.find('ul').on('keydown', (e) => {
        if (e.keyCode === 40) {
          e.stopPropagation();
          e.preventDefault();
          if (!focusedElement) {
            focusedElement = this.list.find('li:first-child');
          } else {
            focusedElement = focusedElement.next();
          }
          focusedElement.focus();
        }
        if (e.keyCode === 38) {
          e.stopPropagation();
          e.preventDefault();
          if (!focusedElement) {
            focusedElement = this.list.find('li:first-child');
          } else {
            focusedElement = focusedElement.prev();
          }
          focusedElement.focus();
        }
      });

      this.list.find('li').on('keydown', (e) => {
        if (e.keyCode === 13) {
          console.log(e);
          listEl = $(e.currentTarget);
          this.list.trigger('click');
          $(e.currentTarget).trigger('click');
          this.dropdown.focus();
        }
      });

      this.list.on('click', (e) => {
        if ($(e.target).closest('ul').length) {
          this.dropdown.addClass('state_filled');
          this.input.val($(listEl).html());
          if (this.input.closest('form').length) {
            this.input.valid();
          }
          this.options.attr('selected', false);
          this.select.find(`[value="${$(e.target).data('val')}"]`).attr('selected', 'selected');
          this.hideList();

          if (this.id === 'documents-filter') {
            global.documentsFilter.applyFilter($(e.target).html());
          }
        }
        this.select.trigger('change');
      });

      this.clear.on('click', () => {
        this.clearDropdown();

        if (this.id === 'documents-filter') {
          global.documentsFilter.applyFilter('');
        }
      });

      $(window).on('click', (e) => {
        if (!$(e.target).closest('.js-dropdown').length) {
          global.dropdowns.forEach((el) => {
            el.hideList();
          });
        }
      });
    }

    showList(el) {
      this.dropdown.addClass('state_filled');
      if (!$(el).closest('.js-dropdown-clear').length) {
        this.dropdown.addClass('state_explored');
        if (!this.scrollBarInited) {
          this.dropdown.find('.scroll-pane').jScrollPane({
            contentWidth: 100,
            verticalDragMinHeight: 16,
            verticalDragMaxHeight: 16,
            verticalGutter: 16,
            mouseWheelSpeed: 1,
            animateDuration: 1000,
          });
          this.scrollBarInited = true;
        }
        this.list.removeClass('state_invisible');
        this.list.css('min-width', this.dropdown.outerWidth());
        this.list.css('top', this.dropdown.offset().top + this.dropdown.outerHeight());
        this.list.css('left', this.dropdown.offset().left);
      }
    }

    hideList() {
      this.dropdown.removeClass('state_explored');
      this.list.addClass('state_invisible');
    }

    clearDropdown() {
      if (this.dropdown.hasClass('state_filled')) {
        this.dropdown.removeClass('state_filled');
        this.hideList();
        this.input.val('');
        this.options.attr('selected', false);
        if (this.input.closest('form').length) {
          this.input.valid();
        }
      }
    }
  }

  return new Dropdown(elem);
};
