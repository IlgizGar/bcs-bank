import $ from 'jquery';

// Вспомогательные методы
const getPriceValue = (value) => {
  const valueParts = value.toFixed(2).toString().split('.');
  const firstPart = `<span>${valueParts[0]}</span>`;
  const secondPart = valueParts[1] ? `<span>,${valueParts[1]}</span>` : '';
  return firstPart + secondPart;
};
const getPriceState = (current, old) => {
  let className = 'state_hidden_arrow';
  if (old) {
    const delta = current - old;
    if (delta > 0) {
      className = 'state_rise';
    }
    if (delta < 0) {
      className = 'state_fall';
    }
  }
  return className;
};


// Обмен валюты
export class ExchangeService {
  constructor() {
    this.exchangeBlock = $('#exchange-service');
    this.updateTime = 30000;
    this.apiUrl = this.exchangeBlock.closest('.js-card').attr('data-api-url');
    this.getExchangeCources();
  }

  // Exchange table
  getExchangeCources() {
    $.get(this.apiUrl + '/onlinecources/v1', (response) => {
      this.exchangeBlock.find('tbody').replaceWith(this.generateExchangeTable(response));
      setTimeout(() => {
        this.getExchangeCources();
      }, this.updateTime)
    })
  }
  generateExchangeTable(data) {
    let tableContent = $('<tbody></tbody>');
    for (const currency in data) {
      tableContent.append(`
        <tr>
          <td class="services__table-currency">${currency}</td>
          <td>
            <div class="currency ${getPriceState(data[currency].buy, data[currency].buy_previous)} ">
                ${getPriceValue(data[currency].buy)}
                <svg role="presentation" class="icon icon-fall_arrow "><use xlink:href="assets/images/icons.svg#icon_fall_arrow"></use></svg>
            </div>
          </td>
          <td>
            <div class="currency ${getPriceState(data[currency].sell, data[currency].sell_previous)} ">
                ${getPriceValue(data[currency].sell)}
                <svg role="presentation" class="icon icon-fall_arrow "><use xlink:href="assets/images/icons.svg#icon_fall_arrow"></use></svg>
            </div>
          </td>
        </tr>
      `);
    }
    return tableContent
  }
}

// Фиксация курса
export class FixService {
  constructor() {
    this.fixBlock = $('#fix-service');
    this.apiUrl = this.fixBlock.closest('.js-card').attr('data-api-url');
    this.updateTime = 10000;
    this.getFixCources();
  }

  // Exchange table
  getFixCources() {
    $.get(this.apiUrl + '/seltcources/v1', (response) => {
      this.updateTableData(response);
      setTimeout(() => {
        this.getFixCources();
      }, this.updateTime);

    })
  }

  updateTableData(data) {
    const USDControls = this.fixBlock.find('.js-course-radio[data-currency="USD"]');
    const EURControls = this.fixBlock.find('.js-course-radio[data-currency="EUR"]');

    USDControls.each((i, el) => {
      if ($(el).children('.radio__field').attr('id') === 'course-buy_usd') {
        this.updateTableCellValue(el, data.usd.buy)
      }
      if ($(el).children('.radio__field').attr('id') === 'course-sell_usd') {
        this.updateTableCellValue(el, data.usd.sell)
      }
    });

    EURControls.each((i, el) => {
      if ($(el).children('.radio__field').attr('id') === 'course-buy_eur') {
        this.updateTableCellValue(el, data.eur.buy)
      }
      if ($(el).children('.radio__field').attr('id') === 'course-sell_eur') {
        this.updateTableCellValue(el, data.eur.sell)
      }
    });

    this.fixBlock.find('.radio__field:checked').closest('.js-course-radio').trigger('click');
  }

  updateTableCellValue(el, price) {
    const input = $(el).children('.radio__field');
    this.updateTableCellState($(el).find('.currency'), price, input.val());
    input.val(price);
  }

  updateTableCellState(el, current, old) {
    const newClassName = getPriceState(current, old);
    if (newClassName.length < 2) return;
    el.removeClass('state_rise')
      .removeClass('state_fall')
      .removeClass('state_hidden_arrow')
      .addClass(newClassName);
    el.find('span').each((i, el) => {
      $(el).remove();
    });
    el.find('svg').each((i, el) => {
      $(el).remove();
    });
    el.prepend(getPriceValue(current));
    el.append(' <svg role="presentation" class="icon icon-fall_arrow "><use xlink:href="assets/images/icons.svg#icon_fall_arrow"></use></svg>');
  }
}

// Обмен валюты в отделениях банка

export class ExchangeBanksService extends ExchangeService {
  constructor() {
    super();
    this.exchangeBlock = $('#exchange-service-bank');
    this.apiUrl = this.exchangeBlock.closest('.js-card').attr('data-api-url');
    this.previosCourse = {};
    this.cityId = this.exchangeBlock.closest('.js-card')
      .find('.js-context option[selected]')
      .attr('value');
    this.initPrevCourceValue();
    this.initCityChange();
    this.timer = null;
  }
  initPrevCourceValue() {
    this.previosCourse.usd = {
      sell_previous: null,
      buy_previous: null,
    };
    this.previosCourse.eur = {
      sell_previous: null,
      buy_previous: null,
    };
  }

  getExchangeCources() {
    const url = `${this.apiUrl}/clearingcources/v1`;
    $.get(url, (response) => {
      this.exchangeBlock.find('tbody')
        .replaceWith(this.generateExchangeTable(this.getCityData(response)));
      this.timer = setTimeout(() => {
        this.getExchangeCources();
      }, this.updateTime);
    });
  }
  initCityChange() {
    this.exchangeBlock.closest('.js-card')
      .find('.js-context')[0].addEventListener('contextchange', (e) => { // подпиываемся на кастомное событие компонента контекст
        this.cityId = e.target.contextValue;
        clearTimeout(this.timer);
        this.initPrevCourceValue();
        this.getExchangeCources();
      }, false);
  }
  getCityData(data) {
    return this.dataAdapter(data[this.cityId]);
  }
  dataAdapter(cityData) {
    this.previosCourse.usd = {
      sell_previous: cityData.usd_sell,
      buy_previous: cityData.usd_buy,
    };
    this.previosCourse.eur = {
      sell_previous: cityData.eur_sell,
      buy_previous: cityData.eur_buy,
    };
    return {
      USD:
        {
          sell: cityData.usd_sell,
          sell_previous: this.previosCourse.usd.sell_previous,
          buy: cityData.usd_buy,
          buy_previous: this.previosCourse.usd.buy_previous,
          pub_date: cityData.pub_date,
        },
      EUR: {
        sell: cityData.eur_sell,
        sell_previous: this.previosCourse.eur.sell_previous,
        buy: cityData.eur_buy,
        buy_previous: this.previosCourse.eur.buy_previous,
        pub_date: cityData.pub_date,
      },
    };
  }
}


