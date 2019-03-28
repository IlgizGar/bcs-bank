import $ from 'jquery';

// Вспомогательные методы
const getPriceValue = (value) => {
  if (value) {
    const valueParts = value.toFixed(2).toString().split('.');
    const firstPart = `<span>${valueParts[0]}</span>`;
    const secondPart = valueParts[1] ? `<span>,${valueParts[1]}</span>` : '';
    return firstPart + secondPart;
  }
  return 'load-error';
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
  constructor(id) {
    this.timer = null;
    this.exchangeBlock = $(id);
    this.updateTime = 30000;
    this.apiUrl = '';
    this.loadedData = null;
    this.dateBlock = this.exchangeBlock.closest('.js-card ').find('.js-exchange-date');
    this.getApiUrl();
    this.getExchangeCources();
  }
  getApiUrl() {
    this.apiUrl = this.exchangeBlock.closest('.js-card').attr('data-api-url');
  }
  // Exchange table
  getExchangeCources() {
    $.get(this.apiUrl, (response) => {
      const dateString = response.online_date;
      const date = new Date(dateString);
      this.date = `${date.getDate() < 10 ? 0 : ''}${date.getDate()}.${date.getMonth() < 10 ? 0 : ''}${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()} мск`;
      this.exchangeBlock.find('tbody')
        .replaceWith(ExchangeService.generateExchangeTable(this.getAdaptedData(response)));
      this.timer = setTimeout(() => {
        this.getExchangeCources();
      }, this.updateTime);
      this.dateBlock.html(this.date);
    });
  }

  getAdaptedData(data) { // метод для адаптации данных для построения таблицы
    this.loadedData = data;
    return data.online_courses;
  }
  static generateExchangeTable(data) {
    const tableContent = $('<tbody></tbody>');
    Object.keys(data).forEach((currency) => {
      tableContent.append(`
        <tr>
          <td class="services__table-currency">${currency}</td>
          <td>
            <div class="currency ${getPriceState(data[currency].sell, data[currency].prevSell)} ">
                ${getPriceValue(data[currency].sell)}
                <svg role="presentation" class="icon icon-fall_arrow "><use xlink:href="assets/images/icons.svg#icon_fall_arrow"></use></svg>
            </div>
          </td>
          <td>
            <div class="currency ${getPriceState(data[currency].buy, data[currency].prevBuy)} ">
                ${getPriceValue(data[currency].buy)}
                <svg role="presentation" class="icon icon-fall_arrow "><use xlink:href="assets/images/icons.svg#icon_fall_arrow"></use></svg>
            </div>
          </td>
        </tr>
      `);
    });
    return tableContent;
  }
}

// Фиксация курса
export class FixService {
  constructor() {
    this.fixBlock = $('#fix-service');
    this.apiUrl = this.fixBlock.closest('.js-card').attr('data-api-url');
    this.updateTime = 10000;
    this.dateBlock = this.fixBlock.closest('.js-card ').find('.js-fix-course-date');
    this.getFixCources();
  }

  // Exchange table
  getFixCources() {
    $.get(this.apiUrl, (response) => {
      const dateString = String(response.dealDate).split('.');
      const date = new Date(dateString[2], dateString[1], dateString[0]);
      this.date = `До ${date.getDate() < 10 ? 0 : ''}${date.getDate()}  ${FixService.getMonthName(date.getMonth() - 1)}  ${date.getFullYear()}`;
      this.updateTableData(response);
      setTimeout(() => {
        this.getFixCources();
      }, this.updateTime);
      this.dateBlock.html(this.date);
    });
  }

  updateTableData(data) {
    const USDControls = this.fixBlock.find('.js-course-radio[data-currency="USD"]');
    const EURControls = this.fixBlock.find('.js-course-radio[data-currency="EUR"]');
    //
    USDControls.each((i, el) => {
      if ($(el).children('.radio__field').attr('id') === 'course-buy_usd') {
        FixService.updateTableCellValue(el, parseFloat(data.usdBuy.replace(',', '.')));
      }
      if ($(el).children('.radio__field').attr('id') === 'course-sell_usd') {
        FixService.updateTableCellValue(el, parseFloat(data.usdSell.replace(',', '.')));
      }
    });

    EURControls.each((i, el) => {
      if ($(el).children('.radio__field').attr('id') === 'course-buy_eur') {
        FixService.updateTableCellValue(el, parseFloat(data.eurBuy.replace(',', '.')));
      }
      if ($(el).children('.radio__field').attr('id') === 'course-sell_eur') {
        FixService.updateTableCellValue(el, parseFloat(data.eurSell.replace(',', '.')));
      }
    });

    this.fixBlock.find('.radio__field:checked').closest('.js-course-radio').trigger('click');
  }

  static updateTableCellValue(el, price) {
    const input = $(el).children('.radio__field');
    FixService.updateTableCellState($(el).find('.currency'), price, input.val());
    input.val(price);
  }

  static updateTableCellState(el, current, old) {
    const newClassName = getPriceState(current, old);
    if (newClassName.length < 2) return;
    el.removeClass('state_rise')
      .removeClass('state_fall')
      .removeClass('state_hidden_arrow')
      .addClass(newClassName);
    el.find('span').each((i, element) => {
      $(element).remove();
    });
    el.find('svg').each((i, element) => {
      $(element).remove();
    });
    el.prepend(getPriceValue(current));
    el.append(' <svg role="presentation" class="icon icon-fall_arrow "><use xlink:href="assets/images/icons.svg#icon_fall_arrow"></use></svg>');
  }
  static getMonthName(mNum) {
    const monthArray = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];
    return monthArray[mNum];
  }
}

// Обмен валюты в отделениях банка

export class ExchangeBanksService extends ExchangeService {
  constructor(id) {
    super(id);
    this.initCityChange();
  }
  getApiUrl() {
    this.cityId = this.exchangeBlock.closest('.js-card')
      .find('.js-context option[selected]')
      .attr('value');
    this.apiUrl = this.exchangeBlock.closest('.js-card').attr('data-api-url');
    this.apiUrl = `${this.apiUrl}/${this.cityId}`;
  }
  initCityChange() {
    this.exchangeBlock.closest('.js-card')
      .find('.js-context')[0].addEventListener('contextchange', (e) => { // подпиываемся на кастомное событие компонента контекст
        this.cityId = e.target.contextValue;
        this.apiUrl = this.exchangeBlock.closest('.js-card').attr('data-api-url');
        this.apiUrl = `${this.apiUrl}/${this.cityId}`;
        clearTimeout(this.timer);
        this.getExchangeCources();
      }, false);
  }
  getAdaptedData(data) {
    this.loadedData = data;
    return data.bank_courses;
  }
}


export class ExchangeBanksServiceCorp extends ExchangeService {
  getAdaptedData(data) {
    this.loadedData = data;
    return data.bank_courses;
  }
}

export class ExchangeBanksServiceDefault extends ExchangeService {
  getAdaptedData(data) {
    this.loadedData = data;
    this.exchangeBlock[0].value = data.online_courses;
    this.exchangeBlock[0].dispatchEvent(new window.Event('change'));
    return data.online_courses;
  }
}

