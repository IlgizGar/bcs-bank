import $ from 'jquery'
const bankApi = 'https://api.bcs.ru/currency';

// Обмен валюты
export class ExchangeService{
  constructor() {
    this.exchangeBlock = $('#exchange-service');
    this.updateTime = 30000;
    this.getExchangeCources();
  }

  // Exchange table
  getExchangeCources() {
    $.get(bankApi + '/onlinecources/v1', (response) => {
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
    this.updateTime = 10000;
    this.getFixCources();
  }

  // Exchange table
  getFixCources() {
    $.get(bankApi + '/seltcources/v1', (response) => {
      console.log('RESPONSE', response);

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
    el.removeClass('state_rise state_fall').addClass(newClassName);
    el.find('span').each((i, el) => {
      $(el).remove();
    });
    el.prepend(getPriceValue(current));
  }
}

// Вспомогательные методы
const getPriceValue = (value) => {
  const valueParts = value.toFixed(2).toString().split('.');
  const firstPart = `<span>${valueParts[0]}</span>`;
  const secondPart = valueParts[1] ? `<span>,${valueParts[1]}</span>` : '';
  return firstPart + secondPart
};
const getPriceState = (current, old) => {
  const delta = current - old;
  let className = ' ';
  if (delta > 0)
    className = 'state_rise';
  if (delta < 0)
    className = 'state_fall';
  return className
};
