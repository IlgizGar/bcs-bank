import $ from 'jquery';

export default class FxCourses {
  constructor() {
    this.currencyOnline = {};
    this.currencyCard = {};
    this.currencyCardPremium = {};
    this.apiUrl = $('.default-exchange-card').attr('data-api-url');
  }
  getCurses() {
    $.get(this.apiUrl, (response) => {
      this.currencyOnline = response.online_courses;
      this.currencyCard = response.currency_courses;
      this.currencyCardPremium = response.currency_premium_courses;
    });
  }
}
