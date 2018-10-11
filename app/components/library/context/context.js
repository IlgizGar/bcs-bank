import $ from 'jquery';
import 'jscrollpane';
import Cookie from 'js-cookie';

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
      this.list = null;

      this.init();
      this.events();
    }

    init() {
      this.id = this.context.data('id');
      this.list = $(`.js-context-list#${this.id}`);

      console.log('ID', this.id);


      if (!this.list.length) {
        this.list = $(`<div id="${this.id}" class="dropdown__list state_invisible scroll-pane js-context-list mt-16"><ul></ul></div>`);
        $('.js-page').append(this.list);
        this.options.each((i, el) => {
          let itemLeft = `<li class="dropdown__list-item js-context-item" data-val="${$(el).val()}"`;
          let item = '';

          if ($(el).data('href')) {
            item = `><a href="${$(el).data('href')}">${$(el).html()}</a></li>`;
          } else {
            item = `>${$(el).html()}</li>`;
          }

          if ($(el).data('title')) {
            itemLeft += ` data-title="${$(el).data('title')}"`;
          }
          if ($(el).data('prefix')) {
            itemLeft += ` data-prefix="${$(el).data('prefix')}"`;
          }
          item = itemLeft + item;
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

    getListData() {
      const listData = [];
      this.list.find('.js-context-item').each((i, el) => {
        listData.push({
          id: $(el).attr('data-value') ? $(el).attr('data-value') : null,
          title: $(el).text().trim(),
        });
      });
      return listData;
    }

    events() {

      $(window).on('click', (e) => {
        if ($(e.target.closest('.js-context'))) {
          e.preventDefault();
          if (this.context.hasClass('state_explored')) {
            this.hideList();
          } else {
            this.showList();
          }
        }
      });

      this.list.on('click', (e) => {
        const $item = $(e.target).closest('.js-context-item');

        if ($item.length) {
          if ($item.hasClass('js-checkbox')) {
            console.log('SELECT_INPUT');
          } else {
            Cookie.set(this.id, $item.attr('data-value'));
            if ($item.length) {
              this.handleNamedList($item);
              if (this.id === 'credit-types') {
                Context.handleCreditCardTypes(this.context);
              }
            }
          }
        }
      });

      $(window).on('click', (e) => {
        if (!$(e.target).closest('.js-checkbox').length) {
          if (!$(e.target).closest('.js-context').length && e.target.getAttribute('class') !== null) {
            if (e.target.getAttribute('class').indexOf('datepicker') === -1) {
              Object.values(global.contexts).forEach((context) => {
                context.hideList();
              });
            }
          }
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
      this.setPosition();
    }

    setPosition(el) {
      const list = el || this.list;

      list.css('top', `${this.context.offset().top + (this.context.outerHeight() - 5)}px`);

      if (this.list.data('type') === 'modal-view' && !el) {
        const totalHeight = list.offset().top + list.outerHeight();
        if (totalHeight > window.outerHeight) {
          $('.js-page').css('max-height', totalHeight).addClass('state_no-overflow');
        } else {
          $('body').addClass('state_unscroll');
        }
      } else {
        let listLeft = this.context.offset().left;
        const attr = this.context.attr('data-list-on-right');
        if (typeof attr !== typeof undefined && attr !== false) {
          listLeft -= list.outerWidth() - this.context.outerWidth();
        }
        list.css('left', listLeft);
      }
    }

    hideList() {
      if (this.context.hasClass('state_explored')) {
        this.context.removeClass('state_explored');
        this.list.addClass('state_invisible');
        if (this.list.data('type') === 'modal-view') {
          $('body').removeClass('state_unscroll');
          $('.js-page').css('max-height', 'none').removeClass('state_no-overflow');
        }
      }
    }

    handleNamedList($el) {
      if ($el.length) {
        if (!$el.find('a').length) {
          const val = $el.data('value');
          const name = $el.text().trim();

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

          if ($el.data('title')) {
            this.title.html($el.data('title'));
          } else {
            this.title.html($el.text().trim());
          }
          this.input.val(val);
          this.input.attr('data-text', name);
          this.input.trigger('change');

          this.options.attr('selected', false);
          this.select.find(`[value="${$el.data('val')}"]`).attr('selected', 'selected');
        }
      }
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

    static handleCreditCardTypes($el) {
      const $options = $el.find('select option');

      $options.each((i, item) => {
        if ($(item).is(':selected')) {
          $('#' + $(item).val()).removeClass('state_invisible');
        } else {
          $('#' + $(item).val()).addClass('state_invisible');
        }
      })
    }
  }

  return new Context(elem);
};
