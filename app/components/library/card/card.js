import $ from 'jquery';

module.exports = (elem) => {
  class Card {
    constructor(selector) {
      this.card = $(selector);
    }
  }

  return new Card(elem);
};
