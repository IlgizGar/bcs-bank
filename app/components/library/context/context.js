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
      this.id = this.context.data('id');
      this.list = $(`.js-context-list#${this.id}`);

      if (!this.list.length) {
        this.list = $(`<div id="${this.id}" class="dropdown__list state_invisible scroll-pane js-context-list mt-16"><ul></ul></div>`);
        $('.js-page').append(this.list);
        this.list.css('left', this.context.offset().left);
        this.options.each((i, el) => {
          const item = `<li class="js-context-item" data-val="${$(el).val()}" data-prefix="${$(el).data('prefix')}" data-title="${$(el).data('title')}">${$(el).html()}</li>`;
          this.list.find('ul').append($(item));
          if ($(el).attr('selected')) {
            this.handleNamedList($(item));
          }
        });
      } else {
        const $item = this.list.find('.js-context-item.state_selected');
        this.handleNamedList($item);
      }
    }

    events() {
      this.context.on('click', (e) => {
        e.preventDefault();
        if (this.context.hasClass('state_explored')) {
          this.hideList();
        } else {
          this.showList();
        }
      });

      this.list.on('click', (e) => {
        const $item = $(e.target).closest('.js-context-item');

        if ($item.length) {
          this.handleNamedList($item);
        }
      });

      $(window).on('click', (e) => {
        if (!$(e.target).closest('.js-context').length) {
          Object.values(global.contexts).forEach((context) => {
            context.hideList();
          });
        }
      });

      this.input.on('change', () => {
        if ($('.js-page-vacancies').length) {
          Context.handleVacancies(this.input.val());
        }
      });
    }

    showList() {
      this.context.addClass('state_explored');

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
      this.list.removeClass('state_invisible');
      this.list.css('top', `${this.context.offset().top + (this.context.outerHeight() - 5)}px`);
      if (this.id === 'select-city') {
        $('body').addClass('state_unscroll');
      }
    }

    hideList() {
      this.context.removeClass('state_explored');
      this.list.addClass('state_invisible');
      $('body').removeClass('state_unscroll');
    }

    handleNamedList($el) {
      console.log('ELEM', $el);

      const val = $el.data('value');
      const title = $el.data('title');

      this.context.addClass('state_filled');

      if ($el.data('prefix')) {
        if (this.context.find('.js-context-prefix').length) {
          this.context.find('.js-context-prefix').html($el.data('prefix'));
        } else {
          this.context.prepend(`<span class="context__prefix js-context-prefix">${$el.data('prefix')}</span>`);
        }
      } else {
        this.context.find('.js-context-prefix').remove();
      }

      if (title.length) {
        this.title.html(title);
      } else {
        this.title.html($el.html());
      }
      this.input.val(val);
      this.input.trigger('change');

      this.options.attr('selected', false);
      this.select.find(`[value="${$el.data('val')}"]`).attr('selected', 'selected');

      // switch (id) {
      //   case 'select-city':
      //     break;
      //   default:
      // }
    }

    static handleVacancies(id) {
      const $vacancies = $('.js-card[data-city]');
      const $active = $(`.js-card[data-city=${id}]`);


      $('.js-vacancies').find('.documents__no-result').remove();
      $vacancies.removeClass('state_no-margin-bottom');
      if (id === 'all') {
        $vacancies.removeClass('state_hidden');
      } else {
        $vacancies.addClass('state_hidden');
        if ($active.length) {
          $active.removeClass('state_hidden');
          $active.last().addClass('state_no-margin-bottom');
        } else {
          $('.js-vacancies').append('<div class="documents__no-result">\n' +
            '                    <p>Вакансий в этом городе нет.</p>\n' +
            '                    <p>Попробуйте выбрать другой город.</p>\n' +
            '                  </div>');
        }
      }
    }
  }

  return new Context(elem);
};
