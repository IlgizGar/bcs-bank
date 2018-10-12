import 'core-js/fn/symbol/iterator';
import 'core-js/es6/symbol';

import $ from 'jquery';

import svg4everybody from 'svg4everybody';
import Header from '../components/modules/header/header';
import Footer from '../components/modules/footer/footer';
import Menubar from '../components/modules/menubar/menubar';
import Contact from '../components/library/contact/contact';
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
import Card from '../components/library/card/card';
import Checkbox from '../components/library/checkbox/checkbox';
import PageHeader from '../components/modules/page-header/page-header';
import Offices from '../components/modules/offices/offices';
import DocumentsFilter from '../components/modules/documents/documents';
import IndexSearch from '../components/modules/index-search/index-search';
import News from '../components/modules/news/news';
import Search from '../components/modules/search/search';
import Lottie from 'lottie-web';

require('babel-polyfill');

$(() => {
  svg4everybody();

  global.dropdowns = [];
  $('.js-dropdown').each((i, el) => {
    global.dropdowns[$(el).data('id')] = Dropdown(el);
    // global.dropdowns.push(Dropdown(el));
  });

  global.contexts = {};
  $('.js-context').each((i, el) => {
    global.contexts[$(el).data('id')] = Context(el);
  });

  global.contacts = [];
  $('.js-contact').each((i, el) => {
    global.contacts.push(Contact(el));
  });

  global.tabs = [];
  $('.js-tabbar').each((i, el) => {
    global.tabs.push(Tabs(el));
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

  global.collapses = {};
  if ($('.collapse').length) {
    $('.collapse').each((i, el) => {
      global.collapses[$(el).data('id')] = new Collapse($(el));
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

  global.cards = [];
  if ($('.js-card').length) {
    $('.js-card').each((i, el) => {
      global.cards.push(new Card($(el)));
    });
    $(document).on('click', '.js-card', (e) => {
      if ($(e.currentTarget).data('href')) {
        window.location.href = $(e.currentTarget).data('href');
      }
    });
  }

  global.checkboxes = [];
  if ($('.js-checkbox').length) {
    $('.js-checkbox').each((i, el) => {
      global.checkboxes.push(new Checkbox($(el)));
    });
  }

  if ($('.js-offices').length) {
    global.officesMap = new Offices($('.js-offices'));
  }

  if ($('.js-dropdown[data-id="documents-filter"]').length) {
    global.documentsFilter = DocumentsFilter(('.js-dropdown[data-id="documents-filter"]'));
  }

  if ($('.js-index-search').length) {
    global.indexSearch = IndexSearch($('.js-index-search'));
  }

  global.news = [];
  if ($('.js-news').length) {
    global.news.push(new News());
  }

  global.search = [];
  if ($('.js-search').length) {
    global.search.push(new Search());
  }

  global.menubar = new Menubar();

  global.header = Header('.js-header');
  global.footer = new Footer();

  if ($('[data-illustration]').length) {
    $('[data-illustration]').each((i, el) => {
      if ($(el).data('illustration').length) {
        Lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: `assets/illustrations/${$(el).data('illustration')}.json`
        })
      }
    });
  }
});
