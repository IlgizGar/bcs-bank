import $ from 'jquery';
import 'jscrollpane';

require('jquery-mousewheel')($);

module.exports = (elem) => {
  class Context {
    constructor(selector) {
      this.context = $(selector);
      this.select = this.context.find('select');
      this.options = this.select.find('option');
      this.title = this.context.find('.js-context-title');

      this.init();
      this.events();
    }

    init() {
      if (this.context.data('prefix')) {
        this.context.prepend(`<span class="context__prefix">${this.context.data('prefix')}</span>`);
      }
      if (!this.context.data('id')) {
        this.list = $('<div class="dropdown__list state_invisible scroll-pane js-context-list mt-16"><ul></ul></div>');
        $('.js-page').append(this.list);
        this.list.css('left', this.context.offset().left);
        this.options.each((i, el) => {
          this.list.find('ul').append(`
          <li data-val="${$(el).val()}">${$(el).html()}</li>
        `);
          if ($(el).attr('selected')) {
            this.context.addClass('state_filled');
            this.title.html($(el).html());
          }
        });
      } else {
        const id = this.context.data('id');
        this.list = $(`.js-context-list#${id}`);
      }

      this.context.find('.scroll-pane').jScrollPane({
        contentWidth: 100,
        verticalDragMinHeight: 16,
        verticalDragMaxHeight: 16,
        verticalGutter: 16,
        mouseWheelSpeed: 1,
        animateDuration: 1000,
      });
    }

    events() {
      this.context.on('click', (e) => {
        $(e.currentTarget).toggleClass('state_explored');
        this.list.toggleClass('state_invisible');
        this.list.css('top', `${this.context.offset().top + (this.context.outerHeight() - 5)}px`);
      });

      this.list.on('click', (e) => {
        if ($(e.target).closest('ul').length) {
          if (this.list.attr('id') !== 'undefined') {
            this.handleNamedList(this.list.attr('id'));
          } else {
            this.context.addClass('state_filled');
            this.title.html($(e.target).html());

            this.options.attr('selected', false);
            this.select.find(`[value="${$(e.target).data('val')}"]`).attr('selected', 'selected');
          }
        }
      });

      $(window).on('click', (e) => {
        if (!$(e.target).closest('.js-context').length) {
          global.contexts.forEach((el) => {
            el.hideList();
          });
        }
      });
    }

    hideList() {
      this.context.removeClass('state_explored');
      this.list.addClass('state_invisible');
    }

    handleNamedList(id) {
      this.context.addClass('state_filled');
      if (id === 'select-city') {
        console.log('CITY');
      }
    }
  }

  return new Context(elem);
};
