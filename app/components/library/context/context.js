import $ from 'jquery';
import 'jscrollpane';

require('jquery-mousewheel')($);

module.exports = (elem) => {
  class Context {
    constructor(selector) {
      this.context = $(selector);
      this.select = this.context.find('select');
      this.input = this.context.find('input');
      this.options = this.select.find('option');
      this.title = this.context.find('.js-context-title');
      this.scrollBarInited = false;
      this.id = '';

      this.init();
      this.events();
    }

    init() {
      if (this.context.data('prefix')) {
        this.context.prepend(`<span class="context__prefix">${this.context.data('prefix')}</span>`);
      }
      this.id = this.context.data('id');
      this.list = $(`.js-context-list#${this.id}`);

      if (!this.list.length) {
        this.list = $(`<div id="${this.id}" class="dropdown__list state_invisible scroll-pane js-context-list mt-16"><ul></ul></div>`);
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
      }

      // this.context.find('.scroll-pane').jScrollPane({
      //   contentWidth: 100,
      //   verticalDragMinHeight: 16,
      //   verticalDragMaxHeight: 16,
      //   verticalGutter: 16,
      //   mouseWheelSpeed: 1,
      //   animateDuration: 1000,
      // });
    }

    events() {
      this.context.on('click', (e) => {
        e.preventDefault();
        if (!this.scrollBarInited) {
          this.context.find('.scroll-pane').jScrollPane({
            contentWidth: 100,
            verticalDragMinHeight: 16,
            verticalDragMaxHeight: 16,
            verticalGutter: 16,
            mouseWheelSpeed: 1,
            animateDuration: 1000,
          });
          this.scrollBarInited = true;
        }
        $(e.currentTarget).toggleClass('state_explored');
        this.list.toggleClass('state_invisible');
        this.list.css('top', `${this.context.offset().top + (this.context.outerHeight() - 5)}px`);
        if (this.id === 'select-city') {
          $('body').toggleClass('state_unscroll');
        }
      });

      this.list.on('click', (e) => {
        this.handleNamedList(this.list.attr('id'), $(e.target));
        $('body').removeClass('state_unscroll');
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

    handleNamedList(id, el) {
      this.context.addClass('state_filled');
      switch (id) {
        case 'select-city':
          if ($(el).closest('.js-button').length) {
            const val = $(el).closest('.js-button').data('value');
            const title = $(el).closest('.js-button').data('city');
            this.input.val(val);
            this.title.html(title);
          }
          break;
        default:
          this.context.addClass('state_filled');
          this.title.html($(el).html());

          this.options.attr('selected', false);
          this.select.find(`[value="${$(el).data('val')}"]`).attr('selected', 'selected');
      }
    }
  }

  return new Context(elem);
};
