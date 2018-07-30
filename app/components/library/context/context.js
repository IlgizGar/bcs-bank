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
      if(this.context.data('prefix')) {
        this.context.prepend('<span class="context__prefix">' + this.context.data('prefix') + '</span>');
      }
      $('body').append('<div class="dropdown__list state_inactive scroll-pane js-context-list mt-16"><ul></ul></div>');
      this.list = $('.js-context-list');

      for (const option of this.options) {
        this.list.find('ul').append(`
          <li data-val="${$(option).val()}">${$(option).html()}</li>
        `);
        if ($(option).attr('selected')) {
          this.context.addClass('state_filled');
          this.title.html($(option).html());
        }
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
        this.list.toggleClass('state_inactive');
        this.list.css('top', this.context.offset().top + this.context.outerHeight());
        this.list.css('left', this.context.offset().left);
      });

      this.list.on('click', (e) => {
        if ($(e.target).closest('ul').length) {
          this.context.addClass('state_filled');
          this.title.html($(e.target).html());

          this.options.attr('selected', false);
          this.select.find('[value="' + $(e.target).data('val') + '"]').attr('selected', 'selected');
        }
      });

      $(window).on('click', (e) => {
        if (!$(e.target).closest('.js-context').length) {
          for (const context of global.contexts) {
            context.hideList();
          }
        }
      });
    }

    hideList() {
      this.context.removeClass('state_explored');
      this.list.addClass('state_inactive');
    }
  }

  return new Context(elem);
};
