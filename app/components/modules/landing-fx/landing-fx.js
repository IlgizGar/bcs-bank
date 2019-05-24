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
      $('[name="curseUsd"]').val(this.currencyOnline.USD.sell);
      $('[name="curseEur"]').val(this.currencyOnline.EUR.sell);
      $('[name="curseGbp"]').val(this.currencyOnline.GBP.sell);
      $('[name="curseUsdB"]').val(this.currencyOnline.USD.buy);
      $('[name="curseEurB"]').val(this.currencyOnline.EUR.buy);
      $('[name="curseGbpB"]').val(this.currencyOnline.GBP.buy);

      $('[name="cardVusd"]').val(this.currencyCard.USD.sell);
      $('[name="cardVeur"]').val(this.currencyCard.EUR.sell);
      $('[name="cardVgbp"]').val(this.currencyCard.GBP.sell);
      $('[name="cardVusdB"]').val(this.currencyCard.USD.buy);
      $('[name="cardVeurB"]').val(this.currencyCard.EUR.buy);
      $('[name="cardVgbpB"]').val(this.currencyCard.GBP.buy);

      $('[name="cardPusd"]').val(this.currencyCardPremium.USD.sell);
      $('[name="cardPeur"]').val(this.currencyCardPremium.EUR.sell);
      $('[name="cardPgbp"]').val(this.currencyCardPremium.GBP.sell);
      $('[name="cardPusdB"]').val(this.currencyCardPremium.USD.buy);
      $('[name="cardPeurB"]').val(this.currencyCardPremium.EUR.buy);
      $('[name="cardPgbpB"]').val(this.currencyCardPremium.GBP.buy);
      $('#courcesExchangeblock').find('input').trigger('change');
    });
  }
}
