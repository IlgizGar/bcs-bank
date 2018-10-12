import $ from 'jquery';
import Datepicker from '../../library/datepicker/datepicker';

export default class News {
  constructor() {
    this.newsBlock = $('.js-news');
    this.contentBlock = this.newsBlock.find('.js-news-cards');
    this.moreButton = this.newsBlock.find('.js-button[data-see-more]');
    this.apiUrl = this.newsBlock.data('api');
    this.currentPage = 1;
    this.dateFrom = null;
    this.dateTo = null;
    this.datepicker = Datepicker($('.datepicker-news-period'));

    this.init();
  }

  init() {
    this.pageLoadHandler();
    this.datepicker.init();
    this.datepicker.el.datepicker({
      onSelect: (formattedDate, date, inst) => {
        if (date.length === 2) {
          const arDate = formattedDate.split(',');
          global.contexts['news-period'].hideList();
          $(inst.el).prev('.js-context-item').text(`с ${arDate[0]} по ${arDate[1]}`).trigger('click');
          this.contentBlock.html('');
          this.dateFrom = date[0].getTime();
          this.dateTo = date[1].getTime();
          this.currentPage = 1;
          this.getNews();
        }
      },
    });
    $('.js-context-item-datepicker').on('click', () => {
      this.dateFrom = null;
      this.dateTo = null;
      this.currentPage = 1;
      this.getNews();
    });
  }

  getNews() {
    $.ajax({
      url: this.apiUrl,
      data: {
        from: this.dateFrom,
        to: this.dateTo,
        page: this.currentPage,
      },
      method: 'GET',
      dataType: 'json',
      success: (e) => {
        if (e.pagination.nextPage) {
          this.currentPage = e.pagination.currentPage;
        } else {
          this.moreButton.hide();
        }
        e.items.forEach((el) => {
          this.contentBlock.append(this.itemTemplate(el));
        });
      },
    });
  }

  pageLoadHandler() {
    this.moreButton.on('click', () => {
      this.currentPage += 1;
      this.getNews();
    });
  }

  itemTemplate(data) {
    return `<div class="card js-card  card_type-default card_hover-type-card card_view-uppercase  " data-href="${data.link}">
              <div class="card__wrap">
                <button class="card__action">
                  <div class="card__button">
                    <span>Читать</span>
                    <svg role="presentation" class="icon icon-arrow ">
                      <use xlink:href="assets/images/icons.svg#icon_arrow"></use>
                    </svg>
                  </div>
                </button>
                <div class="card__content">
                  <div class="card__heading">
                    <h2 class="card__title">${data.title}</h2>
                    <p class="card__subtitle">${data.date}</p>
                  </div>
                </div>
              </div>
            </div>`;
  }
}
