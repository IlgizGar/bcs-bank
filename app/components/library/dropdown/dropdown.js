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
      this.filledClass = 'state_filled';
      this.exploredClass = 'state_explored';
      this.hiddenClass = 'state_hidden';
      this.invisibleClass = 'state_invisible';

      this.input.attr('readonly', true);

      this.init();
      this.events();
    }

    init() {
      this.id = this.dropdown.data('id') ? this.dropdown.data('id') : `list_for_${this.select.attr('name')}`;
      this.dropdown.find('input').attr('autocomplete', 'off');
      this.list = $(`<div id="${this.id}" class="dropdown__list ${this.invisibleClass} scroll-pane js-dropdown-list mt-10"><ul tabindex="1"></ul></div>`);
      $('.js-page').append(this.list);

      this.list[0].Dropdown = this;

      this.options.each((i, el) => {
        this.list.find('ul').append(`
          <li tabindex="${i + 1}" data-val="${$(el).val()}">${$(el).html()}</li>
        `);
        if ($(el).attr('selected')) {
          this.dropdown.addClass(this.filledClass);
          this.input.val($(el).html());
        }
      });
    }

    events() {
      this.dropdown.on('click', (e) => {
        e.preventDefault();
        if (this.dropdown.hasClass(this.exploredClass)) {
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

      function focusOn(direction, self) {
        if (!focusedElement) {
          focusedElement = self.list.find('li:first-child');
        }
        if (direction === 'next') {
          focusedElement = focusedElement.next();
        } else {
          focusedElement = focusedElement.prev();
        }
        focusedElement.focus();
      }

      this.dropdown.find('input').on('keydown', (e) => {
        focusedElement = null;
        if (e.keyCode === 40) {
          e.stopPropagation();
          e.preventDefault();
          this.list.find('ul').focus();
        }
      });
      this.list.on('mousedown', (e) => {
        this.listEl = e.target;
      });


      this.list.find('ul').on('keydown', (e) => {
        if (e.keyCode === 40) {
          e.stopPropagation();
          e.preventDefault();
          focusOn('next', this);
        }
        if (e.keyCode === 38) {
          e.stopPropagation();
          e.preventDefault();
          focusOn('prev', this);
        }
      });

      this.list.find('li').on('keydown', (e) => {
        if (e.keyCode === 13) {
          this.listEl = $(e.currentTarget);
          this.list.trigger('click');
          $(e.currentTarget).trigger('click');
          this.dropdown.find('input').focus();
        }
      });

      this.list.on('click', (e) => {
        if ($(e.target).closest('ul').length) {
          this.setValue($(e.target).data('val'));
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
          Object.keys(global.dropdowns)
            .forEach((item) => {
              const dataItem = global.dropdowns[item];
              dataItem.hideList();
            });
        }
      });
    }

    setValue(value) {
      this.dropdown.addClass(this.filledClass);
      this.input.val(this.list.find(`[data-val="${value}"]`).html());
      if (this.input.closest('form').length) {
        this.input.valid();
      }
      this.options.attr('selected', false);
      this.select.find(`[value="${value}"]`).attr('selected', 'selected');
      this.hideList();
    }

    hideValues(valToHide, dropdownVal) {
      this.setValue(dropdownVal);
      this.list.find('[data-val]').removeClass(this.hiddenClass);
      for (let i = 0; i < valToHide.length; i += 1) {
        this.list.find(`[data-val="${valToHide[i]}"]`).addClass(this.hiddenClass);
      }
    }

    showList(el) {
      this.dropdown.addClass(this.filledClass);
      if (!$(el).closest('.js-dropdown-clear').length) {
        this.dropdown.addClass(this.exploredClass);
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
        this.list.removeClass(this.invisibleClass);
        this.list.css('min-width', this.dropdown.outerWidth());
        this.list.css('top', $(el).offset().top + this.dropdown.outerHeight());
        this.list.css('left', $(el).offset().left);
      }
    }

    hideList() {
      this.dropdown.removeClass(this.exploredClass);
      this.list.addClass(this.invisibleClass);
    }

    clearDropdown() {
      if (this.dropdown.hasClass(this.filledClass)) {
        this.dropdown.removeClass(this.filledClass);
        this.hideList();
        // this.input.val('');
        this.options.attr('selected', false);
        if (this.input.closest('form').length) {
          this.input.valid();
        }
      }
    }
  }

  return new Dropdown(elem);
};
