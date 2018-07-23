//Три этих файла нужны для нормальной работы JS в IE

require('babel-polyfill');
import "core-js/fn/symbol/iterator.js";
import "core-js/es6/symbol.js";

import $ from 'jquery';
import svg4everybody from 'svg4everybody';

import Header from '../components/modules/header/header';
import Contact from '../components/library/contact/contact';
import Accordion from '../components/library/accordion/accordion';
import Dropdown from '../components/library/dropdown/dropdown';
import Context from '../components/library/context/context';
import Carousel from '../components/library/carousel/carousel';
import MediaSlider from '../components/library/media-slider/media-slider';
import TableSort from '../components/library/table/table';
import Collapse from '../components/library/collapse/collapse';
import Input from '../components/library/input/input';
import Tabs from '../components/modules/tabbar/tabbar';
// import Datepicker from '../components/library/datepicker/datepicker';

$(() => {
  svg4everybody();
  global.header = Header('.js-header');

  global.dropdowns = [];
  for (const dropdown of $('.js-dropdown')) {
    global.dropdowns.push(Dropdown(dropdown));
  }

  global.contexts = [];
  for (const context of $('.js-context')) {
    global.contexts.push(Context(context));
  }

  global.contacts = [];
  for (const contact of $('.js-contact')) {
    global.contacts.push(Contact(contact));
  }

  global.tabs = [];
  for (const tab of $('.js-tabbar')) {
    global.tabs.push(Tabs(tab));
  }

  global.accordions = [];
  for (const accordion of $('.js-accordion')) {
    global.accordions.push(Accordion(accordion));
  }

  global.carousels = [];
  for (const carousel of $('.js-carousel')) {
    global.carousels.push(Carousel(carousel));
  }

  global.inputs = [];
  for (const input of $('.js-input')) {
    global.inputs.push(Input(input));
  }

  global.mediaSliders = [];
  if ($('.media-slider').length) {
    $('.media-slider').each((i, el) => {
      global.mediaSliders.push(MediaSlider($(el)));
    });
  }

  global.collapses = [];
  if ($('.collapse').length) {
    $('.collapse').each((i, el) => {
      global.collapses.push(new Collapse($(el)));
    })
  }

  global.sortableTables = [];
  if ($('.table_sortable').length) {
    $('.table_sortable').each((i, el) => {
      global.sortableTables.push(new TableSort($(el)))
    })
  }

  // global.datepickers = [];
  // for (const datepicker of $('.js-datepicker')) {
  //   global.datepickers.push(Datepicker(datepicker));
  // }
});
