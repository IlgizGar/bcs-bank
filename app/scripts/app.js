// Три этих файла нужны для нормальной работы JS в IE
import 'core-js/fn/symbol/iterator';
import 'core-js/es6/symbol';

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
import Modal from '../components/library/modal/modal';
import FileInput from '../components/library/file-input/file-input';
import Form from '../components/library/form/form';
import Input from '../components/library/input/input';
import Tabs from '../components/modules/tabbar/tabbar';
import PageHeader from '../components/modules/page-header/page-header';

require('babel-polyfill');
// import Datepicker from '../components/library/datepicker/datepicker';


$(() => {
  svg4everybody();
  global.header = Header('.js-header');
  global.dropdowns = [];
  $('.js-dropdown').each((i, el) => {
    global.dropdowns.push(Dropdown(el));
  });
  global.contexts = [];
  $('.js-context').each((i, el) => {
    global.contexts.push(Context(el));
  });
  global.contacts = [];
  $('.js-contact').each((i, el) => {
    global.contacts.push(Contact(el));
  });
  global.tabs = [];
  $('.js-tabbar').each((i, el) => {
    global.tabs.push(Tabs(el));
  });
  global.accordions = [];
  $('.js-accordion').each((i, el) => {
    global.accordions.push(Accordion(el));
  });
  global.carousels = [];
  $('.js-carousel').each((i, el) => {
    global.carousels.push(Carousel(el));
  });
  global.inputs = [];
  $('.js-input').each((i, el) => {
    global.inputs.push(Input(el));
  });
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
    });
  }
  global.sortableTables = [];
  if ($('.js-table-sortable').length) {
    $('.js-table-sortable').each((i, el) => {
      global.sortableTables.push(new TableSort($(el)));
    });
  }
  global.modals = [];
  if ($('.js-open-modal').length) {
    $('.js-open-modal').each((i, el) => {
      global.modals.push(new Modal($(el)));
    });
  }
  if ($('.page-header_vacancy').length) {
    const headerHandler = new PageHeader();
    headerHandler.nav = $('.page-header_vacancy .page-header__nav');
    headerHandler.addStickyTitle();
    headerHandler.stickyHandler();
  }
  if ($('.file-input').length) {
    global.fileInput = new FileInput();
  }
  global.forms = [];
  if ($('.js-form').length) {
    $('.js-form').each((i, el) => {
      global.forms.push(new Form($(el).find('form')));
    });
  }
  // global.datepickers = [];
  // for (const datepicker of $('.js-datepicker')) {
  //   global.datepickers.push(Datepicker(datepicker));
  // }
});
