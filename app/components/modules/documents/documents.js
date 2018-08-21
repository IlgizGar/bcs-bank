import $ from 'jquery';

module.exports = (elem) => {
  class DocumentsFilter {
    constructor(selector) {
      this.filter = $(selector);
      this.groups = $('.js-documents-group');

      this.init();
    }

    init() {
      if (this.filter.find('.js-input').val().length) {
        this.applyFilter(this.filter.find('option:selected').val());
      }
    }

    applyFilter(year) {
      this.groups.each((i, el) => {
        if ($(el).find('.collapse').length) {
          DocumentsFilter.checkCollapse($(el).find('.collapse'), year);
          const items = $(el).find('.collapse .collapse__item:not(.state_hidden)');
          items.last().addClass('state_no-border');
        } else {
          const $docs = $(el).find('[data-documents-year]');
          const $actual = $(el).find(`[data-documents-year="${year}"]`);
          if (year.length) {
            $docs.addClass('state_hidden');
            if ($actual.length) {
              $(el).removeClass('state_hidden');
              $actual.removeClass('state_hidden');
            } else {
              $(el).addClass('state_hidden');
            }
          } else {
            $(el).removeClass('state_hidden');
            $docs.removeClass('state_hidden');
          }
        }
      });

      $('.js-tab').each((i, el) => {
        if ($(el).find('.js-documents-group:not(.state_hidden)').length) {
          $(el).find('.documents__no-result').addClass('state_hidden');
        } else {
          $(el).append('<div class="documents__no-result">\n' +
            '                    <p>Документов этого года нет.</p>\n' +
            '                    <p>Попробуйте выбрать другой год.</p>\n' +
            '                  </div>');
        }
      });
    }

    static checkCollapse($collapse, year) {
      const $items = $collapse.find('.collapse__content');
      $items.each((i, el) => {
        const $docs = $(el).find('[data-documents-year]');
        const $actual = $(el).find(`[data-documents-year="${year}"]`);

        if (year.length) {
          if ($actual.length) {
            $(el).closest('.collapse__item').removeClass('state_hidden');
            $docs.addClass('state_hidden');
            $actual.removeClass('state_hidden');
          } else {
            $(el).closest('.collapse__item').addClass('state_hidden');
          }
        } else {
          $(el).closest('.collapse__item').removeClass('state_hidden');
          $docs.closest('.collapse__item').removeClass('state_no-border');
          $docs.removeClass('state_hidden');
        }
      });

      if (!$collapse.find('.collapse__item:not(.state_hidden)').length) {
        $collapse.closest('.documents__group').addClass('state_hidden');
      } else {
        $collapse.closest('.documents__group').removeClass('state_hidden');
      }
    }
  }

  return new DocumentsFilter(elem);
};
