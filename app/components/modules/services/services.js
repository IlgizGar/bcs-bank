import $ from 'jquery'

export default class IndexServices{
  constructor() {
    this.bankApi = 'https://api.bcs.ru/currency/onlinecources/v1';
    this.exchangeBlock = $('#exchange-service');
    this.getExchangeCources();
  }

  // Exchange table
  getExchangeCources() {
    $.get(this.bankApi, (response) => {
      this.exchangeBlock.find('tbody').replaceWith(this.generateExchangeTable(response));
      setTimeout(() => {
        this.getExchangeCources();
      }, 30000)
    })
  }
  generateExchangeTable(data) {
    let tableContent = $('<tbody></tbody>');
    for (const currency in data) {
      tableContent.append(`
        <tr>
          <td class="services__table-currency">${currency}</td>
          <td>
            <div class="currency ${this.getPriceState(data[currency].buy, data[currency].buy_previous)} ">
                ${this.getPriceValue(data[currency].buy)}
                <svg role="presentation" class="icon icon-fall_arrow "><use xlink:href="assets/images/icons.svg#icon_fall_arrow"></use></svg>
            </div>
          </td>
          <td>
            <div class="currency ${this.getPriceState(data[currency].sell, data[currency].sell_previous)} ">
                ${this.getPriceValue(data[currency].sell)}
                <svg role="presentation" class="icon icon-fall_arrow "><use xlink:href="assets/images/icons.svg#icon_fall_arrow"></use></svg>
            </div>
          </td>
        </tr>
      `);
      console.log(tableContent);
    }
    return tableContent
  }
  getPriceValue(value) {
    const valueParts = value.toString().split('.');
    return `<span>${valueParts[0]}</span><span>,${valueParts[1]}</span>`
  }
  getPriceState(current, old) {
    const delta = current - old;
    console.log(delta);
    let className = ' ';
    if (delta > 0)
      className = 'state_rise';
    if (delta < 0)
      className = 'state_fall';
    return className
  }
}
