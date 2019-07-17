import $ from 'jquery';

export default class FxCourses {
  constructor() {
    this.apiUrl = $('.default-exchange-card').attr('data-api-url');
    this.getCurses();
  }
  getCurses() {
    function setVal(name, val) {
      $(`[name="${name}"]`).val(val);
    }
    $.get(this.apiUrl, (response) => {
      const currencyOnline = response.online_courses;
      const currencyCard = response.currency_courses;
      const currencyCardPremium = response.currency_premium_courses;
      const conf = [
        {
          name: 'curseUsd',
          val: currencyOnline.USD.buy,
        },
        {
          name: 'curseEur',
          val: currencyOnline.EUR.buy,
        },
        {
          name: 'curseGbp',
          val: currencyOnline.GBP.buy,
        },
        {
          name: 'curseUsdB',
          val: currencyOnline.USD.sell,
        },
        {
          name: 'curseEurB',
          val: currencyOnline.EUR.sell,
        },
        {
          name: 'curseGbpB',
          val: currencyOnline.GBP.sell,
        },
        {
          name: 'cardVusd',
          val: currencyCard.USD.buy,
        },
        {
          name: 'cardVeur',
          val: currencyCard.EUR.buy,
        },
        {
          name: 'cardVgbp',
          val: currencyCard.GBP.buy,
        },
        {
          name: 'cardVusdB',
          val: currencyCard.USD.sell,
        },
        {
          name: 'cardVeurB',
          val: currencyCard.EUR.sell,
        },
        {
          name: 'cardVgbpB',
          val: currencyCard.GBP.sell,
        },
        {
          name: 'cardPusd',
          val: currencyCardPremium.USD.buy,
        },
        {
          name: 'cardPeur',
          val: currencyCardPremium.EUR.buy,
        },
        {
          name: 'cardPgbp',
          val: currencyCardPremium.GBP.buy,
        },
        {
          name: 'cardPusdB',
          val: currencyCardPremium.USD.sell,
        },
        {
          name: 'cardPeurB',
          val: currencyCardPremium.EUR.sell,
        },
        {
          name: 'cardPgbpB',
          val: currencyCardPremium.GBP.sell,
        },
        {
          name: 'calc_exchange_curse_all',
          val: currencyOnline.USD.buy,
        },
        {
          name: 'calc_exchange_curse',
          val: currencyCard.USD.buy,
        },
      ];
      conf.forEach((input) => {
        setVal(input.name, input.val);
      });
      $('[name="calc_exchange_curse"]').trigger('change');
      $('[name="calc_exchange_curse_all"]').trigger('change');
      $('#courcesExchangeblock').find('input').trigger('change');
    });
  }
}
