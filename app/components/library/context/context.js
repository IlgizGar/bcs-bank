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
      this.exploredClass = 'state_explored';
      this.invisibleClass = 'state_invisible';

      this.init();
      this.events();
    }

    init() {
      this.id = this.context.data('id');
      this.list = $(`.js-context-list#${this.id}`);

      if (!this.list.length) {
        this.list = $(`<div id="${this.id}" class="dropdown__list ${this.invisibleClass} scroll-pane js-context-list mt-16"><ul></ul></div>`);
        $('.js-page').append(this.list);
        console.log(this.options);
        this.options.each((i, el) => {
          this.renderItem(el);
        });
      } else {
        this.handleNamedList(this.list.find('.js-context-item.state_selected'));
      }
    }
    renderItem(el) {
      const $option = $(el);
      const item = `<li class="dropdown__list-item js-context-item ${$option.data('class') ? $option.data('class') : ''}" data-val="${$option.val()}" 
      ${$option.data('title') ? ` data-title="${$option.data('title')}"` : ''}  
      ${$option.data('prefix') ? ` data-prefix="${$option.data('prefix')}"` : ''}
      ${$option.data('href') ? `><a href="${$option.data('href')}">${$option.html()}</a></li>` : `>${$option.html()}</li>`}`;
      this.list.find('ul').append($(item));
      if ($option.attr('selected')) {
        this.handleNamedList($(item));
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
      // добавим кастомное событие
      // const customEvent = document.createEvent('Event');
      // customEvent.initEvent('contextchange', true, true);

      let customEvent;
      if(typeof(Event) === 'function') {
        customEvent = new Event('contextchange');
      }else{
        customEvent = document.createEvent('Event');
        customEvent.initEvent('contextchange', true, true);
      }

      //
      $(document).on('click', `.js-context[data-id="${this.id}"]`, (e) => {
        e.preventDefault();
        if (this.context.hasClass(this.exploredClass)) {
          this.hideList();
        } else {
          this.showList();
        }
      });

      this.list.on('click', (e) => {
        const $item = $(e.target).closest('.js-context-item');

        if ($item.length) {
          if (!$item.hasClass('js-checkbox')) {
            Cookie.set(this.id, $item.attr('data-value'));
            if ($item.length) {
              this.handleNamedList($item);
              if (this.id === 'credit-types') {
                Context.handleCreditCardTypes(this.context);
              }
            }
          }
          // вызываем кастомное событие
          this.context[0].contextValue = $item.attr('data-val');
          this.context[0].dispatchEvent(customEvent);
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
      this.context.addClass(this.exploredClass);

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
      this.list.removeClass(this.invisibleClass);
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
      if (this.context.hasClass(this.exploredClass)) {
        this.context.removeClass(this.exploredClass);
        this.list.addClass(this.invisibleClass);
        if (this.list.data('type') === 'modal-view') {
          $('body').removeClass('state_unscroll');
          $('.js-page').css('max-height', 'none').removeClass('state_no-overflow');
        }
      }
    }

    handleNamedList($el) {
      const className = 'context__prefix';
      const jsClassName = 'js-context-prefix';
      if ($el.length) {
        if (!$el.find('a').length) {
          const val = $el.data('value');
          const name = $el.text().trim();

          this.context.addClass('state_filled');
          const jsContentPrefix = () => this.context.find(`.${jsClassName}`);
          if ($el.data('prefix')) {
            if (jsContentPrefix().length) {
              jsContentPrefix().html($el.data('prefix'));
            } else {
              this.context.prepend(`<span class="${className} ${jsClassName}">${$el.data('prefix')}</span>`);
            }
          } else {
            jsContentPrefix().remove();
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
      const hiddenClass = 'state_hidden';
      const marginClass = 'state_no-margin-bottom';
      const $vacansiesEl = $('.js-vacancies');
      $vacansiesEl.find('.documents__no-result').remove();
      $vacancies.removeClass(marginClass);
      if (id === 'all') {
        $vacancies.removeClass(hiddenClass);
      } else {
        $vacancies.addClass(hiddenClass);
        if ($active.length) {
          $active.removeClass(hiddenClass);
          $active.last().addClass(marginClass);
        } else {
          $vacansiesEl.append('<div class="documents__no-result">\n' +
            '                    <p>Вакансий в этом городе нет.</p>\n' +
            '                    <p>Попробуйте выбрать другой город.</p>\n' +
            '                  </div>');
        }
      }
    }

    static handleCreditCardTypes($el) {
      const $options = $el.find('select option');
      const hiddenClass = 'state_invisible';
      $options.each((i, item) => {
        const itemEl = $(`#${$(item).val()}`);
        const selected = $(item).is(':selected') ? (itemEl.removeClass(hiddenClass)) : (itemEl.addClass(hiddenClass));
        console.log(selected);
      });
    }
  }

  return new Context(elem);
};
