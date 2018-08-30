export default class News {
  constructor() {
    // this.getNews()
    this.currentPage = 1;
    this.nextPage = this.checkNextPage();
  }
  getNews() {
    $.ajax({
      url: $('.news').data('api'),
      method: 'GET',
      success: (e) => {
        e.items.forEach((el, i) => {
          $('.js-news-cards').append(this.itemTemplate(el));
        })
      }
    })
  }

  checkNextPage() {
    return !!$('.js-button[data-see-more]').lenght
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
