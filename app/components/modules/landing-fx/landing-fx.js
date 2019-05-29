import $ from 'jquery';

export default class FxCourses {
  constructor() {
    this.currencyOnline = {};
    this.currencyCard = {};
    this.currencyCardPremium = {};
    this.apiUrl = $('.default-exchange-card').attr('data-api-url');
    this.getCurses();
  }
  getCurses() {
    $.get(this.apiUrl, (response) => {
      this.currencyOnline = response.online_courses;
      this.currencyCard = response.currency_courses;
      this.currencyCardPremium = response.currency_premium_courses;
      $('[name="curseUsd"]').val(this.currencyOnline.USD.buy);
      $('[name="curseEur"]').val(this.currencyOnline.EUR.buy);
      $('[name="curseGbp"]').val(this.currencyOnline.GBP.buy);
      $('[name="curseUsdB"]').val(this.currencyOnline.USD.sell);
      $('[name="curseEurB"]').val(this.currencyOnline.EUR.sell);
      $('[name="curseGbpB"]').val(this.currencyOnline.GBP.sell);

      $('[name="cardVusd"]').val(this.currencyCard.USD.buy);
      $('[name="cardVeur"]').val(this.currencyCard.EUR.buy);
      $('[name="cardVgbp"]').val(this.currencyCard.GBP.buy);
      $('[name="cardVusdB"]').val(this.currencyCard.USD.sell);
      $('[name="cardVeurB"]').val(this.currencyCard.EUR.sell);
      $('[name="cardVgbpB"]').val(this.currencyCard.GBP.sell);

      $('[name="cardPusd"]').val(this.currencyCardPremium.USD.buy);
      $('[name="cardPeur"]').val(this.currencyCardPremium.EUR.buy);
      $('[name="cardPgbp"]').val(this.currencyCardPremium.GBP.buy);
      $('[name="cardPusdB"]').val(this.currencyCardPremium.USD.sell);
      $('[name="cardPeurB"]').val(this.currencyCardPremium.EUR.sell);
      $('[name="cardPgbpB"]').val(this.currencyCardPremium.GBP.sell);
      $('[name="calc_exchange_curse_all"]').val(this.currencyOnline.USD.buy);
      $('[name="calc_exchange_curse"]').val(this.currencyCard.USD.buy);
      $('[name="calc_exchange_curse"]').trigger('change');
      $('[name="calc_exchange_curse_all"]').trigger('change');
      $('#courcesExchangeblock').find('input').trigger('change');
    });
  }
}
